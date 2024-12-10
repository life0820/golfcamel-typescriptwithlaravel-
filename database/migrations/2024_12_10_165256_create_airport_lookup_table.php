<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('airport_lookup', function (Blueprint $table) {
            $table->id();
            $table->string('ident', 10);
            $table->enum('type', ['closed', 'heliport', 'balloonport', 'seaplane_base', 'small_airport', 'medium_airport', 'large_airport']);
            $table->string('name', 100);
            $table->string('latitude_deg', 100);
            $table->string('longitude_deg', 100);
            $table->string('elevation_ft', 20);
            $table->string('continent', 20);
            $table->string('iso_country', 20);
            $table->string('iso_region', 10);
            $table->string('municipality', 100);
            $table->string('scheduled_service', 10);
            $table->string('gps_code', 10);
            $table->string('iata_code', 10);
            $table->string('local_code', 10);
            $table->text('home_link');
            $table->text('wikipedia_link');
            $table->text('keywords');
            $table->boolean('enabled')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('airport_lookup');
    }
};
