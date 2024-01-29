import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../admin/css/sb-admin-2.css';
import '../admin/css/sb-admin-2.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        no_telpon: '',
        password: '',
        confirm_password: '',
        alamat: '',
        foto_user: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'foto_user') {
            const file = e.target.files[0];
            setSelectedImage(file);
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        const { password, confirm_password } = formData;
        if (e.target.name === 'confirm_password' && password !== e.target.value) {
            setPasswordError('Password tidak cocok');
        } else {
            setPasswordError('');
        }

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

        setLoading(true);

        try {
            
            const formDataObj = new FormData();
            formDataObj.append('name', formData.name);
            formDataObj.append('username', formData.username);
            formDataObj.append('email', formData.email);
            formDataObj.append('no_telpon', formData.no_telpon);
            formDataObj.append('password', formData.password);
            formDataObj.append('confirm_password', formData.confirm_password);
            formDataObj.append('alamat', formData.alamat);
            formDataObj.append('foto_user', selectedImage);

            const response = await axios.post('http://127.0.0.1:8000/api/register', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Berhasil Register!',
                // showConfirmButton: false,
            });

            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Terjadi kesalahan dalam melakukan register!',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
  {/* Outer Row */}
  <div className="row justify-content-center">
    <div className="col-xl-8 col-lg-12 col-md-9">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body bg-secondary p-0">
          {/* Nested Row within Card Body */}
          <div className="row">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-white mb-4">Register!</h1>
                </div>
                <form className="user">
                    <div className="form-group row">
                     <div className="col-sm-6 mb-3 mb-sm-0">
                      <div className="form-group">
                      <label className='text-white'>Nama</label>
                        <input
                            type="text"
                            name='name'
                            onChange={handleChange}
                            value={formData.name}
                            className="form-control"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Masukkan Nama..."
                            required
                        />
                      </div>
                     </div>

                     <div className="col-sm-6 mb-3 mb-sm-0">
                      <div className="form-group">
                      <label className='text-white'>Username</label>
                        <input
                            type="text"
                            name='username'
                            onChange={handleChange}
                            value={formData.username}
                            className="form-control"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Masukkan Username..."
                            required
                        />
                      </div>
                     </div>
                    </div>
                    
                    <div className="form-group row">
                     <div className="col-sm-6 mb-3 mb-sm-0">
                      <div className="form-group">
                      <label className='text-white'>Email</label>
                        <input
                            type="email"
                            name='email'
                            onChange={handleChange}
                            value={formData.email}
                            className="form-control"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Masukkan Email..."
                            required
                        />
                      </div>
                     </div>

                     <div className="col-sm-6 mb-3 mb-sm-0">
                      <div className="form-group">
                      <label className='text-white'>No Telpon</label>
                        <input
                            type="number"
                            name='no_telpon'
                            onChange={handleChange}
                            value={formData.no_telpon}
                            className="form-control"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Masukkan No Telpon..."
                            required
                        />
                      </div>
                     </div>
                    </div>

                    <div className="form-group row">
                     <div className="col-sm-6 mb-3 mb-sm-0">
                      <div className="form-group">
                      <label className='text-white'>Password</label>
                        <input
                            type="password"
                            name='password'
                            onChange={handleChange}
                            onBlur={handlePasswordChange}
                            value={formData.password}
                            className="form-control"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Masukkan Password..."
                            required
                        />
                      </div>
                     </div>

                     <div className="col-sm-6 mb-3 mb-sm-0">
                      <div className="form-group">
                      <label className='text-white'>Ulangi Password</label>
                        <input
                            type="password"
                            name='confirm_password'
                            onChange={handlePasswordChange}
                            value={formData.confirm_password}
                            className="form-control"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Ulangi Password..."
                            required
                        />
                         {passwordError && <span className="text-danger">{passwordError}</span>}
                      </div>
                     </div>
                    </div>
                    
                    <div className="form-group row">
                     <div className="col-sm-6 mb-3 mb-sm-0">
                      <div className="form-group">
                      <label className='text-white'>Alamat</label>
                        <input
                            type="text"
                            name='alamat'
                            onChange={handleChange}
                            value={formData.alamat}
                            className="form-control"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Masukkan Alamat..."
                            required
                        />
                      </div>
                     </div>

                     <div className="col-sm-6 mb-3 mb-sm-0">
                        <label className='text-white'>Foto User</label>
                      <div className="form-group">
                        <input
                            type="file"
                            name='foto_user'
                            onChange={handleChange}
                            className="form-control"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            required
                        />
                      </div>
                     </div>
                    </div>

                    <button type="button" onClick={handleSubmit} disabled={loading} className="btn btn-dark btn-user btn-block">
                        Register
                    </button>             
                </form>
                <hr />
                <div className="text-end">
                  <Link to="/login" className="small text-white">Login!</Link>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    );
};

export default Register;