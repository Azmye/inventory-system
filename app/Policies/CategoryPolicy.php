<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CategoryPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Category $category)
    {
        return $user->stores()->where('id', $category->store_id)->exists();
    }

    public function update(User $user, Category $category)
    {
        return $user->stores()->where('id', $category->store_id)->exists();
    }

    public function delete(User $user, Category $category)
    {
        return $user->stores()->where('id', $category->store_id)->exists();
    }
}
