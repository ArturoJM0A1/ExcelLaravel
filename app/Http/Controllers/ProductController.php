<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * List all products ordered alphabetically.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'products' => Product::query()->orderBy('name')->get(),
        ]);
    }

    /**
     * Update a product and return its latest state.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());

        return response()->json([
            'message' => 'Producto actualizado correctamente.',
            'product' => $product->fresh(),
        ]);
    }
}
