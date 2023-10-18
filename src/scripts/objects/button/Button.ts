import * as Phaser from "phaser";
import { AnimationKeys } from "../../../constants";

export interface AnimationInterface {
  remove(): void;
}
export default class Button
  extends Phaser.GameObjects.Sprite
  implements AnimationInterface
{
  public key;
  constructor(
    scene: Phaser.Scene,
    texture: string | Phaser.Textures.Texture,
    x: number,
    y: number
  ) {
    super(scene, x, y, texture);

    this.anims.create({
      key: AnimationKeys.DestroyButton,
      frames: this.anims.generateFrameNumbers(texture as string, {
        start: 0,
        end: 6,
      }),
      frameRate: 15,
      repeat: 0,
    });
    this.on(
      "animationcomplete",
      () => {
        this.destroy();
      },
      this
    );
  }

  remove() {
    this.play(AnimationKeys.DestroyButton);
  }
}
