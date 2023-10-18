import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import { Socket, io } from 'socket.io-client'
import {
  AnimationKeys,
  EventKeys,
  EventTypes,
  InstructionKeys,
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
import ChallengeFactory from '../objects/challenge/ChallengeFactory'
import { createRandomChallenge } from '../utils'
import Skill from '../objects/skill/Skill'

var countdownText
var countdownValue = 3 // Thời gian countdown (giây)
var countdownTimer

export default class MainScene extends Phaser.Scene {
  fpsText

  private bigClouds: Phaser.GameObjects.TileSprite
  private socket: Socket
  private players: Players = {}
  private ground: Phaser.Tilemaps.TilemapLayer
  private width: number
  private height: number
  private characterGroup: Phaser.Physics.Arcade.Group
  private team: Team
  private challengeFactory: ChallengeFactory

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
      Object.keys(players).map(key => {
        if (key === this.socket.id) {
          this.createOwnPlayer(players[key])
        } else {
          this.createOtherPlayer(players[key])
        }
      })
    })

    this.socket.on(EventTypes.PlayerJoined, player => {
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
        callback: () => this.updateCountdown(this),
        loop: true
      })
    })

    this.events.on(`Attack`, () => {
      this.socket.emit(EventTypes.CurrentlyAttacking)
    })

    this.events.on(`Skill-${this.socket.id}`, () => {
      this.socket.emit(EventTypes.InitSkill)
    })

    this.socket.on(EventTypes.SkillFrom, skillPosion => {
      let skill = new Skill(this, skillPosion.coordinate.x, skillPosion.coordinate.y)
      this.add.existing(skill)
      this.tweens.add({
        targets: skill,
        x: skillPosion.to,
        duration: 500,
        ease: 'Linear',
        onComplete: () => {
          skill.play(AnimationKeys.UntilEnd)
        }
      })
    })
    this.socket.on(EventTypes.ActivateCurrentlyAttacking, id => {
      this.events.emit(`active-attacking-${id}`)
    })

    this.input.keyboard?.on('keydown-UP', this.handleUp, this)
    this.input.keyboard?.on('keydown-DOWN', this.handleDown, this)
    this.input.keyboard?.on('keydown-LEFT', this.handleLeft, this)
    this.input.keyboard?.on('keydown-RIGHT', this.handleRight, this)
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

  updateCountdown(scene: Phaser.Scene) {
    countdownValue--
    countdownText.setText(countdownValue)

    if (countdownValue <= 0) {
      countdownText.destroy()
      countdownTimer.remove(false)
      this.challengeFactory = new ChallengeFactory(scene, createRandomChallenge())
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

  private handleUp() {
    this.challengeFactory.emit(EventKeys.Press, InstructionKeys.Up)
  }

  private handleDown() {
    this.challengeFactory.emit(EventKeys.Press, InstructionKeys.Down)
  }

  private handleLeft() {
    this.challengeFactory.emit(EventKeys.Press, InstructionKeys.Left)
  }

  private handleRight() {
    this.challengeFactory.emit(EventKeys.Press, InstructionKeys.Right)
  }

  update() {
    this.setCloudParallax()
    // this.fpsText.update()
    if (this.challengeFactory) {
      this.challengeFactory.preUpdate()
    }
  }
}
