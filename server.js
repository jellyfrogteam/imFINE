const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected',userId)
    })
  })
})
//fff

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyDuuMJu0akL4eaFTt2rP6eCS0r4MdpJNeE",
  authDomain: "imfine-4a4e5.firebaseapp.com",
  projectId: "imfine-4a4e5"
});

var db = firebase.firestore();

db.collection("users").add({
  first: "Ada",
  last: "Lovelace",
  born: 1815
})
.then((docRef) => {
  console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
  console.error("Error adding document: ", error);
});

server.listen(port, () => console.log(`listening on port ${port}`))