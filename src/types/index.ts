import { Game } from "phaser"

enum PlayerState {
  Idle,
  Death,
  Hurt
}

export enum Team {
  Red,
  Blue
}

enum HealthyBarState {
  Normal,
  Warning
}

enum SkillState {
  Normal,
  Until
}

type Coordinate = {
  x: number
  y: number
}

export type Player = {
  id: string
  coordinate: Coordinate
  state: PlayerState
  healthyBarState: HealthyBarState
  healthy: number
  name: string
}
export type Players = {
  [id: string]: Phaser.GameObjects.Sprite;
}

export type InformationGroup = {
  [id: string]: Phaser.GameObjects.Container;
}