<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Product $product)
    {
        // Check if the product belongs to any of the user's stores
        return $user->stores()->where('id', $product->store_id)->exists();
    }

    public function update(User $user, Product $product)
    {
        return $user->stores()->where('id', $product->store_id)->exists();
    }

    public function delete(User $user, Product $product)
    {
        return $user->stores()->where('id', $product->store_id)->exists();
    }
}
