import { Card, Col, Row, Spinner, Container } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Comment.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../../auth/AuthContext';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/configs';

const Comment = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [comment, setComment] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const { authToken, Id } = useAuth();
  const [expandedText, setExpandedText] = useState({});
  const [commentExpandedText, setCommentExpandedText] = useState({});

  const [formData, setFormData] = useState({
    isi_comment: '',
    id_gambar: id,
    id_user: Id
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentLoading(true);

    try {
      if (!authToken) {
        // If not authenticated, show SweetAlert
        Swal.fire({
          icon: 'warning',
          text: 'Harap Login terlebih dahulu!',
        });
        setCommentLoading(false);  // Set loading to false
        return;  // Exit the function
      }

        const response = await axios.post(API_URL + '/comment', formData,
        {   
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authToken}`,
              },
            }
        );
        console.log('berhasil');
        fetchData();
        setFormData({
          isi_comment: '',
        });
    } catch (error) {
        console.error('Error:', error.response.data);        
    } finally {
        setLoading(false);
        setCommentLoading(false);
    }
};

  const fetchData = async () => {
    try {
      const responseImages = await axios.get(`${API_URL}/gambar/${id}`);
      const dataImages = responseImages.data;

      const responseComments = await axios.get(`${API_URL}/comment/${id}`);
      const dataComments = responseComments.data;
      
      setComment(dataComments);
      setImages(dataImages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const toggleText = (imageId) => {
    setExpandedText((prevExpandedText) => ({
      ...prevExpandedText,
      [imageId]: !prevExpandedText[imageId],
    }));
  };

  const toggleCommentText = (imageId) => {
    setCommentExpandedText((prevExpandedText) => ({
      ...prevExpandedText,
      [imageId]: !prevExpandedText[imageId],
    }));
  };

  return (
    <Container className='mt-4'>
      <Link to="/home" className='mb-3'>
        <i className="bi bi-arrow-left text-dark fs-3"></i>
      </Link>
      <Card.Body className='mb-5'>
        {loading ? (
          <div className="text-center">
            <Row className="d-flex">
            <Col xs={12} md={4} className="mb-3">
              {/* Left side (image and name) */}
              <Card>
                <Card.Body>
                <div className="loading-placeholder mb-3" style={{ backgroundColor: '#E0E0E0', height: '200px', borderRadius: '8px' }}>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={8}>
              <Card className='h-75 comment-card'>
                <Card.Body>
                  <div className="comment-container">
                  {[1, 2, 3, 4].map((placeholderId) => (
                  <div className="comment-box" style={{ backgroundColor: "#E0E0E0" }} key={placeholderId}>
                    <div className='comment-text'></div>
                    <div className='comment-username'></div>
                  </div>
                  ))}
                  </div>
                </Card.Body>
              </Card>
              <Row className='justify-content-center'>
                <Col xs={12} md={11}>
              <div className="mt-3">
                  <input
                    type="text"
                    name='isi_comment'
                    className='form-control'
                    placeholder="Tambahkan komentar..."
                    >
                  </input>
              </div>
              </Col>
              <Col xs={12} md={1}>
              <a role='button' className='btn btn-secondary mt-3' >
            <i className="bi bi-send"></i>
              </a>
              </Col>
              </Row>
            </Col>
          </Row>
          </div>
        ) : (
          <Row className="d-flex">
            <Col xs={12} md={4} className="mb-3">
              {/* Left side (image and name) */}
              <Card>
                <Card.Body>
                    <img
                      src={`http://localhost:8000/files/` + images.gambar}
                      alt="gambar"
                      style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '3%' }}
                    />
                  <p className='fw-bold mt-2'>
                  {images.nama_gambar.length > 20 ? (
                            <>
                              {expandedText[images.id_gambar]
                                ? images.nama_gambar
                                : images.nama_gambar.slice(0, 20) + '...'}
                              <span
                                className='text-secondary'
                                onClick={() => toggleText(images.id_gambar)}
                                style={{ cursor: 'pointer', fontSize: '15px' }}
                              >
                                {expandedText[images.id_gambar]
                                  ? ' Kurangi'
                                  : ' Selengkapnya'}
                              </span>
                            </>
                          ) : (
                            images.nama_gambar
                          )}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={8}>
              <Card className='h-75 comment-card'>
                <Card.Body>
                  <div className="comment-container">
                  {comment.map((comments) => (
                  <div className="comment-box">
                    <p className="comment-text">
                    {comments.isi_comment.length > 150 ? (
                            <>
                              {commentExpandedText[comments.id_gambar]
                                ? comments.isi_comment
                                : comments.isi_comment.slice(0, 150) + '...'}
                              <span
                                className='text-secondary'
                                onClick={() => toggleCommentText(comments.id_gambar)}
                                style={{ cursor: 'pointer', fontSize: '15px' }}
                              >
                                {commentExpandedText[comments.id_gambar]
                                  ? ' Kurangi'
                                  : ' Selengkapnya'}
                              </span>
                            </>
                          ) : (
                            comments.isi_comment
                          )}
                    </p>
                    <span className="comment-username">{comments.name}</span>
                  </div>
                  ))}
                  </div>
                </Card.Body>
              </Card>
              <Row className='justify-content-center'>
                <Col xs={12} md={11}>
              <div className="mt-3">
                  <input
                    type="text"
                    name='isi_comment'
                    className='form-control'
                    placeholder="Tambahkan komentar..."
                    onChange={handleChange}
                    value={formData.isi_comment}>
                  </input>
              </div>
              </Col>
              <Col xs={12} md={1}>
              <a role='button' className='btn btn-secondary mt-3' onClick={handleSubmit} disabled={commentLoading} >
              {commentLoading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-send"></i>}
              </a>
              </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Container>
  );
}

export default Comment;
