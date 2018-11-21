import React from 'react';

export default function Search(props){
  return(
    <form onSubmit={props.handleSubmit}>
      <input
        type="text"
        name="search"
        placeholder="Search artist, album, or song"
        value={props.value}
        onChange={props.handleChange}
      />
    </form>
  )
}
