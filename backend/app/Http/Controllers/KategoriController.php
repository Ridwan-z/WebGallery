<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kategori;
use Illuminate\Support\Facades\Validator;

class KategoriController extends Controller
{
    public function index()
    {
        $query = Kategori::latest();
        $kategori = $query->get();

        return response()->json($kategori, 200);
    }

    public function store(Request $request)
    {
        $rules = [
            'nama_kategori' => 'required|string|max:258',
        ];

        $messages = [
            'nama_kategori.required' => 'Nama kategori is required',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json( $validator->errors(), 400);
        }

        try {

            Kategori::create([
                'nama_kategori' => $request->input('nama_kategori'),
            ]);

            return response()->json([
                'message' => "Kategori successfully created."
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Something went really wrong!",
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        $kategori = Kategori::where('id_kategori',$id)->first();

        if (!$kategori) {
            return response()->json([
                'message' => "kategori Not Found"
            ], 404);
        }

        return response()->json($kategori, 200);
    }


    public function update(Request $request, string $id)
    {
        $rules = [
            'nama_kategori' => 'required|string|max:258',
        ];

        $messages = [
            'nama_kategori.required' => 'Nama Kategori is required',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json( $validator->errors(), 400);
        }

        try {
            $kategori = Kategori::where('id_kategori', $id)->first();

            if (!$kategori) {
                return response()->json([
                    'message' => "kategori Not Found"
                ], 404);
            }

            $updatedData = [
                'nama_kategori' => $request->input('nama_kategori'),
            ];


            Kategori::where('id_kategori', $id)->update($updatedData);

            return response()->json([
                'message' => "kategori successfully updated."
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Something went really wrong"
            ], 500);
        }
    }


    public function destroy(string $id)
    {
        $kategori = kategori::where('id_kategori', $id)->first();

        if (!$kategori) {
            return response()->json([
                'message' => "kategori Not Found"
            ], 404);
        }

        kategori::where('id_kategori', $id)->delete();

        return response()->json([
            'message' => "kategori successfully deleted."
        ], 200);
    }
}
