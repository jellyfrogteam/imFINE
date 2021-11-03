const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer()
// const myPeer = new Peer(undefined, {
//   host: '/',
//   port: '3001'
// })
//const myVideo = document.createElement('video')
const localVideo = document.querySelector('#localVideo')
// localVideo.muted = true //html에서 태그자체에 muted 해줌






/** object to store connected users
 * 연결된 사용자를 저장할 개체
 * @example
 * {userId : call object,}
 * */

const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  // 웹캠의 비디오 스트림을 비디오 요소에 추가
  addVideoStream(localVideo, stream)

  // 피어 개체를 통한 사용자 간 연결 처리
  myPeer.on('call', call => { //들어오는 유저 입장
    call.answer(stream)
    //const video = document.createElement('video')
    const remoteVideo = document.querySelector('#remoteVideo')
    call.on('stream', userVideoStream => {
      addVideoStream(remoteVideo, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

/** 소켓이 '사용자 보호됨'을 수신하는 경우
* 1. 피어로부터 호출 객체를 가져옵니다.
* 2. call.close를 통한 연결 닫기
* */
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

/** on Peer open send 소켓을 통해 'join-room'을 내보냅니다.
* peer에서 userId를 생성합니다.
* */
myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) { //(이미 방만들고 기다리고 있다가) 유저가 들어오면 실행
  const call = myPeer.call(userId, stream)
  // const video = document.createElement('video')
  const remoteVideo = document.querySelector('#remoteVideo')
  call.on('stream', userVideoStream => {
    addVideoStream(remoteVideo, userVideoStream)
  })
  call.on('close', () => {
    remoteVideo.remove()
  })

  // 피어에 호출 개체 추가
  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  // videoGrid.append(video)

}