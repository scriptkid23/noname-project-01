import * as Phaser from "phaser";
import Button from "./Button";
import { InstructionKeys, TextureKeys } from "../../../constants";

export default class LeftButton extends Button {
  public key = InstructionKeys.Left;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, TextureKeys.LeftButton, x, y);
  }
}
