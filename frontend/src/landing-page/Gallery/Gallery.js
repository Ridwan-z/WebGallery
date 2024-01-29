import { Card, Col, Row, Spinner } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import './Gallery.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const Gallery = ({ searchTerm }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [likedImageIds, setLikedImageIds] = useState([])
  const { Id, authToken } = useAuth();

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      const responseImages = await fetch(`http://127.0.0.1:8000/api/gambar?nama_gambar=${searchTerm}`);
      const dataImages = await responseImages.json();

      // Fetch likes for the user
      const responseLikes = await fetch(`http://127.0.0.1:8000/api/like/${Id}`); // Assuming user ID is 1
      const dataLikes = await responseLikes.json();
      // Create a map of liked image IDs

      setImages(dataImages);
      setLikedImageIds(dataLikes.map((like) => Number(like.id_gambar)));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
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

      const response = await fetch(`http://127.0.0.1:8000/api/like`, {
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

      const response = await fetch(`http://127.0.0.1:8000/api/like-delete/${id_like}`, {
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
  // Function to check if the user has liked a specific image

  const displayedImages = showMore ? images : images.slice(0, 8);
  return (
    <div className='mt-4'>
      <h1 className='fw-bold fs-4'>Gallery</h1>
      <Card.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
            </Spinner>
          </div>
        ): displayedImages.length === 0 ? (
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
                    <p className='fw-bold fs-5'>{image.nama_gambar}</p>
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
                      <Link to={`comment-gambar/${image.id_gambar}`} className='text-secondary'>          
                        Lihat {image.jumlah_comment} Komentar
                        </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
      
      {displayedImages.length > 8 && (
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
