<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BookingStatus;

class BookingStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [

            ['statusDescription' => 'Booked'],
            ['statusDescription' => 'Cancelled'],
            ['statusDescription' => 'In Cart'],
            ['statusDescription' => 'Payment Declined'],
            ['statusDescription' => 'Refunded'],
            ['statusDescription' => 'Not Available failed'],
            ['statusDescription' => 'Payment to Golf Zest failed'],
            ['statusDescription' => 'Payment to Sabre failed'],
            ['statusDescription' => 'Payment to Golf Camels failed'],

        ];

        foreach ($data as $key => $value) {

            BookingStatus::create($value);

        }


    }
}
