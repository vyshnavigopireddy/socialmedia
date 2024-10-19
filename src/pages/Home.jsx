import React from 'react';
import { Box, Typography, Container, Grid, Paper, Button } from '@mui/material';

function Post({ post }) {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6">{post.username}</Typography>
      <img src={post.imageUrl} alt={post.caption} style={{ width: '100%', borderRadius: '8px' }} />
      <Typography variant="body1" sx={{ mt: 1 }}>{post.caption}</Typography>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button size="small" color="primary">Like</Button>
        <Button size="small" color="primary">Comment</Button>
        <Button size="small" color="primary">Share</Button>
      </Box>
    </Paper>
  );
}

const samplePosts = [
  { id: 1, username: 'user1', imageUrl: 'https://via.placeholder.com/500', caption: 'Beautiful day!' },
  { id: 2, username: 'user2', imageUrl: 'https://via.placeholder.com/500', caption: 'Loving the sunset!' },
];

function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {/* Sidebar */}
        <Grid item xs={3}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Navigation</Typography>
            <Button fullWidth variant="contained" color="primary" sx={{ mb: 2 }}>Profile</Button>
            <Button fullWidth variant="contained" color="primary" sx={{ mb: 2 }}>Explore</Button>
            <Button fullWidth variant="contained" color="primary">Messages</Button>
           
          </Box>
        </Grid>

        {/* Feed */}
        <Grid item xs={6}>
          {samplePosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Grid>

        {/* Suggestions or Ads */}
        <Grid item xs={3}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Suggested</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>User3</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>User4</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>User5</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
