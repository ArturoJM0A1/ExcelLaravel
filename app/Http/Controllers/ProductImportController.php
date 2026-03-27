<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportProductsRequest;
use App\Models\Product;
use App\Services\ProductSpreadsheetImporter;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ProductImportController extends Controller
{
    /**
     * Import products from a spreadsheet, replacing the current catalog.
     */
    public function store(ImportProductsRequest $request, ProductSpreadsheetImporter $importer): JsonResponse
    {
        $result = $importer->parse($request->file('file'));

        if ($result['file_errors'] !== [] || $result['row_errors'] !== []) {
            return response()->json([
                'message' => 'No se pudo importar el archivo. Corrige los errores y vuelve a intentarlo.',
                'file_errors' => $result['file_errors'],
                'errors' => $result['row_errors'],
                'summary' => $result['summary'],
                'required_columns' => $result['required_columns'],
            ], 422);
        }

        DB::transaction(function () use ($result): void {
            Product::query()->delete();

            $timestamp = now();
            $records = array_map(static fn (array $product): array => [
                ...$product,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ], $result['products']);

            Product::query()->insert($records);
        });

        return response()->json([
            'message' => 'Archivo importado correctamente.',
            'products' => Product::query()->orderBy('name')->get(),
            'summary' => $result['summary'],
        ], 201);
    }
}
