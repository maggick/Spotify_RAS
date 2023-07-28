// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";
import * as _ from "lodash";

const clientId = "1ba0ff92a7bc4f5bb2049b4614f0f9e9";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

main()

async function main(){
  if (!code) {
    const html_control = document.getElementById('controls')!;

    var button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Login to spotify');
    button.setAttribute('id', 'button');
    html_control.appendChild(button);

    let btn = document.getElementById("button")!;

    btn.addEventListener("click", () => redirectToAuthCodeFlow(clientId));

  } else {
    const html_control = document.getElementById('controls')!;

    var ihm_number = document.createElement('input');
    ihm_number.setAttribute('type', 'number');
    ihm_number.setAttribute('value', '1');
    ihm_number.setAttribute('id', 'number');
    html_control.appendChild(ihm_number);

    var ihm_select = document.createElement('select');
    ihm_select.setAttribute('id', 'select')

    var option1 = document.createElement('option');
    option1.setAttribute('value', 'albums')
    option1.appendChild(document.createTextNode('Saved albums'));
    ihm_select.appendChild(option1);

    var option2 = document.createElement('option');
    option2.setAttribute('value', 'tracks')
    option2.appendChild(document.createTextNode('Saved tracks'));
    ihm_select.appendChild(option2);

    html_control.appendChild(ihm_select);

    var button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'GO');
    button.setAttribute('id', 'button');

    html_control.appendChild(button);

    let btn = document.getElementById("button")!;
    btn.addEventListener("click", () =>{
      var select = (<HTMLInputElement>document.getElementById("select")).value
      if (select === 'albums'){
        getAlbums(code)
      }
      if (select === 'tracks'){
        getTracks(code)
      }
    });
  }
}

async function getAlbums(code: string){
  let i_number = parseInt((<HTMLInputElement>document.getElementById("number")).value);

  const accessToken = await getAccessToken(clientId, code);
  const albumsList = await fetchAlbums(accessToken);

  const randomAlbumsList = _.sampleSize(albumsList, i_number);

  addAlbumToQueue(randomAlbumsList, accessToken);

  populateUI(randomAlbumsList);
}

async function fetchAlbums(code: string): Promise<Album[]>{
  let albumsList: AlbumsList;
  let albums: Album[] = [];

  var offset = 0;
  do {
    const result = await fetch("https://api.spotify.com/v1/me/albums?offset="+offset+"&limit=50", {
      method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    albumsList = await result.json();
    albumsList.items.forEach(item =>{
      albums.push(item.album)
    })
    offset +=50;
  } while (albumsList.next != null)

  return albums;
}

async function getTracks(code: string){
    let i_number = parseInt((<HTMLInputElement>document.getElementById("number")).value);

    const accessToken = await getAccessToken(clientId, code);
    const trackList = await fetchTracks(accessToken);

    const randomTrackList = _.sampleSize(trackList, i_number);

    addTrackToQueue(randomTrackList, accessToken)

    //populateUI(randomAlbumsList);
}

async function fetchTracks(code: string): Promise<Track[]>{
  let savedTrackList: SavedTracksList;
  let tracks: Track[] = [];

  var offset = 0;
  do {
    const result = await fetch("https://api.spotify.com/v1/me/tracks?offset="+offset+"&limit=50", {
      method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    savedTrackList = await result.json();
    savedTrackList.items.forEach(item =>{
      tracks.push(item.track)
    })
    offset +=50;
  } while (savedTrackList.next != null)

  return tracks;
}

async function addAlbumToQueue(albums: Album[], code: string){
  for (const album of albums){
    for (const track of album.tracks.items){
      await fetch("https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A"+track.id,{
        method: "POST", headers: { Authorization: `Bearer ${code}` }
      });
    }
  }
}

async function addTrackToQueue(tracks: Track[], code: string){
    for (const track of tracks){
      await fetch("https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A"+track.id,{
        method: "POST", headers: { Authorization: `Bearer ${code}` }
      });
    }
}

async function populateUI(albums: Album[]) {
    var list = document.createElement('ul');

    for (const album of albums){
      var item = document.createElement('li');
      item.appendChild(document.createTextNode(album.name));
      list.appendChild(item)
    }

    var title = document.createElement('h2');
    if (albums.length == 1){
      title.appendChild(document.createTextNode("The following album was added to your queue:"))
    }
    else{
      title.appendChild(document.createTextNode("The following albums were added to your queue:"))
    }

    const html_albums = document.getElementById('albums')!;
    html_albums.appendChild(title);
    html_albums.appendChild(list);
}
