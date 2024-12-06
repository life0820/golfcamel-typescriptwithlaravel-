<?php

namespace App\Http\Controllers;
use App\Services\AmadeusService;
use Illuminate\Http\Request;

class FlightController extends Controller
{
    private $amadeusService;

    public function __construct(AmadeusService $amadeusService)
    {
        $this->amadeusService = $amadeusService;
    }

    public function searchAirports(Request $request, $keyword) {
        $data = $this->amadeusService->searchAirports($keyword);

        return response()->json($data['data']);
    }

}
