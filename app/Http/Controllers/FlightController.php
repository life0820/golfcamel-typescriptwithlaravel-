<?php

namespace App\Http\Controllers;
use App\Models\TestTable;
use App\Models\AirportLookup;
use App\Services\AmadeusService;
use Illuminate\Http\Request;
use App\Http\Requests\FlightRequest;
use Inertia\Inertia;

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

    public function searchFlightOffers(FlightRequest $request) {
        $data = $request->all();

//        $flightLists = $this->amadeusService->searchFlights($data);
       $data = TestTable::where('id', 4)->first();
//        TestTable::insert(['data' => serialize(array_slice($flightLists['data'], 0, 1))]);
//        return response()->json($flightLists['data']);
         return response()->json(unserialize($data['data']));
    }

    public function getFlightOfferPrice(Request $request)
    {
        $data = $request->all();

        $params = [
            "data" => [
                "type" => "flight-offers-pricing",
                "flightOffers" => [$data['offer']]
            ]
        ];

        $flightOfferPrice = $this->amadeusService->getFlightOfferPrice($params);

        $iataCodes = $data['iataCodes'];

        $details = AirportLookup::whereIn('iata_code', $iataCodes)->get();
        return response()->json([
            "flightOfferPrice" => $flightOfferPrice,
            "details" => $details
        ]);
    }
    public function result(Request $request)
    {
        $params = $request->query->all();

        return Inertia::render('Flight', $params);
    }

}
