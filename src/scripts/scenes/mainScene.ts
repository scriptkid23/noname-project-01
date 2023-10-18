import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import { Socket, io } from 'socket.io-client'
import {
  EventTypes,
  SceneKeys,
  Team,
  TextureKeys,
  TileLayerKeys,
  TileLayerKeysType,
  TileLayerName,
  TileMapKeys
} from '../../constants'
import { Players } from '../../types'
import { Scene } from 'phaser'
import WaterReflect from '../objects/WaterReflect'
import Character from '../objects/character/Character'

var countdownText
var countdownValue = 3 // Thời gian countdown (giây)
var countdownTimer

export default class MainScene extends Phaser.Scene {
  fpsText

  private bigClouds: Phaser.GameObjects.TileSprite
  private socket: Socket
  private players: Players = {}
  private canPlay: boolean = false
  private ground: Phaser.Tilemaps.TilemapLayer
  private width: number
  private height: number
  private characterGroup: Phaser.Physics.Arcade.Group
  private team: Team

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

    this.characterGroup = this.physics.add.group()

    this.loadMap(map, TileLayerKeys)

    this.cameras.main.setBounds(0, 0, this.width, this.height)
    this.physics.world.setBounds(0, 0, this.width, this.height)
    this.physics.add.collider(this.characterGroup, this.ground)

    this.socket.emit(EventTypes.JoinRoom, 'room00')

    this.readyButton(this.socket)

    this.socket.on(EventTypes.FetchPlayers, players => {
      console.log(`${EventTypes.FetchPlayers}: `, players)
      Object.keys(players).map(key => {
        if (key === this.socket.id) {
          this.createOwnPlayer(players[key])
        } else {
          this.createOtherPlayer(players[key])
        }
      })
    })

    this.socket.on(EventTypes.PlayerJoined, player => {
      console.log(`${EventTypes.PlayerJoined}: `, player)
      this.createOtherPlayer(player)
    })

    this.socket.on(EventTypes.PlayerLeft, id => {
      if (!this.players[id]) return

      this.players[id].destroy()
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

  createOwnPlayer(player) {
    const character = new Character(this, player.coordinate.x, player.coordinate.y, player.id, player.team)
    this.characterGroup.add(character)
    this.players[player.id] = character
    this.team = player.team
  }

  createOtherPlayer(player) {
    const character = new Character(this, player.coordinate.x, player.coordinate.y, player.id, player.team)
    this.characterGroup.add(character)
    this.players[player.id] = character
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
      //TODO:
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
      }
      this.add.existing(layer)
    })

    new WaterReflect(this, this.width / 2, this.height / 2 + 63)
    this.bigClouds = this.add.tileSprite(this.width / 2, this.height / 2 + 4, this.width, 101, TextureKeys.BigClouds)
  }

  setCloudParallax() {
    this.bigClouds.tilePositionX += 0.5
  }

  update() {
    this.setCloudParallax()
    // this.fpsText.update()
  }
}
