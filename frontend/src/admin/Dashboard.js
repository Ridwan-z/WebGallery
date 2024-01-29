import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

const Dashboard = () => {
    const [kategori, setKategori] = useState([]);
    const [gambar, setGambar] = useState([]);
    const { Id } = useAuth();

    useEffect(() => {
        fetchKategori();
        fetchGambar();
    }, []);

    const fetchKategori = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/kategori');
            setKategori(response.data.length); // Sesuaikan dengan struktur respons yang sesuai
        } catch (error) {
            console.error('Error fetching kategori:', error.message);
        }
    };

    const fetchGambar = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/gambar?id_user=' + Id);
            setGambar(response.data.length); // Sesuaikan dengan struktur respons yang sesuai
        } catch (error) {
            console.error('Error fetching gambar:', error.message);
        }
    };
    return (
        <div className="container-fluid">

            {/*  <!-- Content Row --> */}
            <div className="row">

                {/*  <!-- Earnings (Monthly) Card Example --> */}
                <div className="col-xl-6 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Jumlah Kategori</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{kategori}</div>
                                </div>
                                <div className="col-auto">
                                    <i className="bi bi-clipboard fs-3 text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  <!-- Earnings (Monthly) Card Example --> */}
                <div className="col-xl-6 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Jumlah Gambar</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{gambar}</div>
                                </div>
                                <div className="col-auto">
                                    <i className="bi bi-image fs-3 text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  <!-- Earnings (Monthly) Card Example --> */}
                
            </div>

            {/*  <!-- Content Row --> */}

            

        </div>
    );
};

export default Dashboard;
