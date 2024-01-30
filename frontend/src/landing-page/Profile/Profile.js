import { Card, Col, Row, Spinner, Container } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config/configs';

const Profile = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [likedImageIds, setLikedImageIds] = useState([])
  const { Id, authToken } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch images
      const responseImages = await fetch(API_URL + '/gambar?id_user=' + id);
      const dataImages = await responseImages.json();

      const responseUsers = await axios.get(`${API_URL}/user/${id}`);
      const dataUsers = responseUsers.data;

      // Fetch likes for the user
      const responseLikes = await fetch(`${API_URL}/like/${Id}`); // Assuming user ID is 1
      const dataLikes = await responseLikes.json();
      // Create a map of liked image IDs
      setUsers(dataUsers);
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
  // Function to check if the user has liked a specific image

  const displayedImages = showMore ? images : images.slice(0, 8);

  return (
    <Container className='mt-4'>
      <Link to="/home" className='mb-3'>
        <i className="bi bi-arrow-left text-dark fs-3"></i>
      </Link>
      <Row className='mt-3 mb-3'>
      {loading ? (
          <div className="text-center">
            <Col xs={2} md={1} className='ms-4'>
            <div style={{ backgroundColor: '#E0E0E0', height: '85px', width: '85px', borderRadius: '50%' }}></div>
           </Col>
       
          </div>
        ) : (
            <>
        <Col xs={2} md={1} className='ms-5'>
            <img src={`http://localhost:8000/files/` + users.foto_user} alt='foto_profil' className='img-profile rounded-circle' width={80} height={80}></img>
        </Col>
        <Col xs={8} className='d-flex flex-column justify-content-center text-dark ps-3'>
            <div className='fw-bold'>{users.name}</div>
            <small>{users.username}</small>
        </Col>
        </>
        )}
        </Row>
      <Card.Body className='border-top'>
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
        ) : (
          <Row>
            {displayedImages.map((image) => (
              <Col key={image.id_gambar} xs={12} md={4} lg={3}>
                <Card className='mb-3'>
                  <Card.Body>
                    
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
                        <Link to={`/home/comment-gambar/${image.id_gambar}`} disabled={!authToken} className='text-dark'>          
                          <i className="bi bi-chat-dots bi-2x"></i>
                        </Link>
                      </span>
                      </div>
                      {/* Tambahan lainnya sesuai kebutuhan */}
                    </div>
                    <div className='d-block mt-2'>
                      <h6 className='fw-bold'>{image.jumlah_like} Suka</h6>
                      <Link to={`/home/comment-gambar/${image.id_gambar}`} className='text-secondary'>          
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
    </Container>
  );
}

export default Profile;
