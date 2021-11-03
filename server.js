const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const port = process.env.PORT || 3000
let roomnameID

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  roomnameID = uuidV4()
  res.redirect(`/${roomnameID}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})


//Node.js
const admin = require('firebase-admin')
const serviceAccount = require("./imfine-4a4e5-firebase-adminsdk-9cd31-59c40861ee.json"); //중요한 비공개 키임
admin.initializeApp({
  apiKey: "AIzaSyDuuMJu0akL4eaFTt2rP6eCS0r4MdpJNeE",
  authDomain: "imfine-4a4e5.firebaseapp.com",
  projectId: "imfine-4a4e5",
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


io.on('connection', async socket => {

  await roomOpenAndClose(1)

  socket.on('join-room', async (roomId, userId) => {
    socket.join(roomId)
    await roomOpenAndClose(0)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', async () => {
      await roomOpenAndClose(0)
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
})

async function roomOpenAndClose(flag) {
  if(flag == 1){ //roomCreate
    try {
      //방 제거됐는데 또 제거 체크
      // const roomRef = db.collection('rooms').doc('roomname');
      const roomRef = db.collection('rooms').doc(`${roomnameID}`);
      await roomRef.set({
        'first': "사용자 정보 등"
      });
    } catch (error) {
      console.log(error)
    }
  } else if(flag == 0){ //roomDelete
    
  }
}

//fff

//Node.js
// const admin = require('firebase-admin')
// admin.initializeApp({
//   apiKey: "AIzaSyDuuMJu0akL4eaFTt2rP6eCS0r4MdpJNeE",
//   authDomain: "imfine-4a4e5.firebaseapp.com",
//   projectId: "imfine-4a4e5"
// });

// const db = admin.firestore();
// const aTuringRef = db.collection('users').doc('aturing');

// await aTuringRef.set({
//   'first': 'Alan',
//   'middle': 'Mathison',
//   'last': 'Turing',
//   'born': 1912
// });

server.listen(port, () => console.log(`listening on port ${port}`))