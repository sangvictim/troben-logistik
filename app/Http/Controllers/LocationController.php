<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Province;

class LocationController extends Controller
{
    public function search(Request $request): mixed
    {
        $query = $request->search;
        $result = new ResponseApi;

        // Cari berdasarkan provinsi
        $provinsi = Province::where('name', 'like', "%$query%")->first();
        if ($provinsi) {
            $kecamatans = District::whereHas('city', function ($q) use ($provinsi) {
                $q->where('province_code', $provinsi->code);
            })->get();
            $maping = $this->dataMaping($kecamatans);
            $result->setStatusCode(Response::HTTP_OK);
            $result->title('Locations');
            $result->data($maping);
            return $result;
        }

        // Cari berdasarkan kota
        $kota = City::where('name', 'like', "%$query%")->first();
        if ($kota) {
            $kecamatans = District::where('city_code', $kota->code)->get();
            $maping = $this->dataMaping($kecamatans);
            $result->setStatusCode(Response::HTTP_OK);
            $result->title('Locations');
            $result->data($maping);
            return $result;
        }

        // Cari berdasarkan kecamatan
        $kecamatans = District::where('name', 'like', "%$query%")->get();
        $maping = $this->dataMaping($kecamatans);
        $result->setStatusCode(Response::HTTP_OK);
        $result->title('Locations');
        $result->data($maping);
        return $result;
    }


    protected function dataMaping($data)
    {
        return $data->map(function ($item) {
            return [
                "id" => $item->code,
                "kecamatan" => $item->name,
                "kota" => $item->city->name,
                "provinsi" => $item->city->province->name,
            ];
        });
    }
}
