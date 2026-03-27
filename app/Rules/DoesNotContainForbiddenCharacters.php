<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class DoesNotContainForbiddenCharacters implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            return;
        }

        if (preg_match('/[\'"´`¨]/u', $value)) {
            $fail('El campo :attribute contiene caracteres no permitidos. Evita usar comillas simples, comillas dobles o acentos graves.');
        }
    }
}
