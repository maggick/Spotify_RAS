# Random Spotify album selector

Add a random saved album to your queue.

## Pre-requisites

To run this demo you will need:

- A [Node.js LTS](https://nodejs.org/en/) environment or later.
- A [Spotify Developer Account](https://developer.spotify.com/)

## Usage

Create an app in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/),
set the redirect URI to ` http://localhost:5173/callback` and `http://localhost:5173/callback/`
and copy your Client ID.

Clone the repository, replace the value for clientId in `/src/script.ts` with your own Client ID and run:

```bash
npm install
npm run dev
```

