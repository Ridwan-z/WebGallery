<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Support\Facades\Validator;
use App\Models\Gambar;

class CommentController extends Controller
{

    public function store(Request $request)
    {
        $rules = [
            'id_gambar' => 'required|string|max:258',
            'id_user' => 'required|string|max:258',
            'isi_comment' => 'required|string|max:258',
        ];

        $messages = [
            'id_gambar.required' => 'Gambar is required',
            'id_user.required' => 'User is required',
            'isi_comment.required' => 'Comment is required',

        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json( $validator->errors(), 400);
        }

        try {

            Comment::create([
                'id_gambar' => $request->input('id_gambar'),
                'id_user' => $request->input('id_user'),
                'isi_comment' => $request->input('isi_comment'),
            ]);

            Gambar::where('id_gambar', $request->input('id_gambar'))->increment('jumlah_comment');

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
        $comment = Comment::where('id_gambar',$id)
            ->leftJoin('users', 'tbl_comment.id_user', '=', 'users.id')
            ->select('tbl_comment.*', 'users.name')
            ->get();

        if (!$comment) {
            return response()->json([
                'message' => "comment Not Found"
            ], 404);
        }

        return response()->json($comment, 200);
    }

    public function destroy(string $id)
    {
        $comment = Comment::where('id_comment', $id)->first();

        if (!$comment) {
            return response()->json([
                'message' => "comment Not Found"
            ], 404);
        }

        Comment::where('id_comment', $id)->delete();

        return response()->json([
            'message' => "comment successfully deleted."
        ], 200);
    }
}
