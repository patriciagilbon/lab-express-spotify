require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', (req, res, next) =>{
    res.render('artist-search')
})

app.post('/artist-search', (req, res, next) =>{
    spotifyApi.searchArtists(req.body.artistSearch)
        .then(data => {
            debugger
            console.log("The received data from the API: ", data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results', {data});
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
})
app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId).then(
        function(data) {
          console.log('Artist albums', data.body);
          res.render('album', {data});
        },
        function(err) {
          console.error(err);
        }
      );
  });

  app.get('/tracks/:trackId', (req, res, next) => {
      spotifyApi.getAlbumTracks(req.params.trackId, { limit : 5, offset : 1 })
      .then(function(data) {
        console.log(data.body);
        res.render('tracks', {data});
      }, function(err) {
        console.log('Something went wrong!', err);
      });
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
