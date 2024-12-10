<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class AmadeusService
{
    private $client;
    private $baseUrl;
    private $accessToken;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => config('services.amadeus.base_url'),
        ]);
        $this->authenticate();
    }

    private function authenticate()
    {
        $response = $this->client->post("/v1/security/oauth2/token", [
            'form_params' => [
                'grant_type' => 'client_credentials',
                'client_id' => config('services.amadeus.client_id'),
                'client_secret' => config('services.amadeus.client_secret'),
            ],
        ]);

        $data = json_decode($response->getBody(), true);
        $this->accessToken = $data['access_token'];
    }

    public function searchAirports($keyword)
    {
        $response = $this->client->get('/v1/reference-data/locations', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->accessToken,
            ],
            'query' => [
                'subType' => 'AIRPORT',
                'keyword' => $keyword,
            ],
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function searchFlights($data)
    {
        // Search flights
        $response = $this->client->get('/v2/shopping/flight-offers', [
            'headers' => [
                'Authorization' => "Bearer " . $this->accessToken,
            ],
            'query' => $data,
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }
}
