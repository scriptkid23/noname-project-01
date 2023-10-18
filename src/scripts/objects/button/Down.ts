import * as Phaser from "phaser";

import Button from "./Button";
import { InstructionKeys, TextureKeys } from "../../../constants";


export default class DownButton extends Button {
  public key = InstructionKeys.Down;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, TextureKeys.DownButton, x, y);
  }
}
