import React, { Component } from 'react'


export default function SearchResults(props) {
  const { artists, albums, tracks } = props.searchResults
  return(
    <div>
      <h1>Artists</h1>
      <div className="all-artists">
        {artists ? (artists.items.map(artist => (
          <div key={artist.id} className="artists">
            <p className="artist-names">{artist.name}</p>
            {(artist.images.length) ? <a href={'#'}><img className="artist-images" alt="null"src={artist.images[0].url}/></a> : <p>no image</p>}
          </div>
        ))) : null}
      </div>

      <h1>Albums</h1>
      <div className="all-albums">
        { albums ? (albums.items.map(album => (
          <div key={album.id}>
            {album.album_type !== 'single' ? (
              <div className="albums">
                <p className="album-names">Album: {album.name}</p>
                <p>Artists: {album.artists[0].name}</p>
                <a onClick={() => props.setTrackView('AlbumTracks', album.id)} href={'#'}>
                  <img className="album-images" alt="null" src={album.images[1].url}/>
                </a>
              </div>) : null}
          </div>
        ))) : null }
      </div>
    </div>
  )
}
