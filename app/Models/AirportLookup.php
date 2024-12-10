<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AirportLookup extends Model
{
    use HasFactory;

    protected $table = 'airport_lookup';
    protected $primaryKey = 'id';

}
