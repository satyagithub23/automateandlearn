import { createServer } from "node:http";
import next from "next";
import { Server } from 'socket.io'
import pty from 'node-pty'

export default function SocketHandler (req, res) {
    if (res.socket.server.io) {
      console.log('Socket is already running')
    } else {
      console.log('Socket is initializing')
      const io = new Server(res.socket.server)
      res.socket.server.io = io
  
      io.on('connection', socket => {
        socket.on('input-change', msg => {
          socket.broadcast.emit('update-input', msg)
        })
      })
    }
    res.end()
  }