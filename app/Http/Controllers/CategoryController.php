<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $store = Auth::user()->stores()->with('categories')->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('error', 'Please set up your store first.');
        }

        $categories = $store->categories;


        $breadcrumbs = [
            ['title' => 'Categories', 'href' => route('categories.index')],

        ];

        return Inertia::render('category/index', [
            'categories' => $categories,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function create()
    {
        $breadcrumbs = [
            ['title' => 'Categories', 'href' => route('categories.index')],
            ['title' => 'Create', 'href' => route('categories.create')],

        ];

        return Inertia::render('category/new-edit-form', [
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
        ]);

        $validated['store_id'] = $store->id;

        $category = Category::create($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        $this->authorize('update', $category);

        return Inertia::render('category/new-edit-form', [
            'category' => $category
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
