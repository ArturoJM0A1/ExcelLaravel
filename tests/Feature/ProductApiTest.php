<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_can_be_imported_from_an_excel_file(): void
    {
        $file = $this->createExcelUpload([
            ['Nombre', 'Precio', 'Descripcion', 'Cantidad', 'URL de imagen del producto'],
            ['Mesa editorial', 1499.9, 'Cubierta de nogal con acabado mate', 4, 'https://example.com/mesa.jpg'],
            ['Lampara grafica', 799.5, 'Luz calida para estudio y escaparate', 11, 'https://example.com/lampara.jpg'],
        ]);

        $response = $this->post('/api/products/import', ['file' => $file], ['Accept' => 'application/json']);

        $response
            ->assertCreated()
            ->assertJsonPath('summary.processed_rows', 2)
            ->assertJsonPath('summary.valid_rows', 2)
            ->assertJsonCount(2, 'products');

        $this->assertDatabaseHas('products', [
            'name' => 'Mesa editorial',
            'quantity' => 4,
        ]);
    }

    public function test_import_returns_row_errors_and_does_not_persist_invalid_products(): void
    {
        $file = $this->createExcelUpload([
            ['Nombre', 'Precio', 'Descripcion', 'Cantidad', 'URL de imagen del producto'],
            ['Silla "Raw"', 499.9, 'Asiento con respaldo de acero', 3, 'https://example.com/silla.jpg'],
        ]);

        $response = $this->post('/api/products/import', ['file' => $file], ['Accept' => 'application/json']);

        $response
            ->assertStatus(422)
            ->assertJsonPath('summary.processed_rows', 1)
            ->assertJsonPath('summary.invalid_rows', 1);

        $this->assertDatabaseCount('products', 0);
    }

    public function test_products_can_be_updated_after_importing_them(): void
    {
        $product = Product::query()->create([
            'name' => 'Librero modular',
            'price' => 999.99,
            'description' => 'Mueble vertical para exhibir productos',
            'quantity' => 2,
            'image_url' => 'https://example.com/librero.jpg',
        ]);

        $response = $this->putJson("/api/products/{$product->id}", [
            'name' => 'Librero editorial',
            'price' => 1299.99,
            'description' => 'Mueble vertical para exhibicion editorial',
            'quantity' => 5,
            'image_url' => 'https://example.com/librero-editorial.jpg',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('product.name', 'Librero editorial')
            ->assertJsonPath('product.quantity', 5);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Librero editorial',
            'quantity' => 5,
        ]);
    }

    /**
     * @param  array<int, array<int, mixed>>  $rows
     */
    private function createExcelUpload(array $rows): UploadedFile
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        foreach ($rows as $rowIndex => $row) {
            foreach (array_values($row) as $columnIndex => $value) {
                $sheet->setCellValue([$columnIndex + 1, $rowIndex + 1], $value);
            }
        }

        $directory = storage_path('framework/testing');

        if (! is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        $path = $directory.'/products-'.uniqid('', true).'.xlsx';
        register_shutdown_function(static fn () => @unlink($path));

        $writer = new Xlsx($spreadsheet);
        $writer->save($path);

        return new UploadedFile(
            $path,
            basename($path),
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            null,
            true
        );
    }
}