import * as Phaser from 'phaser'
import Button from '../button/Button'
import { EventKeys, InstructionKeys, TextureKeys } from '../../../constants'
import UpButton from '../button/Up'
import DownButton from '../button/Down'
import LeftButton from '../button/Left'
import RightButton from '../button/Right'

const challengeDestroyTime = 1000

const punishmentTime = 3000

export default class Challenge extends Phaser.GameObjects.Container {
  private challengeList: Button[] = new Array()
  private isWorking: boolean = true
  private lock: Phaser.GameObjects.Sprite
  private positionX: number
  public size: number

  constructor(scene: Phaser.Scene, challenges: number[]) {
    super(scene)

    let { cols, width } = this.getWidthDefault(challenges.length)

    const challengeX = (scene.scale.width - width) / 2 + 15
    const challengeY = scene.scale.height / 2 - 150

    this.setPosition(challengeX, challengeY)

    this.positionX = challengeX

    this.lock = this.scene.add.sprite(55, -50, TextureKeys.Lock)

    this.lock.setVisible(false)
    this.on('lock', flag => {
      this.lock.setVisible(flag)
    })
    this.scene.add.existing(this.lock)

    this.size = challenges.length

    challenges.map((key, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols

      switch (key) {
        case InstructionKeys.Up:
          this.challengeList.push(new UpButton(this.scene, col * 32, row * 32))

          break
        case InstructionKeys.Down:
          this.challengeList.push(new DownButton(this.scene, col * 32, row * 32))
          break
        case InstructionKeys.Left:
          this.challengeList.push(new LeftButton(this.scene, col * 32, row * 32))
          break
        case InstructionKeys.Right:
          this.challengeList.push(new RightButton(this.scene, col * 32, row * 32))
          break

        default:
          break
      }
    })
    this.add(this.challengeList)
    this.add(this.lock)

    this.on(EventKeys.Press, data => {
      if (!this.isWorking) {
        this.shake()
        return
      }

      if (this.challengeList.length > 0 && data === this.challengeList[0].key) {
        this.challengeList[0].remove()
        this.challengeList.shift()
        this.size -= 1

        if (this.size === 0) {
          setTimeout(() => {
            this.destroy()
          }, challengeDestroyTime)
        }
      } else {
        this.shake()
        this.isWorking = false
        this.emit('lock', true)

        setTimeout(() => {
          this.isWorking = true
          this.emit('lock', false)
        }, punishmentTime)
      }
    })
  }
  shake() {
    const amplitude = 5
    const frequency = 1
    const duration = 300
    let counter = 0

    this.scene.tweens.add({
      targets: this,
      duration: duration,
      ease: 'Sine.easeInOut',
      x: this.x - 5,
      yoyo: true,
      repeat: 0,
      onComplete: () => {
        this.x = this.positionX
      },
      onUpdate: () => {
        this.x = this.positionX + amplitude * Math.sin(frequency * counter)
        counter++
      }
    })
  }

  getWidthDefault(len: number) {
    const boxSize = 32

    switch (len) {
      case 5:
        return { cols: 5, width: boxSize * 5 }
      case 8:
        return { cols: 4, width: boxSize * 4 }
      case 10:
        return { cols: 5, width: boxSize * 5 }
      case 12:
        return { cols: 6, width: boxSize * 6 }
      default:
        return { cols: 5, width: boxSize * 5 }
    }
  }
}
