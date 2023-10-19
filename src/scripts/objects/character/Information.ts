
import * as Phaser from 'phaser'
import { TextureKeys } from '../../../constants';

export default class Information extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene, x:number, y: number){
        super(scene, x, y);

        const healthBar = scene.add.image(x, y, TextureKeys.HealthBar);

        this.add(healthBar)

        scene.add.existing(this);

    }
}