<?php

namespace App\Services;

use App\Support\ProductValidationRules;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ProductSpreadsheetImporter
{
    /**
     * @var array<string, array<int, string>>
     */
    private const HEADER_ALIASES = [
        'name' => ['nombre', 'name', 'producto', 'product_name'],
        'price' => ['precio', 'price', 'costo', 'amount'],
        'description' => ['descripcion', 'description', 'detalle'],
        'quantity' => ['cantidad', 'quantity', 'stock', 'existencia'],
        'image_url' => [
            'url_de_imagen_del_producto',
            'url_imagen',
            'url_de_imagen',
            'imagen_url',
            'image_url',
            'product_image_url',
            'urlimagen',
        ],
    ];

    /**
     * Parse and validate an uploaded spreadsheet.
     *
     * @return array<string, mixed>
     */
    public function parse(UploadedFile $file): array
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $rows = $spreadsheet->getActiveSheet()->toArray(null, true, false, true);

        if ($rows === []) {
            return $this->errorResult(
                ['El archivo no contiene informacion para procesar.'],
                [],
                0,
                0
            );
        }

        $headerRow = array_shift($rows) ?? [];
        $headerMap = $this->buildHeaderMap($headerRow);
        $missingColumns = $this->missingColumns($headerMap);

        if ($missingColumns !== []) {
            return $this->errorResult(
                ['Faltan columnas obligatorias: '.implode(', ', $missingColumns).'.'],
                [],
                0,
                0
            );
        }

        $products = [];
        $rowErrors = [];
        $processedRows = 0;

        foreach ($rows as $index => $row) {
            $payload = $this->extractPayload($row, $headerMap);

            if ($this->isEmptyRow($payload)) {
                continue;
            }

            $processedRows++;
            $excelRow = $index + 2;
            $validator = Validator::make(
                $payload,
                ProductValidationRules::rules(),
                [],
                ProductValidationRules::attributes()
            );

            if ($validator->fails()) {
                foreach ($validator->errors()->messages() as $field => $messages) {
                    $rowErrors[] = [
                        'row' => $excelRow,
                        'field' => $field,
                        'messages' => array_values($messages),
                    ];
                }

                continue;
            }

            $products[] = [
                'name' => trim((string) $payload['name']),
                'price' => round((float) $payload['price'], 2),
                'description' => trim((string) $payload['description']),
                'quantity' => (int) $payload['quantity'],
                'image_url' => trim((string) $payload['image_url']),
            ];
        }

        if ($processedRows === 0) {
            return $this->errorResult(
                ['El archivo no contiene filas con productos.'],
                [],
                0,
                0
            );
        }

        if ($rowErrors !== []) {
            return $this->errorResult(
                ['Se encontraron errores de validacion en una o mas filas.'],
                $rowErrors,
                $processedRows,
                count($products)
            );
        }

        return [
            'products' => $products,
            'file_errors' => [],
            'row_errors' => [],
            'summary' => [
                'processed_rows' => $processedRows,
                'valid_rows' => count($products),
                'invalid_rows' => 0,
            ],
            'required_columns' => ProductValidationRules::requiredColumns(),
        ];
    }

    /**
     * @param  array<string, mixed>  $headerRow
     * @return array<string, string>
     */
    private function buildHeaderMap(array $headerRow): array
    {
        $columns = [];

        foreach ($headerRow as $column => $value) {
            $normalized = $this->normalizeHeader((string) $value);

            if ($normalized !== '') {
                $columns[$normalized] = (string) $column;
            }
        }

        $resolved = [];

        foreach (self::HEADER_ALIASES as $field => $aliases) {
            foreach ($aliases as $alias) {
                $normalizedAlias = $this->normalizeHeader($alias);

                if (isset($columns[$normalizedAlias])) {
                    $resolved[$field] = $columns[$normalizedAlias];
                    break;
                }
            }
        }

        return $resolved;
    }

    /**
     * @param  array<string, string>  $headerMap
     * @return array<int, string>
     */
    private function missingColumns(array $headerMap): array
    {
        $missing = [];

        foreach ([
            'name' => 'Nombre',
            'price' => 'Precio',
            'description' => 'Descripcion',
            'quantity' => 'Cantidad',
            'image_url' => 'URL de imagen del producto',
        ] as $field => $label) {
            if (! isset($headerMap[$field])) {
                $missing[] = $label;
            }
        }

        return $missing;
    }

    /**
     * @param  array<string, mixed>  $row
     * @param  array<string, string>  $headerMap
     * @return array<string, mixed>
     */
    private function extractPayload(array $row, array $headerMap): array
    {
        return [
            'name' => $this->normalizeText($row[$headerMap['name']] ?? null),
            'price' => $this->normalizePrice($row[$headerMap['price']] ?? null),
            'description' => $this->normalizeText($row[$headerMap['description']] ?? null),
            'quantity' => $this->normalizeQuantity($row[$headerMap['quantity']] ?? null),
            'image_url' => $this->normalizeText($row[$headerMap['image_url']] ?? null),
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function isEmptyRow(array $payload): bool
    {
        foreach ($payload as $value) {
            if ($value !== null && $value !== '') {
                return false;
            }
        }

        return true;
    }

    private function normalizeHeader(string $value): string
    {
        return (string) Str::of($value)
            ->trim()
            ->lower()
            ->ascii()
            ->replaceMatches('/[^a-z0-9]+/', '_')
            ->trim('_');
    }

    private function normalizeText(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $text = trim((string) $value);

        return $text === '' ? null : $text;
    }

    private function normalizePrice(mixed $value): mixed
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (float) $value;
        }

        $normalized = trim((string) $value);
        $normalized = str_replace(['$', 'MXN', 'USD', ' '], '', strtoupper($normalized));

        if (preg_match('/^\d+,\d+$/', $normalized) === 1) {
            $normalized = str_replace(',', '.', $normalized);
        }

        return $normalized;
    }

    private function normalizeQuantity(mixed $value): mixed
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value) && floor((float) $value) === (float) $value) {
            return (int) $value;
        }

        return trim((string) $value);
    }

    /**
     * @param  array<int, string>  $fileErrors
     * @param  array<int, array<string, mixed>>  $rowErrors
     * @return array<string, mixed>
     */
    private function errorResult(array $fileErrors, array $rowErrors, int $processedRows, int $validRows): array
    {
        $invalidRows = [];

        foreach ($rowErrors as $error) {
            $invalidRows[$error['row']] = true;
        }

        return [
            'products' => [],
            'file_errors' => $fileErrors,
            'row_errors' => $rowErrors,
            'summary' => [
                'processed_rows' => $processedRows,
                'valid_rows' => $validRows,
                'invalid_rows' => count($invalidRows),
            ],
            'required_columns' => ProductValidationRules::requiredColumns(),
        ];
    }
}