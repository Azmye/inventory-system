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

        // Get product count
        $productCount = $store->products()->count();

        // Get total stock value
        $stockValue = Stock::where('store_id', $store->id)
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
        $topProducts = StockTransaction::where('store_id', $store->id)
            ->where('type', 'out')
            ->with('product')
            ->selectRaw('product_id, SUM(quantity) as total_sold')
            ->groupBy('product_id')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'productCount' => $productCount,
                'stockValue' => $stockValue,
                'lowStockCount' => $lowStockCount,
            ],
            'recentTransactions' => $recentTransactions,
            'topProducts' => $topProducts
        ]);
    }
}
