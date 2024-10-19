import axios from 'axios';
export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/posts');
    dispatch({ type: 'GET_POSTS_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'GET_POSTS_FAILURE', payload: error });
  }
};
