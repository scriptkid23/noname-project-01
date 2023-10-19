import * as Phaser from 'phaser'
import { BodyType } from 'matter'
import { AnimationKeys, Team, TextureKeys } from '../../../constants'

export enum CharacterState {
  Idle,
  Death,
  Attack,
  Until,
  Hurt
}

export default class Character extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, id: string, team: Team) {
    super(scene, x, y, TextureKeys.Character)

    if (team === Team.Blue) {
      this.setFlip(true, false)
    }

    this.createAnimations()

    this.play(AnimationKeys.CharacterIdle)

    this.scene.events.on(`active-attacking-${id}`, () => {
      console.log('trigger event')
      this.play(AnimationKeys.CharacterAttack1)
    })

    this.scene.events.on(`hurt-${id}`, () => {
      this.play(AnimationKeys.CharacterHurt)
    })

    this.on('animationcomplete', (animation, frame) => {
      console.log(animation.key)
      switch (animation.key) {
        case AnimationKeys.CharacterAttack1:
          this.scene.events.emit(`skill`, { id: id, team: team, playerCoordinateX: this.x, playerCoordinateY: this.y })
          break

        default:
          break
      }

      this.play(AnimationKeys.CharacterIdle)
    })

    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(20, body.height);
    body.setOffset(team=== Team.Red ? body.offset.x - 10: body.offset.x + 10, body.offset.y);


    scene.add.existing(this)
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)
  }
  handleAnimationComplete(
    animation: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame,
    gameObject: Phaser.GameObjects.Sprite
  ) {
    if (animation.key === AnimationKeys.CharacterAttack1) {
      this.play(AnimationKeys.CharacterIdle)
      this.off('animationcomplete', this.handleAnimationComplete, this)
    }
    if (animation.key === AnimationKeys.CharacterHurt) {
      this.play(AnimationKeys.CharacterIdle)
      this.off('animationcomplete', this.handleAnimationComplete, this)
    }
  }

  private createAnimations() {
    this.anims.create({
      key: AnimationKeys.CharacterIdle,
      frames: this.anims.generateFrameNames(TextureKeys.Character, {
        start: 0,
        end: 3,
        prefix: 'Owlet_Monster_Idle_4-',
        suffix: '.png'
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: AnimationKeys.CharacterAttack1,
      frames: this.anims.generateFrameNames(TextureKeys.Character, {
        start: 0,
        end: 3,
        prefix: 'Owlet_Monster_Attack1_4-',
        suffix: '.png'
      }),
      frameRate: 10
    })

    this.anims.create({
      key: AnimationKeys.CharacterAttack2,
      frames: this.anims.generateFrameNames(TextureKeys.Character, {
        start: 0,
        end: 5,
        prefix: 'Owlet_Monster_Attack2_6-',
        suffix: '.png'
      }),
      frameRate: 10
    })

    this.anims.create({
      key: AnimationKeys.CharacterDeath,
      frames: this.anims.generateFrameNames(TextureKeys.Character, {
        start: 0,
        end: 7,
        prefix: 'Owlet_Monster_Death_8-',
        suffix: '.png'
      }),
      frameRate: 10
    })
    this.anims.create({
      key: AnimationKeys.CharacterHurt,
      frames: this.anims.generateFrameNames(TextureKeys.Character, {
        start: 0,
        end: 3,
        prefix: 'Owlet_Monster_Hurt_4-',
        suffix: '.png'
      }),
      frameRate: 10
    })
  }
}
