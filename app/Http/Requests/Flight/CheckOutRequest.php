<?php

namespace App\Http\Requests\Flight;

use Illuminate\Foundation\Http\FormRequest;

class CheckOutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'travelers' => 'required|array',
            'travelers.*.name' => 'required|array',
            'travelers.*.contact' => 'required|array',
            'travelers.*.dateOfBirth' => 'required|string|max:255',
            'travelers.*.gender' => 'required|string|max:255',
            'travelers.*.name.*' => 'required|string|max:255',
            'travelers.*.contact.*' => 'required|string|max:255',
            'travelers.*.contact.*.emailAddress' => 'required|email|max:255',
        ];
    }
}
