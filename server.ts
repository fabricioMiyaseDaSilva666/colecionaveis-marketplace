import { createServer } from 'node:http'
import { Server } from 'socket.io'

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
  },
})

io.on('connection', (socket) => {
  console.log('Cliente conectado ao Socket.IO:', socket.id)

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})

setInterval(() => {
  io.emit('nft:availability', {
    nftId: 'nft-001',
    available: Math.floor(Math.random() * 10) + 1,
  })
}, 10000)

httpServer.listen(3001, () => {
  console.log('Servidor Socket.IO rodando na porta 3001')
})