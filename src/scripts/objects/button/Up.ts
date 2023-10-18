import * as Phaser from "phaser";

import Button from "./Button";
import { InstructionKeys, TextureKeys } from "../../../constants";


export default class UpButton extends Button {
  public key = InstructionKeys.Up;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, TextureKeys.UpButton, x, y);
  }
}
