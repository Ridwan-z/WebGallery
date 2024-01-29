// Search.js

import React, { useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      // Assuming onSearch returns a Promise, otherwise handle accordingly
      await onSearch(searchTerm);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error("Error during search:", error);
    }
  };
  
  return (
    <div>
      <Container>
        <Row className='p-4 border-bottom'>
          <Col md={10}>
            <input
              className='form-control'
              type="text"
              placeholder="Cari berdasarkan judul gambar..."
              value={searchTerm}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <button className='btn btn-dark' onClick={handleSearch}>
              {loading ? (
                <>
                  <span>Loading...</span>
                  <Spinner animation="border" variant="light" size="sm" className="ml-2" />
                </>
              ) : (
                <span>Search</span>
              )}
            </button>
          </Col>
        </Row>

        {error && (
          <Row className='p-4'>
            <Col>
              <p className="text-danger">Error during search: {error.message}</p>
            </Col>
          </Row>
        )}

      </Container>
    </div>
  );
};

export default Search;