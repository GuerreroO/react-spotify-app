import React, { Component } from 'react';

export default function AlbumTracks(props) {
    const tracks = props.trackList.items
    return(
        <div>
         {console.log(props.trackList.items[0], 'huuuuuh')}
         {tracks.map(track => (
             <div>
                 <p>{track.name}</p>
                 <button onClick={() => props.playThatSong(track.uri)}>
                     {track.name}
                 </button>
             </div>
         ))}
        </div>
    )
}