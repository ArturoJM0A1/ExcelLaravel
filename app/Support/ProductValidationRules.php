<?php

namespace App\Support;

use App\Rules\DoesNotContainForbiddenCharacters;

class ProductValidationRules
{
    /**
     * Shared product rules for import and edition.
     *
     * @return array<string, array<int, mixed>>
     */
    public static function rules(): array
    {
        return [
            'name' => ['bail', 'required', 'string', 'max:160', new DoesNotContainForbiddenCharacters()],
            'price' => ['bail', 'required', 'numeric', 'min:0'],
            'description' => ['bail', 'required', 'string', 'max:2000', new DoesNotContainForbiddenCharacters()],
            'quantity' => ['bail', 'required', 'integer', 'min:0'],
            'image_url' => ['bail', 'required', 'string', 'max:2048', 'url', new DoesNotContainForbiddenCharacters()],
        ];
    }

    /**
     * Human-friendly labels for validator messages.
     *
     * @return array<string, string>
     */
    public static function attributes(): array
    {
        return [
            'name' => 'nombre',
            'price' => 'precio',
            'description' => 'descripcion',
            'quantity' => 'cantidad',
            'image_url' => 'URL de imagen',
        ];
    }

    /**
     * Mandatory spreadsheet columns exposed to the frontend.
     *
     * @return array<int, string>
     */
    public static function requiredColumns(): array
    {
        return [
            'Nombre',
            'Precio',
            'Descripcion',
            'Cantidad',
            'URL de imagen del producto',
        ];
    }
}