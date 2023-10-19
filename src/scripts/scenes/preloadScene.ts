import { SceneKeys, TextureKeys, TileKeys, TileMapKeys } from '../../constants'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.PreloadScene)
  }

  preload() {
    this.load.image(
      TileKeys.TreasureHuntersAdditionalSky,
      'assets/environments/maps/treasure-hunters/Background/Additional Sky.png'
    )
    this.load.image(
      TileKeys.TreasureHuntersBackground,
      'assets/environments/maps/treasure-hunters/Background/BG Image.png'
    )
    this.load.image(
      TileKeys.TreasureHuntersTerrain,
      'assets/environments/maps/treasure-hunters/Terrain/Terrain (32x32).png'
    )

    this.load.tilemapTiledJSON(TileMapKeys.TreatureHunters, 'assets/environments/maps/treasure-hunters/map.json')

    this.load.spritesheet(
      TextureKeys.WaterReflect,
      'assets/environments/maps/treasure-hunters/Background/water-reflect.png',
      { frameWidth: 170, frameHeight: 10 }
    )
    this.load.spritesheet(TextureKeys.UpButton, 'assets/button/up.png', {
      frameWidth: 34,
      frameHeight: 34
    })
    this.load.spritesheet(TextureKeys.DownButton, 'assets/button/down.png', {
      frameWidth: 34,
      frameHeight: 34
    })
    this.load.spritesheet(TextureKeys.LeftButton, 'assets/button/left.png', {
      frameWidth: 34,
      frameHeight: 34
    })
    this.load.spritesheet(TextureKeys.RightButton, 'assets/button/right.png', {
      frameWidth: 34,
      frameHeight: 34
    })

    this.load.atlas(TextureKeys.Character, 'assets/characters/Owlet/Owlet.png', 'assets/characters/Owlet/Owlet.json')

    this.load.atlas(TextureKeys.Skill, 'assets/skill/owlet-skill.png', 'assets/skill/owlet-skill.json')

    this.load.image(TextureKeys.BigClouds, 'assets/environments/maps/treasure-hunters/Background/Big Clouds.png')

    this.load.image(TextureKeys.HealthBar, 'assets/healthbar.png')

    this.load.image(TextureKeys.Line, 'assets/line.png')
  }

  create() {
    this.scene.start(SceneKeys.MainScene)

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
