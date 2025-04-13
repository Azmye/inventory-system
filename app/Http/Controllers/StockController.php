<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Product;
use App\Models\StockTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StockController extends Controller
{
    public function index()
    {
        $store = Auth::user()->stores()->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('error', 'Please set up your store first.');
        }

        $stocks = Stock::where('store_id', $store->id)
            ->with('product')
            ->get();

        return Inertia::render('stock/index', [
            'stocks' => $stocks
        ]);
    }

    public function create()
    {
        $store = Auth::user()->stores()->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('error', 'Please set up your store first.');
        }

        $products = $store->products()
            ->where('status', 'active')
            ->get();

        return Inertia::render('stock/new-edit-form', [
            'products' => $products,
            'type' => 'in'
        ]);
    }

    public function out()
    {
        $store = Auth::user()->stores()->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('error', 'Please set up your store first.');
        }

        $products = $store->products()
            ->where('status', 'active')
            ->with('stocks')
            ->get()
            ->map(function ($product) {
                $product->current_stock = $product->stocks->first() ? $product->stocks->first()->quantity : 0;
                unset($product->stocks);
                return $product;
            });

        return Inertia::render('stock/new-edit-form', [
            'products' => $products,
            'type' => 'out'
        ]);
    }

    public function store(Request $request)
    {
        $store = Auth::user()->stores()->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('error', 'Please set up your store first.');
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:in,out,adjustment',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Check if the product belongs to the user's store
        if ($product->store_id !== $store->id) {
            return redirect()->back()
                ->with('error', 'You do not have permission to update this product\'s stock.');
        }

        // Get or create stock record
        $stock = Stock::firstOrCreate(
            ['product_id' => $product->id, 'store_id' => $store->id],
            ['quantity' => 0, 'reorder_level' => 10]
        );

        // Create stock transaction
        $transaction = new StockTransaction();
        $transaction->product_id = $product->id;
        $transaction->store_id = $store->id;
        $transaction->user_id = Auth::id();
        $transaction->quantity = $validated['quantity'];
        $transaction->type = $validated['type'];
        $transaction->reference = $validated['reference'];
        $transaction->notes = $validated['notes'];
        $transaction->save();

        // Update stock quantity
        if ($validated['type'] === 'in') {
            $stock->quantity += $validated['quantity'];
        } elseif ($validated['type'] === 'out') {
            // Ensure we don't go below zero
            if ($stock->quantity < $validated['quantity']) {
                return redirect()->back()
                    ->with('error', 'Insufficient stock available for ' . $product->name);
            }
            $stock->quantity -= $validated['quantity'];
        } else { // adjustment
            $stock->quantity = $validated['quantity'];
        }

        $stock->save();

        return redirect()->route('stocks.index')
            ->with('success', 'Stock updated successfully.');
    }

    public function history($productId)
    {
        $store = Auth::user()->stores()->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('error', 'Please set up your store first.');
        }

        $product = Product::where('id', $productId)
            ->where('store_id', $store->id)
            ->firstOrFail();

        $transactions = StockTransaction::where('product_id', $product->id)
            ->where('store_id', $store->id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('stock/history', [
            'product' => $product,
            'transactions' => $transactions
        ]);
    }

    public function report()
    {
        $store = Auth::user()->stores()->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('error', 'Please set up your store first.');
        }

        // Get stock value summary
        $stocks = Stock::where('store_id', $store->id)
            ->with('product')
            ->get();

        $totalStockValue = 0;
        $totalItems = 0;
        $lowStockItems = 0;

        foreach ($stocks as $stock) {
            $totalStockValue += $stock->quantity * $stock->product->cost;
            $totalItems += $stock->quantity;

            if ($stock->quantity <= $stock->reorder_level) {
                $lowStockItems++;
            }
        }

        // Get top selling products (based on stock out transactions)
        $topSellingProducts = StockTransaction::where('store_id', $store->id)
            ->where('type', 'out')
            ->with('product')
            ->selectRaw('product_id, SUM(quantity) as total_sold')
            ->groupBy('product_id')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        // Get recent transactions
        $recentTransactions = StockTransaction::where('store_id', $store->id)
            ->with(['product', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('stock/report', [
            'summary' => [
                'totalStockValue' => $totalStockValue,
                'totalItems' => $totalItems,
                'totalProducts' => $store->products()->count(),
                'lowStockItems' => $lowStockItems,
            ],
            'topSellingProducts' => $topSellingProducts,
            'recentTransactions' => $recentTransactions,
            'stocks' => $stocks
        ]);
    }
}
