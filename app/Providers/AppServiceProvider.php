<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

    protected $policies = [
        'App\Models\Store' => 'App\Policies\StorePolicy',
        'App\Models\Product' => 'App\Policies\ProductPolicy',
        'App\Models\Category' => 'App\Policies\CategoryPolicy',
    ];
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
