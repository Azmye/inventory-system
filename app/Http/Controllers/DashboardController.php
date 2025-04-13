<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Stock;
use App\Models\StockTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $store = Auth::user()->stores()->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('message', 'Please set up your store profile first.');
        }

        $breadcrumbs = [
            ['title' => 'Dashboard', 'href' => route('dashboard')]
        ];

        // Get product count
        $productCount = $store->products()->count();

        // Get total stock value
        $stockValue = Stock::where('stocks.store_id', $store->id)
            ->join('products', 'stocks.product_id', '=', 'products.id')
            ->selectRaw('SUM(stocks.quantity * products.cost) as total_value')
            ->first()
            ->total_value ?? 0;

        // Get low stock items count
        $lowStockCount = Stock::where('store_id', $store->id)
            ->whereRaw('quantity <= reorder_level')
            ->count();

        // Get recent transactions
        $recentTransactions = StockTransaction::where('store_id', $store->id)
            ->with(['product', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Get top selling products
        $topProducts = Product::where('products.store_id', $store->id)
            ->leftJoin('stock_transactions', function ($join) {
                $join->on('products.id', '=', 'stock_transactions.product_id')
                    ->where('stock_transactions.type', '=', 'out');
            })
            ->selectRaw('products.id, products.name, COALESCE(SUM(stock_transactions.quantity), 0) as total_sold')
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        // Get today's transaction count
        $todayTransactionCount = StockTransaction::where('store_id', $store->id)
            ->whereDate('created_at', today())
            ->count();

        // Get low stock products for the second card
        $lowStockProducts = Stock::where('store_id', $store->id)
            ->whereRaw('quantity <= reorder_level')
            ->with('product')
            ->limit(5)
            ->get()
            ->map(function ($stock) {
                return [
                    'id' => $stock->product->id,
                    'name' => $stock->product->name,
                    'quantity' => $stock->quantity,
                    'reorder_level' => $stock->reorder_level
                ];
            });



        return Inertia::render('dashboard', [
            'breadcrumbs' => $breadcrumbs,
            'stats' => [
                'productCount' => $productCount,
                'stockValue' => $stockValue,
                'lowStockCount' => $lowStockCount,
                'todayTransactionCount' => $todayTransactionCount,
            ],
            'recentTransactions' => $recentTransactions,
            'topProducts' => $topProducts,
            'lowStockProducts' => $lowStockProducts,
            'store' => $store
        ]);
    }
}
