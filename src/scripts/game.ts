import Phaser from 'phaser';
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

const DEFAULT_WIDTH = 400
const DEFAULT_HEIGHT = 640

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  pixelArt: true,
  scale: {
    parent: 'phaser-game',
    mode: Phaser.AUTO,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: { y: 200}
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
