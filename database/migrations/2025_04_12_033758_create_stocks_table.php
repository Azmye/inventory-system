<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(0);
            $table->integer('reorder_level')->default(10);
            $table->string('location')->nullable();
            $table->timestamps();

            // Unique constraint to ensure one stock record per product per store
            $table->unique(['product_id', 'store_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
