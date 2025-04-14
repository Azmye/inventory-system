<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Store;
use App\Models\Category;
use App\Models\Product;
use App\Models\Stock;
use App\Models\StockTransaction;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create demo user if none exists
        $user = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('password'),
            ]
        );

        // Create a store
        $store = Store::create([
            'user_id' => $user->id,
            'name' => 'Demo Store',
            'address' => '123 Demo Street',
            'city' => 'Demo City',
            'state' => 'DS',
            'postal_code' => '12345',
            'country' => 'Demo Country',
            'phone' => '555-1234',
            'email' => 'store@example.com',
        ]);

        // Create some categories
        $categories = [
            'Electronics' => 'Electronic devices and accessories',
            'Clothing' => 'Apparel and fashion items',
            'Home Goods' => 'Items for home and living',
            'Office Supplies' => 'Stationery and office equipment'
        ];

        foreach ($categories as $name => $description) {
            Category::create([
                'store_id' => $store->id,
                'name' => $name,
                'description' => $description
            ]);
        }

        // Create some products with stock for each category
        $allCategories = Category::all();
        foreach ($allCategories as $category) {
            for ($i = 1; $i <= 5; $i++) {
                $product = Product::create([
                    'store_id' => $store->id,
                    'category_id' => $category->id,
                    'name' => "{$category->name} Item {$i}",
                    'description' => "This is a demo {$category->name} item #{$i}",
                    'sku' => strtoupper(substr($category->name, 0, 3)) . "-" . str_pad($i, 3, '0', STR_PAD_LEFT),
                    'barcode' => rand(1000000000000, 9999999999999),
                    'price' => rand(10, 100) + 0.99,
                    'cost' => rand(5, 50) + 0.50,
                    'tax' => 7.50,
                    'status' => 'active'
                ]);

                // Add stock for this product
                $stock = Stock::create([
                    'product_id' => $product->id,
                    'store_id' => $store->id,
                    'quantity' => rand(10, 100),
                    'reorder_level' => 10,
                    'location' => "Aisle " . chr(65 + rand(0, 5)) . "-" . rand(1, 20)
                ]);

                // Create some stock transactions
                $types = ['in', 'out', 'adjustment'];
                for ($j = 1; $j <= 3; $j++) {
                    $type = $types[array_rand($types)];
                    $quantity = $type === 'in' ? rand(5, 20) : ($type === 'out' ? -rand(1, 10) : rand(-5, 5));

                    StockTransaction::create([
                        'product_id' => $product->id,
                        'store_id' => $store->id,
                        'user_id' => $user->id,
                        'quantity' => $quantity,
                        'type' => $type,
                        'reference' => "DEMO-" . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT),
                        'notes' => "Demo transaction #{$j} for {$product->name}"
                    ]);
                }
            }
        }
    }
}
