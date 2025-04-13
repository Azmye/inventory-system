<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index()
    {
        $store = Auth::user()->stores()->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('error', 'Please set up your store first.');
        }

        $products = $store->products()
            ->with(['category', 'stocks'])
            ->get()
            ->map(function ($product) {
                $product->stock = $product->stocks->first();
                unset($product->stocks);
                return $product;
            });

        $breadcrumbs = [
            ['title' => 'Products', 'href' => route('products.index')],
        ];

        return Inertia::render('product/index', [
            'products' => $products,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function create()
    {
        $store = Auth::user()->stores()->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('error', 'Please set up your store first.');
        }

        $categories = $store->categories;

        $breadcrumbs = [
            ['title' => 'Products', 'href' => route('products.index')],
            ['title' => 'Create'],
        ];

        return Inertia::render('product/new-edit-form', [
            'categories' => $categories,
            'breadcrumbs' => $breadcrumbs
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|max:100|unique:products,sku',
            'barcode' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'cost' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'initial_stock' => 'nullable|integer|min:0',
            'reorder_level' => 'nullable|integer|min:0',
            'location' => 'nullable|string|max:255',
        ]);

        // Remove non-product fields
        $initialStock = $validated['initial_stock'] ?? 0;
        $reorderLevel = $validated['reorder_level'] ?? 10;
        $location = $validated['location'] ?? null;

        unset($validated['initial_stock']);
        unset($validated['reorder_level']);
        unset($validated['location']);

        // Add store_id to product data
        $validated['store_id'] = $store->id;

        // Create product
        $product = Product::create($validated);

        // Create initial stock
        if ($initialStock > 0) {
            Stock::create([
                'product_id' => $product->id,
                'store_id' => $store->id,
                'quantity' => $initialStock,
                'reorder_level' => $reorderLevel,
                'location' => $location,
            ]);

            // Create stock transaction for initial stock
            $product->stockTransactions()->create([
                'store_id' => $store->id,
                'user_id' =>  Auth::id(),
                'quantity' => $initialStock,
                'type' => 'in',
                'reference' => 'Initial Stock',
                'notes' => 'Initial stock when creating product',
            ]);
        } else {
            // Create empty stock record
            Stock::create([
                'product_id' => $product->id,
                'store_id' => $store->id,
                'quantity' => 0,
                'reorder_level' => $reorderLevel,
                'location' => $location,
            ]);
        }

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        $this->authorize('view', $product);

        $product->load(['category', 'stocks']);
        $product->stock = $product->stocks->first();
        unset($product->stocks);

        // Get recent stock transactions
        $recentTransactions = $product->stockTransactions()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('product/Show', [
            'product' => $product,
            'recentTransactions' => $recentTransactions
        ]);
    }

    public function edit(Product $product)
    {
        $this->authorize('update', $product);

        $product->load('category');
        $store = Auth::user()->stores()->first();
        $categories = $store->categories;

        return Inertia::render('product/new-edit-form', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $this->authorize('update', $product);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|max:100|unique:products,sku,' . $product->id,
            'barcode' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'cost' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $product->update($validated);

        return redirect()->route('products.index', $product->id)
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
