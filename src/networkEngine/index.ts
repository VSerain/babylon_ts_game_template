import DefaultEngine from "../shared/defaultEngine"

import GameEngine from "../gameEngine/index"
import GraphicsEngine from "../graphicsEngine/index"
import SoundEngine from "../soundEngine/index"

export default class NetworkEngine extends DefaultEngine {
    gameEngine: GameEngine;
    graphicsEngine: GraphicsEngine;
    soundEngine: SoundEngine;

    __init__() {}
}