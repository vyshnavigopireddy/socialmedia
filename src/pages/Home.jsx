// src/pages/Home.jsx
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home({ setAuth }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/login');
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Home Page
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}

export default Home;
