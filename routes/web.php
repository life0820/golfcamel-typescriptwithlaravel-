<?php

use App\Http\Controllers\FlightController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CartController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('cart', CartController::class)->middleware(['auth']);
//Route::prefix('cart')->group(function () {
//    Route::get('/', [CartController::class, 'index'])->name('cart.index');
//})->middleware(['auth'])->name('cart');

Route::prefix('flight')->group(function () {
    Route::get('/result', [FlightController::class, 'result'])->name('flight.result');
    Route::get('/getAirports/{keyword}', [FlightController::class, 'searchAirports'])->name('flight.getAirports');
    Route::post('/search-flight-offers', [FlightController::class, 'searchFlightOffers'])->name('flight.search');
    Route::post('/get-flight-offer-price', [FlightController::class, 'getFlightOfferPrice'])->name('flight.getFlightOfferPrice');
    Route::post('/offer/to-cart/save', [FlightController::class, 'saveFlightOfferToCart'])->name('flight.saveFlightOfferToCart');
});

require __DIR__.'/auth.php';
