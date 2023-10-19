import * as Phaser from 'phaser'
import { TextureKeys } from '../../../constants'

export default class Information extends Phaser.GameObjects.Container {
  private line: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    super(scene, x, y)

    const healthBar = scene.add.image(0, 0, TextureKeys.HealthBar)

    healthBar.setScale(0.8)

    this.line = scene.add.image(-12, -2, TextureKeys.Line).setOrigin(0, 0)
    this.line.setScale(0.8)

    // Đặt màu đỏ cho thanh máu
    this.add(healthBar)
    this.add(this.line)

    this.scene.events.on(`health-${id}`, health => {
      console.log(health)
      this.setHealth(health)
    })
    scene.add.existing(this)
  }
  setHealth(health: number) {
    const newWidth = (health / 100) * this.line.width * 0.8

    this.scene.tweens.add({
      targets: this.line,
      scaleX: newWidth / this.line.width,
      duration: 200,
      ease: Phaser.Math.Easing.Linear
    })
  }
}
