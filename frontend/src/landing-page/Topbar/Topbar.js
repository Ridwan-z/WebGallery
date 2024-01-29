import './Topbar.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();
  const { logout, authToken, userName, fotoUser } = useAuth();

  const handleLogout = async () => {
      try {
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: {
          Authorization: `Bearer ${authToken}`,
          },
      });

      logout(); // Call the logout function from AuthContext
      navigate('/login'); // Redirect to /login on successful logout
      } catch (error) {
      console.error('Error during logout:', error);
      }
  };

  return (
    <div>
      <Navbar expand="lg" className="bg-dark shadow-sm">
        <Container>
          <Nav.Link href="javascript:0;" className='text-white fw-bold fs-4'>Web Gallery</Nav.Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-center d-flex justify-content-center align-items-center">
            {authToken ? (
                <>
                  <span className='text-white mr-2'>{userName}</span>
                  <img className="img-profile rounded-circle mr-5" width={32} height={32}
                                    src={`http://localhost:8000/files/` + fotoUser}></img>
                  <Link to="/admin" className='text-white mr-3 text-decoration-none border-0'>
                  <Button size="sm" className="bg-white text-dark fw-bold text-decoration-none border-0">Admin</Button>
                  </Link>
                  <Button size="sm" onClick={handleLogout} className="bg-white text-dark fw-bold text-decoration-none border-0">Logout</Button>
                </>
              ) : (
                <>                 
                  <Link to="/login" className='text-white text-decoration-none border-0'>
                    <Button size="sm" className="bg-white text-dark fw-bold text-decoration-none border-0">Login</Button>
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
    </div>
  )
}

export default Topbar