import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import { Socket, io } from 'socket.io-client'
import { EventTypes, SceneKeys } from '../../constants'
import { Players } from '../../types'

export default class MainScene extends Phaser.Scene {
  fpsText

  private socket: Socket
  private players: Players

  constructor() {
    super(SceneKeys.MainScene)
    this.socket = io('http://localhost:8080')
  }

  create() {
    this.socket.emit(EventTypes.JoinRoom, 'room00')

    this.socket.on(EventTypes.FetchPlayers, players => {
      console.log(`${EventTypes.FetchPlayers}: `, players)
    })

    this.socket.on(EventTypes.PlayerJoined, player => {
      console.log(`${EventTypes.PlayerJoined}: `, player)
    })

    this.socket.on(EventTypes.PlayerLeft, id => {
      console.log(id)
      const isExist = Object.keys(this.players).filter(value => value === id).length > 0

      if (!isExist) return

      // this.players[id].destroy();
    })
  }

  update() {
    // this.fpsText.update()
  }
}
