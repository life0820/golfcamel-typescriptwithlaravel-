<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class AirlineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = storage_path('database/csv/airlines.dat');

        $data = array_map('str_getcsv', file($file));

        $headers = array_shift($data);

        foreach ($data as $row) {
            $row = array_combine($headers, $row);
            DB::table('airline')->insert($row);
        }
    }
}
