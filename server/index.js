const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:8080', 'http://192.168.1.45:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  },
  pingTimeout: 60000
})

// Enable CORS
app.use(cors())

app.set('port', 5000)

server.listen(5000, function () {
  console.log('Starting server on port 5000')
})

var players = {}

const width = 400
const height = 640

var isLeft = true;

io.on('connection', function (socket) {
  console.log('player [' + socket.id + '] connected')

  if (Object.keys(players).length <= 2) {
    players[socket.id] = {
      x: isLeft ? width / 2 - 100 : width / 2 + 100,
      y: height / 2 + 80,
      id: socket.id,
      isLeft: isLeft,
    }

    socket.emit('currentPlayers', players)
    socket.broadcast.emit('newPlayer', players[socket.id])
    isLeft = false;

  }

  socket.on("attacking", () => {
    io.emit("attack activation", socket.id )
  })

  socket.on('disconnect', function () {
    console.log('player [' + socket.id + '] disconnected')
    if (players[socket.id].isLeft == true) {
      isLeft = true
    }
    delete players[socket.id]
    io.emit('playerDisconnected', socket.id)
  })
})
