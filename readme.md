# Random Spotify album selector

Add a random saved album to your queue.

## Pre-requisites

To run this you will need:

- A [Node.js LTS](https://nodejs.org/en/) environment or later.
- A [Spotify Developer Account](https://developer.spotify.com/)

## Usage

Create an app in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/),
set the redirect URI to ` http://localhost:5173/Spotify_RAS/` and copy your Client ID.

Clone the repository, replace the value for clientId in `/src/script.ts` with your own Client ID and run:

```bash
npm install
npm run dev
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```



## Live Demo

A live demo is available at [https://maggick.fr/Spotify_RAS/](https://maggick.fr/Spotify_RAS/). As
the application is still in Spotify
["Development mode"](https://developer.spotify.com/documentation/web-api/concepts/quota-modes) you
need to be added manually to the list of authorized user (spotify username and email required).

