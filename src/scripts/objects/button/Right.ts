import * as Phaser from "phaser";

import Button from "./Button";
import { InstructionKeys, TextureKeys } from "../../../constants";


export default class RightButton extends Button {
  public key = InstructionKeys.Right;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, TextureKeys.RightButton, x, y);
  }
}
