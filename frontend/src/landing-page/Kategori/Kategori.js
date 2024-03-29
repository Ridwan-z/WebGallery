import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import './Kategori.css';
import Gallery from '../Gallery/Gallery';
import Search from '../Search/Search';
import { API_URL } from '../../config/configs';

const Kategori = () => {
  const [categories, setCategories] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL + '/kategori');
        const data = await response.json();
        setCategories(data);
        setLoading(false); // Setelah data diambil, set loading ke false
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false); // Jika terjadi kesalahan, set loading ke false
      }
    };

    fetchCategories();
  }, []);

  const handleClick = () => {
    setShowMore(!showMore);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const displayedCategories = showMore ? categories : categories.slice(0, 8);
  return (
    <div>
    <div> 
        <Search onSearch={handleSearch}/>
      </div>
    <div className='mt-4'>
      <Container>
        <h1 className='fw-bold fs-4'>Kategori</h1>
        <Card className="category-container mt-3">
          <Card.Body>
            {loading ? (
              <div className="text-center">
              <Row>
               {[1, 2, 3, 4, 5, 6, 7, 8].map((placeholderId) => (
                 <Col key={placeholderId} xs={12} md={4} lg={3}>
                    <div className="category-circle mb-3" style={{ backgroundColor: '#E0E0E0' }}>
                    <div className="category-lines-container">
                        <div className="category-lines"></div>
                        <div className="category-lines"></div>
                        <div className="category-lines"></div>
                    </div>
                    </div>
                    <div className='name-container'>
                    <div className='name-loading'></div>
                    </div>
                   </Col>
               ))}
             </Row>
           </div>
            ) : displayedCategories.length === 0 ? (
              <div className="text-center">
                <p>Tidak ada data.</p>
              </div>
            ) : (
              <Row>
                {displayedCategories.map((category) => (
                  <Col key={category.id} xs={12} md={4} lg={3}>
                    <div className="category-circle bg-dark mb-3" onClick={() => handleCategoryClick(category.id_kategori)} style={{ cursor: 'pointer' }}>
                      <div className="category-lines-container">
                        <div className="category-lines"></div>
                        <div className="category-lines"></div>
                        <div className="category-lines"></div>
                      </div>
                    </div>
                    <p className='fw-bold text-center'>{category.nama_kategori}</p>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>

        {categories.length > 8 && (
        
          <Row className="mt-3">
            <Col xs={12} className="text-end">
              <p className="show-more" onClick={handleClick}>
                {showMore ? 'Tutup' : 'Lainnya'}
              </p>
            </Col>
          </Row>
          )} 

        <div className="my-4">
          <Gallery searchTerm={searchTerm} kategoriId={selectedCategoryId} />
        </div>
      </Container>
    </div>
    </div>
  );
}

export default Kategori;
