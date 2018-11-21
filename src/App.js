import React, { Component } from 'react';
import './App.css';
import SpotifyLogin from 'react-spotify-login';
import {getSearchData, getAlbumTracks} from './components/SpotifyAPI';
import Search from './components/Search';
import SearchResults from './components/SearchResults';
import ArtistAlbums from './components/ArtistAlbums';
import AlbumTracks from './components/AlbumTracks';
const clientId = '4106871331f944c4b516d376d8b5616c';
const redirectUri = 'http://localhost:3000/';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      searchResults: [],
      trackList: [],
      search: '',
      artist: '',
      deviceId: '',
      trackUri: '',
      currentView: 'null'
    }
    this.playerCheckInterval = null;
  }

  getTracks = async (id) => {
    const tracks = await getAlbumTracks(id);
    this.setState({
      trackList: tracks
    })
    console.log(this.state.trackList, 'these are tracks')
  }

  checkForPlayer() {
    const token = localStorage.getItem('spotify_access_token')
    if (window.spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: 'oneil spotify player',
        getOauthToken: callback => { callback(token); },
      });
      this.createEventHandlers();
      this.player.connect();
    }
  }

  createEventHandlers() {
    //error events
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: true });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    //player_state_changed event that updates shows your devices current states
    //https://developer.spotify.com/documentation/web-playback-sdk/reference/#object-web-playback-state
    // this.player.on('player_state_changed', (state) =>  {
    //   this.onStateChanged(state);
    //   console.log(state, 'the changed state');
    // });

    //ready spits out webPlayBackPlayer object which holds  data.device_id
    this.player.on('ready', async data => {
      let { device_id } = data;
      console.log('let the music play on!');
      await this.setState({ deviceId: device_id})
      // this.playTrack();
      // this.transferPlaybackHere();
    });
  }

  playTrack(uri) {
    const token = localStorage.getItem('spotify_access_token')
    const {deviceId} = this.state;
    console.log(token)
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
    }

  responseSpotify = resp => {
    if(resp.access_token) {
      this.setState({
        loggedIn: true
      })
      localStorage.setItem('spotify_access_token', resp.access_token);
      console.log('got token');
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
    console.log(resp);
  }

  obtainSpotifyData = async () =>{
    const artists = await getSearchData()
    console.log(artists)
  }

  handleChange = (e) => {
    const {value} = e.target;
    console.log(value)
    this.setState({
      search: value,
      currentView: null

    })
    this.handleSearchResults(value);
  }


  handleSearchResults = async (searchValue) => {
    const searchResults = await getSearchData(searchValue);
    this.setState({
      searchResults: searchResults
    })
    console.log(searchResults, 'The Data')
  }

  playThatSong = (uri) => {
    // this.setState({
    //   trackUri: uri
    // })
    this.playTrack(uri);
  }


  onTogglePlay() {
    this.player.togglePlay()
  }

  getView = () => {
    let view = this.state.currentView;
    switch(view){
      case 'ArtistAlbums':
        return <ArtistAlbums
          searchResults={this.state.searchResults}
        />
      case 'AlbumTracks':
        return <AlbumTracks
          searchResults={this.state.searchResults}
          trackList={this.state.trackList}
          playThatSong={this.playThatSong}
        />
      default:
       return <SearchResults
         searchResults={this.state.searchResults}
         handleSubmit={this.handleSubmit}
         value={this.state.search}
         setTrackView={this.setTrackView}
       />
    }   
  }

  setTrackView = async (view, id) => {
    await this.getTracks(id);
    this.setView(view);

    
  }

  setView = (view) => {
    this.setState({
      currentView: view
    })
  }


  render() {
    const scope= [
      'user-read-playback-state',
      'user-read-currently-playing',
      'user-modify-playback-state',
      'streaming',
    ];
    const { loggedIn } = this.state;
    return (
      <div className="App">
        {console.log(this.state.currentView)}
        {loggedIn ? (
          <div>
            <Search
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              value={this.state.search}
            />
            {this.getView()}
            <button onClick={() => this.onTogglePlay()}>play/pause</button>
          </div>) :
          (<SpotifyLogin
            clientId={clientId}
            scope={scope}
            redirectUri={redirectUri}
            onSuccess={this.responseSpotify}
            onFailure={this.responseSpotify}
          />)
        }
      </div>
    );
  }
}

export default App;
