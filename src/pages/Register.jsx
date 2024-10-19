import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Alert } from '@mui/material';
import API from '../api/axios'; // Ensure this is the correct path to your axios instance

function Register({ setAuth }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Send a POST request to your backend API to register the user
      const response = await API.post('/auth/register', formData);
      
      // Store the token in local storage upon successful registration
      localStorage.setItem('token', response.data.token); // Ensure your backend sends a token back
      setAuth(true); // Update the authentication state
      navigate('/'); // Redirect to the home page after successful registration
    } catch (err) {
      // Handle errors by setting an error message to state
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Typography color="primary" align="center">
              Already have an account? Sign In
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
