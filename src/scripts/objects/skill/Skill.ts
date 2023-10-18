import * as Phaser from 'phaser'
import { AnimationKeys, TextureKeys } from '../../../constants'

export default class Skill extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TextureKeys.Skill)

    this.createAnimations()
    this.play(AnimationKeys.SkillStart)

    scene.physics.add.existing(this)
    scene.add.existing(this)

    const skillBody = this.body as Phaser.Physics.Arcade.Body
    skillBody.setAllowGravity(false)
  }

  private createAnimations() {
    this.anims.create({
      key: AnimationKeys.SkillStart,
      frames: this.anims.generateFrameNames(TextureKeys.Skill, {
        start: 1,
        end: 30,
        suffix: '.png'
      }),
      frameRate: 25,
      repeat: -1
    })
    this.anims.create({
      key: AnimationKeys.SkillEnd,
      frames: this.anims.generateFrameNames(TextureKeys.Skill, {
        start: 31,
        end: 35,
        suffix: '.png'
      }),
      frameRate: 25
    })

    this.anims.create({
      key: AnimationKeys.UntilEnd,
      frames: this.anims.generateFrameNames(TextureKeys.Until, {
        start: 1,
        end: 70,
        zeroPad: 4,
        prefix: 'frame',
        suffix: '.png'
      }),
      frameRate: 25
    })
    this.anims.create({
      key: AnimationKeys.UntilStart,
      frames: this.anims.generateFrameNames(TextureKeys.Until, {
        start: 71,
        end: 74,
        prefix: 'frame',
        zeroPad: 4,
        suffix: '.png'
      }),
      frameRate: 25,
      repeat: -1
    })
  }
}
