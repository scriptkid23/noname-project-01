import * as Phaser from 'phaser'
import { AnimationKeys, TextureKeys } from '../../constants'

export default class Pannel extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, callback: any) {
    super(scene, x, y)

    const pannel = this.scene.add.sprite(0, 0, TextureKeys.Pannel)
    const start = this.scene.add.sprite(0, 0, TextureKeys.Start)

    start.setInteractive()

    this.scene.anims.create({
      key: 'click',
      frames: this.scene.anims.generateFrameNumbers(TextureKeys.Start, {
        start: 0,
        end: 1
      }),
      frameRate: 15,
      repeat: 0
    })

    start.on('pointerdown', () => {
      start.play('click').on('animationcomplete', () => {
        callback()
        this.destroy()
      })
    })

    this.add([pannel, start])

    this.scene.add.existing(this)
  }
}
