<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_gambar', function (Blueprint $table) {
            $table->id('id_gambar');
            $table->string('id_kategori');
            $table->string('id_user');
            $table->string('gambar');
            $table->string('nama_gambar');
            $table->string('deskripsi');
            $table->string('jumlah_like')->default(0);
            $table->string('jumlah_comment')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_gambar');
    }
};
