<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CountryLookup extends Model
{
    use HasFactory;

    protected $table = 'country_lookup';
    protected $primaryKey = 'id';

    protected $hidden = [
        'enabled',
    ];

}
