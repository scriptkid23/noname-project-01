import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import { Socket, io } from 'socket.io-client'
import { EventTypes, SceneKeys, TextureKeys, TileLayerKeys, TileLayerKeysType, TileLayerName, TileMapKeys } from '../../constants'
import { Players } from '../../types'
import { Scene } from 'phaser'
import WaterReflect from '../objects/WaterReflect'

var countdownText
var countdownValue = 3 // Thời gian countdown (giây)
var countdownTimer

export default class MainScene extends Phaser.Scene {
  fpsText

  private bigClouds: Phaser.GameObjects.TileSprite;
  private socket: Socket
  private players: Players
  private canPlay: boolean = false
  private ground: Phaser.Tilemaps.TilemapLayer
  private width: number;
  private height: number;


  constructor() {
    super(SceneKeys.MainScene)
    this.socket = io('http://localhost:8080')
  }

  create() {
    const map = this.make.tilemap({
      key: TileMapKeys.TreatureHunters
    })
    this.width = this.scale.width
    this.height = this.scale.height


    this.loadMap(map, TileLayerKeys)

    this.socket.emit(EventTypes.JoinRoom, 'room00')

    this.readyButton(this.socket)

    this.socket.on(EventTypes.FetchPlayers, players => {
      console.log(`${EventTypes.FetchPlayers}: `, players)
    })

    this.socket.on(EventTypes.PlayerJoined, player => {
      console.log(`${EventTypes.PlayerJoined}: `, player)
    })

    this.socket.on(EventTypes.PlayerLeft, id => {})

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

  private loadMap(map: Phaser.Tilemaps.Tilemap, types: TileLayerKeysType[]) {
    types.forEach(type => {
      const tileset = map.addTilesetImage(type.tilesets)

      if (!tileset) return

      const layer = map.createLayer(type.layer, tileset)

      if (!layer) return

      if (type.layer === TileLayerName.Ground) {
        layer.setCollisionByProperty({ collides: true })
        this.ground = layer

        // active debug for tiled
        // const debugGraphics = this.add.graphics().setAlpha(0.7);

        // layer.renderDebug(debugGraphics, {
        //   tileColor: null,
        //   collidingTileColor: new Phaser.Display.Color(243, 234, 48,255),
        //   faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // })
      }
      this.add.existing(layer)
    })

    new WaterReflect(this, this.width / 2, this.height / 2 + 63)
    this.bigClouds = this.add.tileSprite(
      this.width / 2,
      this.height / 2 + 4,
      this.width,
      101,
      TextureKeys.BigClouds
    );
  }

  setCloudParallax() {
    this.bigClouds.tilePositionX += 0.5;
  }

  update() {
    this.setCloudParallax()
    // this.fpsText.update()
  }
}
