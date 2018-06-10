const clientID = 'ddf9091e6d3048ccaca5e5c3394d6abc';
let userAccessToken = '';
const redirectUri = "http://localhost:3000/";

const Spotify = {
  getAccessToken() {
    if (userAccessToken) {
      return userAccessToken;
    }
    const url = window.location.href;
    const accessToken = url.match(/access_token=([^&]*)/);
    const expiresIn = url.match(/expires_in=([^&]*)/);

    if (accessToken && expiresIn) {
      userAccessToken = accessToken[1];
      const expirationTime = Number(expiresIn[1])*1000;
        window.setTimeout(() => { // resets the userAccessToken when expirationTime has elapsed usin gthe setTimeout function.
          userAccessToken = '';
        }, expirationTime);
        window.history.pushState('Access Token', null, '/');
        return userAccessToken //returns to original url when timeout occurs
     } else {
       window.location.href= `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },
  search(term) {
    this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {headers: {Authorization: `Bearer ${userAccessToken}`}}
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse.tracks) {
      return jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        };
      });
    } else {
      return [];
    }
    });
  },
  savePlaylist(playlistName, trackURIs) {
    if(!playlistName || !trackURIs) {
      return;
    }
    console.log(playlistName);
    console.log(trackURIs);
    const accessToken = this.getAccessToken();
    console.log(accessToken);
    const headers = {Authorization: `Bearer ${accessToken}`};
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
      .then(response => response.json()) //this returns a promise that is converted to json with the user id in it
      .then(jsonResponse => jsonResponse.id) // this pulls the id from the response
      .then(userId => {
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,  //the user id from the previous then gets placed into the POST url argument
          {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({name: playlistName})
          }
        )
          .then(response => response.json()) //this returns a JSON object with the playlist id created in the previous POST
          .then(jsonResponse => {
            const playlistId = jsonResponse.id;
            console.log(playlistId);
            fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, // nested fetch so that I can use the userId and playlistId because theyre in the same scope
              {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({uris: trackURIs})
              }
            );
          });
      });
  }
};


export default Spotify;
