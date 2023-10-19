export enum EventTypes {
  CurrentlyAttacking = 'CURRENTLY_ATTACKING',
  ActivateCurrentlyAttacking = 'ACTIVATE_CURRENTLY_ATTACKING',
  BeingAttacked = 'BEING_ATTACKED',
  ActivateBeingAttacked = 'ACTIVATE_BEING_ATTACKED',
  JoinRoom = 'JOIN_ROOM',
  LeaveRoom = 'LEAVE_ROOM',
  FetchPlayers = 'FETCH_PLAYERS',
  PlayerJoined = 'PLAYER_JOINED', //
  PlayerLeft = 'PLAYER_LEFF',
  PlayerReady = 'PLAYER_READY',
  CanPlay = 'CAN_PLAY',
  InitSkill = 'INIT_SKILL',
  SkillFrom = 'SKILL_FROM',
  Loser = "LOSER",
}

export enum TextureKeys {
  WaterReflect = 'Water Reflect',
  BigClouds = 'Big Cloud',
  Character = 'Character',
  UpButton = 'Top Button',
  DownButton = 'Down Button',
  LeftButton = 'Left Button',
  RightButton = 'Right Button',
  Skill = 'Skill',
  Until = 'Until',
  HealthBar = "HeathBar",
  Line = "Line"
  
}

export enum AnimationKeys {
  WaterReflect = 'water-reflect',

  CharacterHurt = 'character-hurt',
  CharacterIdle = 'character-idle',
  CharacterAttack1 = 'character-attack-1',
  CharacterAttack2 = 'character-attack-2',
  CharacterDeath = 'character-death',
  DestroyButton = 'destroy-button',
  SkillStart = 'skill-start',
  SkillEnd = 'skill-end',

  UntilStart = 'until-start',
  UntilEnd = 'until-end'
}

export enum TileKeys {
  TreasureHuntersAdditionalSky = 'Tresure Hunters Additional Sky',
  TreasureHuntersBackground = 'Tresure Hunters Background',
  TreasureHuntersTerrain = 'Tresure Hunters Terrain'
}

export enum TileLayerName {
  Beach = 'Beach',
  Ground = 'Ground',
  Background = 'Background'
}
export type TileLayerKeysType = {
  layer: string
  tilesets: string
}

export const TileLayerKeys: TileLayerKeysType[] = [
  {
    layer: TileLayerName.Background,
    tilesets: TileKeys.TreasureHuntersAdditionalSky
  },
  {
    layer: TileLayerName.Ground,
    tilesets: TileKeys.TreasureHuntersTerrain
  },
  {
    layer: TileLayerName.Beach,
    tilesets: TileKeys.TreasureHuntersBackground
  }
]

export enum TileMapKeys {
  TreatureHunters = 'Treasure Hunters'
}

export enum SceneKeys {
  MainScene = 'MainScene',
  PreloadScene = 'PreloadScene'
}

export enum Team {
  Red,
  Blue
}

export enum InstructionKeys {
  Up = 1,
  Right = 2,
  Down = 3,
  Left = 4
}

export enum EventKeys {
  Press = 'press'
}
