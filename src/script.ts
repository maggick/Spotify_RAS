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
    const accessToken = await getAccessToken(clientId, code);
    const albumsList = await fetchAlbums(accessToken);

    const randomAlbumsList = _.sampleSize(albumsList,2); //FIXME

    await addToQueue(randomAlbumsList, accessToken);
    populateUI(randomAlbumsList);
  }
}

async function addToQueue(albums: Album[], code: string){
  for (const album of albums){
    for (const track of album.tracks.items){
      await fetch("https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A"+track.id,{
        method: "POST", headers: { Authorization: `Bearer ${code}` }
      });
    }
  }

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

function populateUI(albums: Album[]) {
    //document.getElementById("url")!.setAttribute("href", profile.href);



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
