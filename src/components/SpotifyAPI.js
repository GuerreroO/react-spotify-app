import axios from 'axios';

async function getSearchData(search){
  const accessToken = localStorage.getItem('spotify_access_token');
  if(!accessToken){ throw new Error('Must Authorize with Spotify') }
  const resp = await axios({
    method: 'get',
    url: `https://api.spotify.com/v1/search?q=${search}&type=track%2Calbum%2Cartist&market=US`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return(
    resp.data
  )
}

async function getAlbumTracks(id){
  const accessToken = localStorage.getItem('spotify_access_token');
  if (!accessToken) {throw new Error('Must Authorize with Spotify')}
  const resp = await axios({
    method: 'get',
    url: `https://api.spotify.com/v1/albums/${id}/tracks?market=us&limit=50`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return(
    resp.data
  )
}

export { getSearchData, getAlbumTracks }
