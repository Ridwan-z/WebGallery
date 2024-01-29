<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GambarController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\CommentController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum'])->group(function () {
    //kategori
    Route::post('kategori',[KategoriController::class,'store']);
    Route::get('kategori/{id}',[KategoriController::class,'show']);
    Route::match(['put', 'post'], 'kategori-update/{id}', [KategoriController::class, 'update']);
    Route::delete('kategori-delete/{id}', [KategoriController::class,'destroy']);        
    
    //gambar
    Route::post('gambar',[GambarController::class,'store']);
    Route::match(['put', 'post'], 'gambar-update/{id}', [GambarController::class, 'update']);
    Route::delete('gambar-delete/{id}', [GambarController::class,'destroy']);    
    
    //like
    Route::post('like',[LikeController::class,'store']);
    Route::delete('like-delete/{id}', [LikeController::class,'destroy']);

    //comment
    Route::post('comment',[CommentController::class,'store']);
});

Route::get('user/{id}',[AuthController::class,'show']);

Route::get('kategori',[KategoriController::class,'index']);

Route::get('gambar',[GambarController::class,'index']);
Route::get('gambar/{id}',[GambarController::class,'show']);

Route::get('like/{id}',[LikeController::class,'show']);
Route::get('jumlah-like/{id}',[LikeController::class,'byGambar']);

Route::get('comment/{id}',[CommentController::class,'show']);

