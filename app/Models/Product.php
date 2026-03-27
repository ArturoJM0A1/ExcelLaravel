<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'description',
        'quantity',
        'image_url',
    ];

    protected $casts = [
        'price' => 'float',
        'quantity' => 'integer',
    ];
}
