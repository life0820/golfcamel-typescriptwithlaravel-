<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class AirportLookupTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $file = storage_path('database/csv/airports.csv');

        $data = array_map('str_getcsv', file($file));

        $headers = array_shift($data);

        foreach ($data as $row) {
            $row = array_combine($headers, $row);
            DB::table('airport_lookup')->insert($row);
        }

    }
}
