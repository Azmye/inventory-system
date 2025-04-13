<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Store Profile
    Route::get('/store/profile', [StoreController::class, 'profile'])->name('store.profile');
    Route::patch('/store/profile', [StoreController::class, 'updateProfile'])->name('store.update');

    // Store Management
    Route::resource('stores', StoreController::class);

    // Category Management
    Route::resource('categories', CategoryController::class);

    // Product Management
    Route::resource('products', ProductController::class);

    // Stock Management
    Route::get('/stocks', [StockController::class, 'index'])->name('stocks.index');
    Route::get('/stocks/create', [StockController::class, 'create'])->name('stocks.create');
    Route::get('/stocks/out', [StockController::class, 'out'])->name('stocks.out');
    Route::post('/stocks', [StockController::class, 'store'])->name('stocks.store');
    Route::get('/stocks/history/{product}', [StockController::class, 'history'])->name('stocks.history');
    Route::get('/stocks/report', [StockController::class, 'report'])->name('stocks.report');

    // User Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
