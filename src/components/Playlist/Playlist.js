import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';


class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this); //because it's being used as an event handler we need to bind it
    this.handleSave = this.handleSave.bind(this);
  }
  handleNameChange(event) {
    let name = event.target.value;
    return this.props.onNameChange(name);
  }
  handleSave(event) {
    let name = this.props.playlistName;
    return this.props.onSave(name);
  }
  render() {
    return (
      <div className="Playlist">
        <input onChange={this.handleNameChange} defaultValue="New Playlist" />
          <TrackList onRemove={this.props.onRemove} isRemoval={true} tracks={this.props.playlistTracks} />
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;
