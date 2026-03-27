<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImportController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products/import', [ProductImportController::class, 'store']);
Route::put('/products/{product}', [ProductController::class, 'update']);
