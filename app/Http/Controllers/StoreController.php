<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    public function index()
    {
        $stores = Auth::user()->stores;
        return Inertia::render('Store/Index', [
            'stores' => $stores
        ]);
    }

    public function create()
    {
        return Inertia::render('Store/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
        ]);

        $store = Auth::user()->stores()->create($validated);

        return redirect()->route('stores.show', $store->id)
            ->with('success', 'Store created successfully.');
    }

    public function show(Store $store)
    {
        $this->authorize('view', $store);

        return Inertia::render('Store/Show', [
            'store' => $store
        ]);
    }

    public function edit(Store $store)
    {
        $this->authorize('update', $store);

        return Inertia::render('Store/Edit', [
            'store' => $store
        ]);
    }

    public function update(Request $request, Store $store)
    {
        $this->authorize('update', $store);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
        ]);

        $store->update($validated);

        return redirect()->route('stores.show', $store->id)
            ->with('success', 'Store updated successfully.');
    }

    public function destroy(Store $store)
    {
        $this->authorize('delete', $store);

        $store->delete();

        return redirect()->route('stores.index')
            ->with('success', 'Store deleted successfully.');
    }

    public function profile()
    {
        // Get the first store or create a default one
        $store = Auth::user()->stores()->first();

        if (!$store) {
            $store = Auth::user()->stores()->create([
                'name' => Auth::user()->name . '\'s Store',
            ]);
        }

        return Inertia::render('Store/Profile', [
            'store' => $store
        ]);
    }

    public function updateProfile(Request $request)
    {
        $store = Auth::user()->stores()->first();

        if (!$store) {
            return redirect()->route('store.profile')
                ->with('error', 'No store found.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
        ]);

        $store->update($validated);

        return redirect()->back()->with('success', 'Store profile updated successfully.');
    }
}
