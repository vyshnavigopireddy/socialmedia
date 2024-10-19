import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Avatar } from '@mui/material';
import API from '../api/axios';

function Profile() {
  const [profileData, setProfileData] = useState({
    username: '',
    followers: 0,
    following: 0,
    bio: '',
    profilePicture: '',
  });

  useEffect(() => {
    // Fetch profile data from the server
    const fetchProfileData = async () => {
      try {
        const response = await API.get('/user/profile');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {/* Profile Info */}
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar 
              src={profileData.profilePicture} 
              sx={{ width: 100, height: 100, mb: 2 }} 
            />
            <Typography variant="h5">{profileData.username}</Typography>
            <Typography variant="body1">{profileData.bio}</Typography>
          </Box>
        </Grid>

        {/* Followers and Following */}
        <Grid item xs={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6">Followers</Typography>
              <Typography variant="body1">{profileData.followers}</Typography>
            </Box>
            <Box>
              <Typography variant="h6">Following</Typography>
              <Typography variant="body1">{profileData.following}</Typography>
            </Box>
          </Box>

          <Button variant="contained" color="primary">Edit Profile</Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;
