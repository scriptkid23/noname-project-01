import { TextureKeys } from '../../constants'

export default class Focus extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, TextureKeys.Focus)

    this.scene.anims.create({
      key: 'active',
      frames: this.scene.anims.generateFrameNumbers(TextureKeys.Focus, {
        start: 0,
        end: 7
      }),
      frameRate: 10,
      repeat: -1
    })
    this.play('active')

    this.scene.add.existing(this)
  }
}
