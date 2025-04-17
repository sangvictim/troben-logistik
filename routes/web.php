<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/logistik', function () {
    return Inertia::render('logistik');
})->name('logistik');
