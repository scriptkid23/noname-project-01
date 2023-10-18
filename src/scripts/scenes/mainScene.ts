import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import { Socket, io } from 'socket.io-client'
import { EventTypes, SceneKeys } from '../../constants'
import { Players } from '../../types'
import { Scene } from 'phaser'

var countdownText
var countdownValue = 3 // Thời gian countdown (giây)
var countdownTimer

export default class MainScene extends Phaser.Scene {
  fpsText

  private socket: Socket
  private players: Players
  private canPlay: boolean = false

  constructor() {
    super(SceneKeys.MainScene)
    this.socket = io('http://localhost:8080')
  }

  create() {
    this.socket.emit(EventTypes.JoinRoom, 'room00')

    this.readyButton(this.socket)

    this.socket.on(EventTypes.FetchPlayers, players => {
      console.log(`${EventTypes.FetchPlayers}: `, players)
    })

    this.socket.on(EventTypes.PlayerJoined, player => {
      console.log(`${EventTypes.PlayerJoined}: `, player)
    })

    this.socket.on(EventTypes.PlayerLeft, id => {
      // if (Object.keys(this.players).length === 0) return
      // const isExist = Object.keys(this.players).filter(value => value === id).length > 0
      // if (!isExist) return
      // this.players[id].destroy();
    })

    this.socket.on(EventTypes.CanPlay, canPlay => {
      if (!canPlay) return

      countdownText = this.add.text(200, 320, `${countdownValue}`, {
        fontFamily: 'Arial',
        fontSize: 32,
        color: '#000000'
      })
      countdownText.setOrigin(0.5)

      countdownTimer = this.time.addEvent({
        delay: 1000,
        callback: this.updateCountdown,
        loop: true
      })
    })
  }

  updateCountdown() {
    countdownValue--
    countdownText.setText(countdownValue)

    if (countdownValue <= 0) {
      countdownText.destroy()
      countdownTimer.remove(false)

      this.canPlay = true
    }
  }

  private readyButton(socket: Socket) {
    var rect = this.add.rectangle(200, 320, 200, 80, 0x000000)
    rect.setInteractive() 

  
    var text = this.add.text(200, 320, 'Ready', { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' })
    text.setOrigin(0.5) // Đặt gốc của văn bản ở giữa

  
    rect.on('pointerdown', function () {
      socket.emit(EventTypes.PlayerReady)
      rect.destroy()
      // Thêm các xử lý khác tại đây
    })
  }

  update() {
    // this.fpsText.update()
  }
}
