<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Province;

class LocationController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = $request->search;

        // Cari berdasarkan provinsi
        $provinsi = Province::where('name', 'like', "%$query%")->first();
        if ($provinsi) {
            $kecamatans = District::whereHas('city', function ($q) use ($provinsi) {
                $q->where('province_code', $provinsi->code);
            })->get();
            $mapped = $this->dataMaping($kecamatans);
            return $this->response($mapped);
        }

        // Cari berdasarkan kota
        $kota = City::where('name', 'like', "%$query%")->first();
        if ($kota) {
            $kecamatans = District::where('city_code', $kota->code)->get();
            $mapped = $this->dataMaping($kecamatans);
            return $this->response($mapped);
        }

        // Cari berdasarkan kecamatan
        $kecamatans = District::where('name', 'like', "%$query%")->get();
        $mapped = $this->dataMaping($kecamatans);
        return $this->response($mapped);
    }


    protected function dataMaping($data)
    {
        return $data->map(function ($item) {
            return [
                "id" => $item->code,
                "kecamatan" => $item->name,
                "kota" => $item->city_name,
                "provinsi" => $item->province_name,
            ];
        });
    }

    protected function response($data): JsonResponse
    {
        $result = new ResponseApi;
        $result->setStatusCode(Response::HTTP_OK);
        $result->title('Locations');
        $result->data($data);
        return $result;
    }
}
