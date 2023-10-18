import * as Phaser from "phaser";
import { AnimationKeys, TextureKeys } from "../../constants";

export default class WaterReflect extends Phaser.GameObjects.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number
    ){
        super(scene, x, y,TextureKeys.WaterReflect);

        this.anims.create({
            key: AnimationKeys.WaterReflect,
            frames: this.anims.generateFrameNumbers(TextureKeys.WaterReflect, {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        })

        this.play(AnimationKeys.WaterReflect);

        this.scene.add.existing(this);
    }
}