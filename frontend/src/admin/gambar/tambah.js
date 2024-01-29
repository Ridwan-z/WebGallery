import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './gambar.css';
import { useAuth } from '../../auth/AuthContext';

const GambarTambah = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const { authToken, Id } = useAuth();
    const [formData, setFormData] = useState({
        id_kategori: '',
        id_user: Id,
        nama_gambar: '',
        gambar: '',
        deskripsi: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'gambar') {
            const file = e.target.files[0];
            setSelectedImage(file);
            // Menyimpan URL gambar lokal untuk ditampilkan
            setPreviewImage(URL.createObjectURL(file));
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancelImage = () => {
        // Menghapus file gambar yang dipilih dan reset pratinjaunya
        if (selectedImage) {
            // Tambahkan logika penghapusan file yang sudah diunggah ke server
        }
        setSelectedImage(null);
        setPreviewImage(null);
        // Membersihkan input file
        document.querySelector('input[name="gambar"]').value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Sedang menyimpan data...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        // Set loading menjadi true sebelum pengiriman request
        setLoading(true);

        try {
            
            const formDataObj = new FormData();
            formDataObj.append('id_kategori', formData.id_kategori);
            formDataObj.append('id_user', formData.id_user);
            formDataObj.append('nama_gambar', formData.nama_gambar);
            formDataObj.append('gambar', selectedImage);
            formDataObj.append('deskripsi', formData.deskripsi);

            const response = await axios.post('http://127.0.0.1:8000/api/gambar', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            console.log(response.data);

            // Optionally, you can show a success message to the user using a library like SweetAlert2.
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Berhasil menambahkan data.',
                showConfirmButton: false,
            });

            setTimeout(() => {
                navigate('/admin/gambar');
            }, 1000);
        } catch (error) {
            console.error('Error creating gambar:', error.response.data);

            // Optionally, you can show an error message to the user using a library like SweetAlert2.
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Terjadi kesalahan dalam menambahkan data!',
            });
        } finally {
            // Set loading menjadi false setelah selesai, baik berhasil maupun gagal
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kategori');
                setKategoriOptions(response.data); // Sesuaikan dengan struktur respons yang sesuai
            } catch (error) {
                console.error('Error fetching kategori:', error.message);
            }
        };

        fetchKategori();
    }, []); // Pastikan array dependencies kosong agar useEffect hanya dijalankan sekali saat komponen dimuat

    return (
        <div className="container-fluid">
            <div>
                <h1 className="h3 mb-3 text-gray-800">Tambah Gambar</h1>

                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex justify-content-end align-items-center">
                        <Link to="/admin/gambar" className="btn btn-danger">
                            <i className="bi bi-arrow-bar-left"></i>
                            <span> Kembali</span>
                        </Link>
                        <button
                            type="button"
                            className="btn btn-success ml-2"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            <i className="bi bi-file-earmark-check"></i>
                            <span> Simpan</span>
                        </button>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="row">
                                <div className="col-6">
                                    <p className="fw-bold">Kategori Gambar</p>
                                    <select
                                        name="id_kategori"
                                        onChange={handleChange}
                                        value={formData.id_kategori}
                                        className="form-control" required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {kategoriOptions.map((kategori) => (
                                            <option key={kategori.id_kategori} value={kategori.id_kategori}>
                                                {kategori.nama_kategori}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <p className="fw-bold">Nama/Judul Gambar</p>
                                    <input
                                        type="text"
                                        name="nama_gambar"
                                        onChange={handleChange}
                                        value={formData.nama_gambar}
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>
                            <p className="fw-bold mt-3">Gambar</p>
                            <input
                                type="file"
                                name="gambar"
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                            <div className="image-preview-container">
                                {previewImage && (
                                    <div className="mt-2">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            style={{ maxWidth: '50%', height: '50%', borderRadius: '5%' }}
                                        />
                                        <a
                                            role="button"
                                            onClick={handleCancelImage}
                                            className="cancel-button"
                                        >
                                            <i className="fas fa-times text-danger"></i>
                                        </a>
                                    </div>
                                )}
                            </div>
                            <p className="fw-bold mt-3">Deskripsi Gambar</p>
                            <textarea
                                name="deskripsi"
                                onChange={handleChange}
                                value={formData.deskripsi}
                                className="form-control"
                                required
                            ></textarea>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GambarTambah;
