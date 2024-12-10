<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BookingType;

class BookingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            
            ['bookingTypeCode' => 'DA', 'bookingTypeDescription' => 'Desert Adventures'],
            ['bookingTypeCode' => 'SA', 'bookingTypeDescription' => 'Sabre'],
            ['bookingTypeCode' => 'ZG', 'bookingTypeDescription' => 'Zest Golf'],
            
        ];

        foreach ($data as $key => $value) {

            BookingType::create($value);
            
        }
    }
}
