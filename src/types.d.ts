interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean,
        filter_locked: boolean
    },
    external_urls: { spotify: string; };
    followers: { href: string; total: number; };
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}

interface AlbumsList{
  href: string;
  limit: int;
  next: string;
  offset: int;
  previous: string;
  total: int
  items: Item[]
}

interface Item{
  added_at: string;
  album: Album;

}

interface Album{
  album_type: string;
  total_tracks: int;
  available_markets: string[];
  external_urls: string;
  href: string;
  id: string;
  images: Image;
  name: string;
  release_date: string;
  release_date_precision: string;
  //"restrictions": {          "reason": "market"        },        "type": "album",        "uri": "spotify:album:2up3OPMp9Tb4dAKM2erWXQ",        "copyrights": [          {            "text": "string",            "type": "string"          }        ],        "external_ids": {          "isrc": "string",          "ean": "string",          "upc": "string"        },        "genres": ["Egg punk", "Noise rock"],        "label": "string",        "popularity": 0,        "artists": [          {            "external_urls": {              "spotify": "string"            },            "followers": {              "href": "string",              "total": 0            },            "genres": ["Prog rock", "Grunge"],            "href": "string",            "id": "string",            "images": [              {                "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",                "height": 300,                "width": 300              }            ],            "name": "string",            "popularity": 0,            "type": "artist",            "uri": "string"          }        ],       
  tracks: TracksList;
  //{          "href": "https://api.spotify.com/v1/me/shows?offset=0&limit=20",          "limit": 20,          "next": "https://api.spotify.com/v1/me/shows?offset=1&limit=1",          "offset": 0,          "previous": "https://api.spotify.com/v1/me/shows?offset=1&limit=1",          "total": 4,          "items": [            {              "artists": [                {                  "external_urls": {                    "spotify": "string"                  },                  "href": "string",                  "id": "string",                  "name": "string",                  "type": "artist",                  "uri": "string"                }              ],              "available_markets": ["string"],              "disc_number": 0,              "duration_ms": 0,              "explicit": false,              "external_urls": {                "spotify": "string"              },              "href": "string",              "id": "string",              "is_playable": false,              "linked_from": {                "external_urls": {                  "spotify": "string"                },                "href": "string",                "id": "string",                "type": "string",                "uri": "string"              },              "restrictions": {                "reason": "string"              },              "name": "string",              "preview_url": "string",              "track_number": 0,              "type": "string",              "uri": "string",              "is_local": false

}

interface TracksList{
  href: string;
  limit: int;
  next: string;
  offset: int;
  previous: string;
  total: int
  items: Track[]
}

interface Track{
  id: string
  name: string
}

interface Image {
    url: string;
    height: number;
    width: number;
}
