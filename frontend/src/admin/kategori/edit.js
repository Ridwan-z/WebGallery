// KategoriEdit.j
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';

const KategoriEdit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();
  const [formData, setFormData] = useState({
    nama_kategori: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/kategori/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setFormData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching kategori:', error.response.data);
      }
    };

    fetchKategori();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/kategori-update/${id}`, formData,
        {   
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Berhasil memperbarui data.',
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate('/admin/kategori');
      }, 1000);
    } catch (error) {
      console.error('Error updating kategori:', error.response.data);
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
        <h1 className="h3 mb-3 text-gray-800">Edit Kategori</h1>
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex justify-content-end align-items-center">
            <Link to="/admin/kategori" className="btn btn-danger">
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
              <p className='fw-bold'>Nama Kategori</p>
              <input type='text' name='nama_kategori' onChange={handleChange} value={formData.nama_kategori} className='form-control'></input>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KategoriEdit;
