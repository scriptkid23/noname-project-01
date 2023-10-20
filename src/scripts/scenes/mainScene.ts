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
import { InformationGroup, Players } from '../../types'
import { Scene } from 'phaser'
import WaterReflect from '../objects/WaterReflect'
import Character from '../objects/character/Character'
import ChallengeFactory from '../objects/challenge/ChallengeFactory'
import { createRandomChallenge } from '../utils'
import Skill from '../objects/skill/Skill'
import Information from '../objects/character/Information'
import Pannel from '../objects/Pannel'
import Focus from '../objects/Focus'

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
  private canPlay: boolean = false
  private challengeFactory: ChallengeFactory
  private informationGroup: InformationGroup = {}

  constructor() {
    super(SceneKeys.MainScene)
    this.socket = io('https://noname-cexg.onrender.com/')
  }

  create() {
    this.width = this.scale.width
    this.height = this.scale.height

    const map = this.make.tilemap({
      key: TileMapKeys.TreatureHunters
    })

    this.characterGroup = this.physics.add.group()

    this.loadMap(map, TileLayerKeys)
    this.cameras.main.setBounds(0, 0, this.width, this.height)
    this.physics.world.setBounds(0, 0, this.width, this.height)
    this.physics.add.collider(this.characterGroup, this.ground)

    this.socket.on('connect', () => {
      this.socket.emit(EventTypes.JoinRoom, 'room00')

      //event

      this.events.on(`attack-${this.socket.id}`, () => {
        this.events.emit(`active-attacking-${this.socket.id}`)
        this.socket.emit(EventTypes.CurrentlyAttacking)
      })

      this.events.on(`skill`, ({ id, team, playerCoordinateX, playerCoordinateY }) => {
        this.createSkill(team, playerCoordinateX, playerCoordinateY)
      })

      //socket
      this.socket.on(EventTypes.Loser, playerId => {
        this.canPlay = false

        var rect = this.add.rectangle(200, 320, 200, 80, 0x000000)
        rect.setInteractive()

        var text = this.add.text(200, 320, playerId === this.socket.id ? 'Lose' : 'Win', {
          fontFamily: '"Press Start 2P"',
          fontSize: 32,
          color: '#ffffff'
        })
        this.events.emit(`death-${playerId}`)

        text.setOrigin(0.5)
      })

      this.socket.on(EventTypes.ActivateBeingAttacked, players => {
        Object.keys(players).map(key => {
          this.events.emit(`health-${key}`, players[key].healthy)
        })
      })

      this.socket.on(EventTypes.ActivateCurrentlyAttacking, data => {
        // active from other player
        if (data.id === this.socket.id) return
        this.events.emit(`active-attacking-${data.id}`)
      })

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

        this.informationGroup[id].destroy()
        this.players[id].destroy()
      })

      this.socket.on(EventTypes.CanPlay, canPlay => {
        if (!canPlay) return

        countdownText = this.add.text(200, 160, `${countdownValue}`, {
          fontFamily: '"Press Start 2P"',
          fontSize: 50
        })
        countdownText.setOrigin(0.5)

        countdownTimer = this.time.addEvent({
          delay: 1000,
          callback: () => this.updateCountdown(this),
          loop: true
        })
      })

      this.readyButton(this.socket)
    })

    this.input.keyboard?.on('keydown-UP', this.handleUp, this)
    this.input.keyboard?.on('keydown-DOWN', this.handleDown, this)
    this.input.keyboard?.on('keydown-LEFT', this.handleLeft, this)
    this.input.keyboard?.on('keydown-RIGHT', this.handleRight, this)
  }

  createSkill(team: Team, playerCoordinateX: number, playerCoordinateY: number) {
    const x = team === Team.Red ? playerCoordinateX + 30 : playerCoordinateX - 30
    const to = this.width - playerCoordinateX

    const flip = team === Team.Red ? false : true

    const skill = new Skill(this, x, playerCoordinateY + 6).setFlip(flip, false)
    this.characterGroup.add(skill)

    this.tweens.add({
      targets: skill,
      x: to,
      duration: 300,
      ease: 'Power1'
    })

    this.physics.add.overlap(skill, this.characterGroup, this.handleSkillOverlap, undefined, this)
  }

  private handleSkillOverlap(
    object1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    object2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    if (!(object1 instanceof Phaser.GameObjects.Sprite && object2 instanceof Phaser.GameObjects.Sprite)) return

    object1.destroy()
    const targetId = object2.getData('id')
    targetId === this.socket.id && this.socket.emit(EventTypes.BeingAttacked)
    this.events.emit(`hurt-${targetId}`)
  }

  createOwnPlayer(player) {
    const character = new Character(this, player.coordinate.x, player.coordinate.y, player.id, player.team)
    new Focus(this, player.coordinate.x - 1, player.coordinate.y - 40)

    this.informationGroup[player.id] = new Information(this, player.coordinate.x, player.coordinate.y - 21, player.id)

    this.characterGroup.add(character)
    this.players[player.id] = character
    this.team = player.team
    character.setData('id', player.id)
    character.setData('name', player.name)
    character.setData('team', player.team)
  }

  createOtherPlayer(player) {
    const character = new Character(this, player.coordinate.x, player.coordinate.y, player.id, player.team)

    this.informationGroup[player.id] = new Information(this, player.coordinate.x, player.coordinate.y - 21, player.id)
    this.characterGroup.add(character)
    this.players[player.id] = character
    character.setData('id', player.id)
    character.setData('name', player.name)
    character.setData('team', player.team)
  }

  updateCountdown(scene: Phaser.Scene) {
    countdownValue--
    countdownText.setText(countdownValue)

    if (countdownValue <= 0) {
      countdownText.destroy()
      countdownTimer.remove(false)
      this.canPlay = true
      this.challengeFactory = new ChallengeFactory(scene, createRandomChallenge(), this.socket.id)
    }
  }

  private readyButton(socket: Socket) {
    new Pannel(this, 200, 200, () => {
      socket.emit(EventTypes.PlayerReady)
    }).setScale(3, 3)

    // socket.emit(EventTypes.PlayerReady)
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
    this.canPlay && this.challengeFactory.emit(EventKeys.Press, InstructionKeys.Up)
  }

  private handleDown() {
    this.canPlay && this.challengeFactory.emit(EventKeys.Press, InstructionKeys.Down)
  }

  private handleLeft() {
    this.canPlay && this.challengeFactory.emit(EventKeys.Press, InstructionKeys.Left)
  }

  private handleRight() {
    this.canPlay && this.challengeFactory.emit(EventKeys.Press, InstructionKeys.Right)
  }

  update() {
    this.setCloudParallax()
    // this.fpsText.update()
    if (this.challengeFactory) {
      this.challengeFactory.preUpdate()
    }
  }
}
