<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\Gambar;
use App\Models\Like;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class GambarController extends Controller
{
    public function index(Request $request)
    {
        $id_user = $request->query('id_user');
        $nama_gambar = $request->query('nama_gambar');
        $kategori_gambar = $request->query('kategori_gambar');

        $query = Gambar::leftJoin('tbl_kategori', 'tbl_gambar.id_kategori', '=', 'tbl_kategori.id_kategori')
            ->leftJoin('users', 'tbl_gambar.id_user', '=', 'users.id');

        if ($id_user) {
            $query->where('tbl_gambar.id_user', $id_user);
        }

        if ($nama_gambar) {
            $query->where('tbl_gambar.nama_gambar', $nama_gambar);
        }

        if ($kategori_gambar){
            $query->where('tbl_gambar.id_kategori', $kategori_gambar);
        }

        $gambar = $query->latest()
            ->select('tbl_gambar.*', 'tbl_kategori.nama_kategori', 'users.name', 'users.foto_user')
            ->get();

        return response()->json($gambar, 200);
    }

    public function store(Request $request)
    {
        $rules = [
            'id_kategori' => 'required|string|max:255',
            'id_user' => 'required|string|max:255',
            'gambar' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'nama_gambar' => 'required|string|max:255',
            'deskripsi' => 'required|string',
        ];

        $messages = [
            'id_kategori.required' => 'kategori is required',
            'id_user.required' => 'user is required',
            'gambar.required' => 'gambar is required',
            'nama_gambar.required' => 'nama gambar is required',
            'deskripsi.required' => 'Deskripsi is required',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json( $validator->errors(), 400);
        }

        try {
            $file = $request->file('gambar');
            $fileName = time() . '.' . $file->extension();
            $file->move(public_path('files'), $fileName);

            $gambar = new Gambar();
            $gambar->id_kategori = $request->input('id_kategori');
            $gambar->id_user = $request->input('id_user');
            $gambar->nama_gambar = $request->input('nama_gambar');
            $gambar->deskripsi = $request->input('deskripsi');
            $gambar->gambar = $fileName;
            $gambar->save();

            return response()->json([
                'message' => "gambar successfully created."
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Something went wrong!",
                'details' => $e->getMessage()
            ], 500);
        }
    }


    public function show(string $id)
    {
        $gambar = Gambar::where('id_gambar',$id)->first();

        if (!$gambar) {
            return response()->json([
                'message' => "Gambar Not Found"
            ], 404);
        }

        return response()->json($gambar ,200);
    }


    public function update(Request $request, string $id)
    {
        $rules = [
            'id_kategori' => 'required|string|max:255',
            'id_user' => 'required|string|max:255',
            'gambar' => 'image|mimes:jpeg,png,jpg|max:5120',
            'nama_gambar' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
        ];

        $messages = [
            'id_kategori.required' => 'kategori is required',
            'id_user.required' => 'user is required',
            'nama_gambar.required' => 'nama gambar is required',
            'deskripsi.required' => 'Deskripsi is required',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            $gambar = Gambar::where('id_gambar', $id)->first();

            if (!$gambar) {
                return response()->json([
                    'message' => "gambar Not Found"
                ], 404);
            }

            $updatedData = [
                'id_kategori' => $request->input('id_kategori'),
                'id_user' => $request->input('id_user'),
                'nama_gambar' => $request->input('nama_gambar'),
                'deskripsi' => $request->input('deskripsi'),
            ];

            if ($request->hasFile('gambar')) {
                $file = $request->file('gambar');
                $imageName = Str::random(32) . "." . $file->getClientOriginalExtension();
                $file->move(public_path('files'), $imageName);
                $updatedData['gambar'] = $imageName;
            }

            Gambar::where('id_gambar', $id)->update($updatedData);

            return response()->json([
                'message' => "Gambar successfully updated."
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Something went really wrong"
            ], 500);
        }
    }


    public function destroy(string $id)
    {
        $gambar = Gambar::where('id_gambar', $id)->first();

        if (!$gambar) {
            return response()->json([
                'message' => "gambar Not Found"
            ], 404);
        }

        $gambar = $gambar->gambar;

        $filePath = public_path('files/' . $gambar);

        if (file_exists($filePath)) {
            unlink($filePath);
        }

        Gambar::where('id_gambar', $id)->delete();
        Comment::where('id_gambar', $id)->delete();
        Like::where('id_gambar', $id)->delete();

        return response()->json([
            'message' => "Gambar successfully deleted."
        ], 200);
    }
}
