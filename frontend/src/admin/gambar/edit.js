import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';

const GambarEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authToken, Id } = useAuth();
    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [originalImage, setOriginalImage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        id_kategori: '',
        id_user: Id,
        nama_gambar: '',
        gambar: '',
        deskripsi: '',
    });

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/kategori`,{
                    headers:{
                        'Authorization' :`Bearer ${authToken}`
                    },
                });
                setKategoriOptions(response.data);
            } catch (error) {
                console.error('Error fetching kategori:', error.message);
            }
        };

        const fetchGambarDetail = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/gambar/${id}`,{
                    headers:{
                        'Authorization' :`Bearer ${authToken}`
                    },
                });
                const gambarDetail = response.data;

                setOriginalImage(gambarDetail.gambar);

                setFormData({
                    id_kategori: gambarDetail.id_kategori,
                    id_user: gambarDetail.id_user,
                    nama_gambar: gambarDetail.nama_gambar,
                    gambar: '',
                    deskripsi: gambarDetail.deskripsi,
                });
            } catch (error) {
                console.error('Error fetching gambar detail:', error.message);
            }
        };

        fetchKategori();
        fetchGambarDetail();
    }, [id]);

    const handleChange = (e) => {
        if (e.target.name === 'gambar') {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
            document.querySelector('input[name="gambar"]').value = '';
    
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const formDataObj = new FormData();
            formDataObj.append('id_kategori', formData.id_kategori);
            formDataObj.append('id_user', formData.id_user);
            formDataObj.append('nama_gambar', formData.nama_gambar);
    
            if (selectedFile) {
                // Jika user memilih gambar baru
                formDataObj.append('gambar', selectedFile);
            } else {
                FormData.gambar = originalImage;
            }
    
            formDataObj.append('deskripsi', formData.deskripsi);
    
            const response = await axios.post(`http://127.0.0.1:8000/api/gambar-update/${id}`, formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
    
            if (response && response.data) {
                console.log(response.data);
    
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Berhasil memperbarui data.',
                    showConfirmButton: false,
                });
    
                setTimeout(() => {
                    navigate('/admin/gambar');
                }, 1000);
            } else {
                // Handle the case where response or response.data is undefined
                console.error('Invalid response format:', response);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Respon tidak sesuai format yang diharapkan.',
                });
            }
        } catch (error) {
            console.error('Error updating gambar:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Terjadi kesalahan dalam memperbarui data!',
            });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="container-fluid">
            <div>
                <h1 className="h3 mb-3 text-gray-800">Edit Gambar</h1>

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
                                        className="form-control"
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
                                    />
                                </div>
                            </div>
                            <p className="fw-bold mt-3">Gambar</p>
                            <input
                                type="file"
                                name="gambar"
                                onChange={handleChange}
                                className="form-control"
                            />
                            <div className="image-preview-container">
    {previewImage ? (
        <div className="mt-2">
            <img
                src={previewImage}
                alt="Preview"
                style={{ maxWidth: '50%', height: '50%', borderRadius: '5%' }}
            />
            <a
                role="button"
                onClick={handleChange}
                className="cancel-button"
            >
                <i className="fas fa-times text-danger"></i>
            </a>
        </div>
    ) : originalImage && ( // Check if originalImage exists
        <div className="mt-2">
            <img
                src={`http://localhost:8000/files/` + originalImage}
                alt="Original Preview"
                style={{ maxWidth: '50%', height: '50%', borderRadius: '5%' }}
            />
        </div>
    )}
</div>

                            <p className="fw-bold mt-3">Deskripsi Gambar</p>
                            <textarea
                                name="deskripsi"
                                onChange={handleChange}
                                value={formData.deskripsi}
                                className="form-control"
                            ></textarea>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GambarEdit;
