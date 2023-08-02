// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";
import * as _ from "lodash";

const clientId = "1ba0ff92a7bc4f5bb2049b4614f0f9e9";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

main()

async function main(){
  const token = localStorage.getItem('token');
  if (!code && !token) {
    const html_control = document.getElementById('controls')!;

    var button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Login to spotify');
    button.setAttribute('id', 'button');
    button.setAttribute('class', 'btn btn-primary');
    html_control.appendChild(button);

    let btn = document.getElementById("button")!;

    btn.addEventListener("click", () => redirectToAuthCodeFlow(clientId));

  } else if(!token && code) {
    const accessToken = await getAccessToken(clientId, code);
    localStorage.setItem ('token', accessToken)
    const start = Date.now();
    localStorage.setItem ('token_time', start.toString());
    window.location.replace("./");

  } else if (token && !code){

    const html_control = document.getElementById('controls')!;

    var ihm_join_div = document.createElement('div');
    ihm_join_div.setAttribute('class', 'join')

    var ihm_number = document.createElement('input');
    ihm_number.setAttribute('type', 'number');
    ihm_number.setAttribute('value', '1');
    ihm_number.setAttribute('id', 'number');
    ihm_number.setAttribute('class', 'join-item input-bordered input');
    html_control.appendChild(ihm_number);

    var ihm_select = document.createElement('select');
    ihm_select.setAttribute('id', 'select')
    ihm_select.setAttribute('class', 'join-item select select-bordered');
    var option1 = document.createElement('option');
    option1.setAttribute('value', 'albums')
    option1.appendChild(document.createTextNode('Saved albums'));
    ihm_select.appendChild(option1);

    var option2 = document.createElement('option');
    option2.setAttribute('value', 'tracks')
    option2.appendChild(document.createTextNode('Saved tracks'));
    ihm_select.appendChild(option2);

    ihm_join_div.appendChild(ihm_select);

    var button = document.createElement('input');
    button.setAttribute('class', 'btn btn-primary join-item');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'GO');
    button.setAttribute('id', 'button');

    ihm_join_div.appendChild(button);

    html_control.appendChild(ihm_join_div);

    let btn = document.getElementById("button")!;
    btn.addEventListener("click", () =>{
      var select = (<HTMLInputElement>document.getElementById("select")).value
      if (select === 'albums'){
        logout()
        getData('album')
      }
      if (select === 'tracks'){
        logout()
        getData('track')
      }
    });
  }
}

async function getData(type: string){
  let i_number = parseInt((<HTMLInputElement>document.getElementById("number")).value);
  if (i_number <= 0){
    window.location.replace("./");
  }

  const token=localStorage.getItem('token')!;

  if (type ==='album'){
    const albumsList = await fetchAlbums(token);
    const randomAlbumsList = _.sampleSize(albumsList, i_number);
    addAlbumToQueue(randomAlbumsList, token);
    populateUI(randomAlbumsList, false, type);
  }

  if (type ==='track'){
    const trackList = await fetchTracks(token);
    const randomTrackList = _.sampleSize(trackList, i_number);
    addTrackToQueue(randomTrackList, token, false)
    populateUI(randomTrackList, false, type);
  }
}

async function fetchAlbums(code: string): Promise<Album[]>{
  let albumsList: AlbumsList;
  let albums: Album[] = [];

  populateUILoading('albums');

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

async function fetchTracks(code: string): Promise<Track[]>{
  let savedTrackList: SavedTracksList;
  let tracks: Track[] = [];

  populateUILoading('tracks');

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
    await addTrackToQueue(album.tracks.items, code, true)
  }
  populateUI(albums, true, "album");
}

async function addTrackToQueue(tracks: Track[], code: string, fromAlbum: boolean){
  for (const track of tracks){
    await fetch("https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A"+track.id,{
      method: "POST", headers: { Authorization: `Bearer ${code}` }
    });
  }

  if (!fromAlbum){
    populateUI(tracks, true, "track");
  }
}

async function logout(){
  const now = Date.now();
  const start = parseInt(localStorage.getItem('token_time')!);

  if ((now - start) > 3500*1000){
    localStorage.clear();
    window.location.replace("./");
  }
}

async function populateUILoading(type: string){
  const html_albums = document.getElementById('albums')!;
  var title = document.createElement('h2');
  title.appendChild(document.createTextNode("Loading your " + type + ", please wait."))
  var ihm_loading = document.createElement('span');
  ihm_loading.setAttribute('class', 'loading loading-spinner loading-lg')
  html_albums.innerHTML = "";
  html_albums.appendChild(title);
  html_albums.appendChild(ihm_loading);
}

async function populateUI(albums: (Track|Album)[], done: Boolean, type: string) {
    var list = document.createElement('ul');
    list.setAttribute('class', 'list-none');

    for (const album of albums){
      var item = document.createElement('li');
      item.appendChild(document.createTextNode(album.name));
      list.appendChild(item);
    }

    var title = document.createElement('h2');
    var status = "";
    if (!done){
      status = "We are adding the following " + type;
      if (albums.length > 1){
        status += "s";
      }
      status += " to your queue, please wait.";
    }

    if (done){
      status = "The following " + type;
      if (albums.length > 1){
        status += "s were";
      }
      else {
        status += " was";
      }
      status += " added to your queue.";
    }
      title.appendChild(document.createTextNode(status));

    var ihm_loading = document.createElement('span');
    const html_albums = document.getElementById('albums')!;
    html_albums.innerHTML = "";

    html_albums.appendChild(title);
    html_albums.appendChild(list);
    if (!done){
      ihm_loading.setAttribute('class', 'loading loading-spinner loading-lg');
      html_albums.appendChild(ihm_loading);
    }
}


