import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';

const Gambar = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authToken, Id } = useAuth();

    useEffect(() => {
        fetchImages();
      }, []);

      const fetchImages = async () => {
        setLoading(true);
        try {
          Swal.fire({
              title: 'Sabarr...',
              showConfirmButton: false,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });

          const response = await fetch('http://127.0.0.1:8000/api/gambar?id_user=' + Id);
          const data = await response.json();
          Swal.close();

          setImages(data);
          setLoading(false); // Setelah data diambil, set loading ke false
        } catch (error) {
          console.error('Error fetching images:', error);
          Swal.close();
          setLoading(false); // Jika terjadi kesalahan, set loading ke false
        }
      };

      const handleDelete = async (imageId) => {
        const result = await Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: 'Data ini akan dihapus!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
        });

        if (result.isConfirmed) {
            try {
                const deleteUrl = `http://127.0.0.1:8000/api/gambar-delete/${imageId}`;
    
                await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                // Optionally, you can update the state to remove the deleted category
                setImages((prevImages) =>
                    prevImages.filter((image) => image.id !== imageId)
                );

                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Berhasil memperbarui data.',
                  showConfirmButton: false,
              });

                fetchImages();
            } catch (error) {
                console.error('Error deleting image:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Respon tidak sesuai format yang diharapkan.',
              });
            }
        }
    };
    
    return (
        <div className="container-fluid">
        <div>
  <h1 className="h3 mb-3 text-gray-800">Data Gambar</h1>
  {/* DataTales Example */}
  
  <div className="card shadow mb-4">
    <div className="card-header py-3">
        <Link to="tambah" className="btn btn-dark">
        <i className="fas fa-fw fa-plus"></i>
            <span> Tambah Data</span>
        </Link>    
    </div>
    <div className="card-body">
      <div className="table-responsive">
      {!loading ? (
        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
          <thead>
            <tr>
              <th className='text-center'>No</th>
              <th>Nama/Judul Gambar</th>
              <th>Kategori Gambar</th>
              <th>Gambar</th>
              <th>Deskripsi Gambar</th>              
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
          {images.map((image, index) => (
            <tr key={`image-${index}`}>
              <td className='text-center'>{index + 1}</td>
              <td>{image.nama_gambar}</td>
              <td>{image.nama_kategori}</td>
              <td className='text-center'><img src={`http://localhost:8000/files/` + image.gambar} alt='gambar' style={{ width: '100px', height: '100px', borderRadius: '3%' }}></img></td>
              <td>{image.deskripsi}</td>              
              <td className='text-center'>
                <NavLink to={`edit/${image.id_gambar}`} className='mr-3'>
                    <i className="bi bi-pen-fill text-warning"></i>
                </NavLink>
                |
                <a role='button' className='ml-3' onClick={() => handleDelete(image.id_gambar)}>
                    <i className="bi bi-trash3-fill text-danger"></i>
                </a>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
         ) : null}
      </div>
    </div>
  </div>
</div>
 
        </div>
    );
};

export default Gambar;

