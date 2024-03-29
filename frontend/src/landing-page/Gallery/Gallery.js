import { Card, Col, Row, Spinner } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import './Gallery.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { API_URL } from '../../config/configs';

const Gallery = ({ searchTerm, kategoriId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [likedImageIds, setLikedImageIds] = useState([])
  const { Id, authToken } = useAuth();
  const [expandedText, setExpandedText] = useState({});

  useEffect(() => {
    fetchData();
  }, [searchTerm, kategoriId]);

  const calculateTimeAgo = (dateString) => {
    const createdDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    if (daysDifference === 0) {
      const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
      if (hoursDifference === 0) {
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        return `${minutesDifference} menit yang lalu`;
      } else {
        return `${hoursDifference} jam yang lalu`;
      }
    } else {
      return `${daysDifference} hari yang lalu`;
    }
  };
  

  const fetchData = async () => {
    try {
      setLoading(true);

      let apiUrl = `${API_URL}/gambar?nama_gambar=${searchTerm}`;
      if (kategoriId) {
        apiUrl += `&&kategori_gambar=${kategoriId}`;
      }

      const responseImages = await fetch(apiUrl);
      const dataImages = await responseImages.json();

      // Fetch likes for the user
      const responseLikes = await fetch(`${API_URL}/like/${Id}`); // Assuming user ID is 1
      const dataLikes = await responseLikes.json();
      // Create a map of liked image IDs

      setImages(dataImages);
      setLikedImageIds(dataLikes.map((like) => Number(like.id_gambar)));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setShowMore(!showMore);
  };

  const handleLoveClick = async (imageId) => {
    try {
      const id_gambar = String(imageId);
      const id_user = String(Id);

      const response = await fetch(`${API_URL}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          id_gambar,
          id_user,
        }),
      });

      fetchData();
    } catch (error) {
      console.error('Error liking image:', error);
    }
  };

  const handleCancelLoveClick = async (imageId) => {
    try {
      
      const id_like = String(imageId);

      const response = await fetch(`${API_URL}/like-delete/${id_like}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      fetchData();
    } catch (error) {
      console.error('Error canceling like:', error);
    }
  };

  const toggleText = (imageId) => {
    setExpandedText((prevExpandedText) => ({
      ...prevExpandedText,
      [imageId]: !prevExpandedText[imageId],
    }));
  };

  const displayedImages = showMore ? images : images.slice(0, 8);
  return (
    <div className='mt-4'>
      <h1 className='fw-bold fs-4'>Gallery</h1>
      <Card.Body>
        {loading ? (
          <div className="text-center">
             <Row>
              {[1, 2, 3, 4].map((placeholderId) => (
                <Col key={placeholderId} xs={12} md={4} lg={3}>
                  <div className="loading-placeholder mb-3" style={{ backgroundColor: '#E0E0E0', height: '250px', borderRadius: '8px' }}>
                  </div>
                  </Col>
              ))}
            </Row>
          </div>
        ) : displayedImages.length === 0 ? (
          <div className="text-center">
            <p>Tidak ada data.</p>
          </div>
        ) : (
          <Row>
            {displayedImages.map((image) => (
              <Col key={image.id_gambar} xs={12} md={4} lg={3}>
                <Card className='mb-3' >
                  <Card.Body>
                    <Link to={`profile/${image.id_user}`} className="text-decoration-none border-0">
                    <div className='row mb-3'>
                      <div className='col-2'>
                        <img src={`http://localhost:8000/files/` + image.foto_user} alt='foto_profil' className='img-profile rounded-circle' width={30} height={30}></img>                        
                      </div>
                      <div className='col-6 d-flex align-items-center text-dark'>{image.name}</div>
                    </div>
                    </Link>
                      <img
                        src={`http://localhost:8000/files/` + image.gambar}
                        alt="gambar"
                        className='mb-1'
                        style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '3%' }}
                      />
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                      <i
                        className={`bi ${
                          likedImageIds.includes(image.id_gambar) ? 'bi-heart-fill text-danger' : 'bi-heart'
                        } bi-2x`}
                        style={{ cursor: authToken ? 'pointer' : 'default' }}
                          onClick={() => {
                            if (authToken) {
                              if (likedImageIds.includes(image.id_gambar)) {
                                handleCancelLoveClick(image.id_gambar);
                              } else {
                                handleLoveClick(image.id_gambar);
                              }
                            }
                          }}
                      ></i>
                      <span className="ms-3">
                        <Link to={`comment-gambar/${image.id_gambar}`} disabled={!authToken} className='text-dark'>          
                          <i className="bi bi-chat-dots bi-2x"></i>
                        </Link>
                      </span>
                      </div>
                      {/* Tambahan lainnya sesuai kebutuhan */}
                    </div>
                    <div className='d-block mt-2'>
                      <h6 className='fw-bold'>{image.jumlah_like} Suka</h6>
                        <div style={{ fontSize: '18px' }}>
                         {image.nama_gambar.length > 20 ? (
                            <>
                              {expandedText[image.id_gambar]
                                ? image.nama_gambar
                                : image.nama_gambar.slice(0, 20) + '...'}
                              <span
                                className='text-secondary'
                                onClick={() => toggleText(image.id_gambar)}
                                style={{ cursor: 'pointer', fontSize: '15px' }}
                              >
                                {expandedText[image.id_gambar]
                                  ? ' Kurangi'
                                  : ' Selengkapnya'}
                              </span>
                            </>
                          ) : (
                            image.nama_gambar
                          )}
                      </div>
                      
                      <Link to={`comment-gambar/${image.id_gambar}`} className='text-secondary'>          
                        Lihat semua {image.jumlah_comment} Komentar
                        </Link>
                        <p>{calculateTimeAgo(image.created_at)}</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
      
      {images.length > 8 && (
      <Row className="mt-3">
        <Col xs={12} className="text-end">
          <p className="show-more" onClick={handleClick}>
            {showMore ? 'Tutup' : 'Lainnya'}
          </p>
        </Col>
      </Row>
      )}
    </div>
  );
}

export default Gallery;
