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
        Schema::create('country_lookup', function (Blueprint $table) {
            $table->id();
            $table->string('countryCode', 2);
            $table->string('countryName', 50);
            $table->string('currency', 3)->nullable();
            $table->integer('taxRate')->nullable();
            $table->integer('enabled');
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
        Schema::dropIfExists('country_lookup');
    }
};
