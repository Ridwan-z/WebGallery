<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'username' => 'required',
            'no_telpon' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
            'foto_user' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'alamat' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Ada kesalahan',
                'data' => $validator->errors()
            ]);
        }

        $file = $request->file('foto_user');
        $fileName = time() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('files'), $fileName);

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $input['foto_user'] = $fileName;
        $user = User::create($input);

        $success['token'] = $user->createToken('auth_token')->plainTextToken;
        $success['name'] = $user->name;

        return response()->json([
            'success' => true,
            'message' => 'Sukses register',
            'data' => $success
        ]);

    }  

    public function show(string $id)
    {
        $user = User::where('id',$id)->first();

        if (!$user) {
            return response()->json([
                'message' => "user Not Found"
            ], 404);
        }

        return response()->json($user, 200);
    }

    public function login(Request $request)
    {
        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
            $auth = Auth::user();
            $success['token'] = $auth->createToken('auth_token')->plainTextToken;
            $success['name'] = $auth->name;
            $success['email'] = $auth->email;
            $success['id'] = $auth->id;
            $success['foto_user'] = $auth->foto_user;

            return response()->json([
                'success' => true,
                'message' => 'Login sukses',
                'data' => $success
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Cek Username dan password lagi',
                'data' => null
            ]);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete(); // Revoke all tokens for the user

        return response()->json(['message' => 'Berhasil Logout']);
    }
}
