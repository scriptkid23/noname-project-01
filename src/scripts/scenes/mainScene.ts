import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import { Socket, io } from 'socket.io-client'

export default class MainScene extends Phaser.Scene {
  fpsText

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    const socket = io('http://192.168.1.45:5000')
    const scene = this // Lưu tham chiếu đến đối tượng MainScene

    const playersGroup = {}

    socket.on('currentPlayers', players => {
      console.log('Current Plater', players)
      Object.keys(players).map(key => {
        addPlayer(players[key])
      })
    })

    const addPlayer = data => {
      console.log('join room')
      const width = 30 // Chiều rộng của hình chữ nhật
      const height = 100 // Chiều cao của hình chữ nhật
      const sprite = this.add.rectangle(data.x, data.y, width, height, 0x000000)
      playersGroup[data.id] = data


    }

    scene.input.keyboard?.on('keydown-SPACE', () => {
      socket.emit('attacking', socket.id)
    })

    socket.on('attack activation', id => {
      console.log(id)
      let player = playersGroup[id];

      console.log(player);

      let x = this.add.circle(player.x + 18, player.y,15,player.isLeft ? 0x868686 : 0x234424)

      scene.tweens.add({
        targets: x,
        x: player.isLeft ? player.x + 250 : player.x - 250,
        ease: "Linear",
        duration: 500,
        yoyo: true,
        onComplete: () => {
          x.destroy()
        }
      })
    })
    socket.on('newPlayer', data => {
      addPlayer(data)
    })

    socket.on('playerDisconnected', id => {
      console.log(playersGroup)
      playersGroup[id].destroy()
      delete playersGroup[id]
    })

    // this.fpsText = new FpsText(this)

    // display the Phaser.VERSION
    // this.add
    //   .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
    //     color: '#000000',
    //     fontSize: '24px'
    //   })
    //   .setOrigin(1, 0)
  }

  update() {
    // this.fpsText.update()
  }
}
