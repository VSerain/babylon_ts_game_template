import DefaultEngine from "../shared/defaultEngine"

import GameEngine from "../gameEngine/index"
import GraphicsEngine from "../graphicsEngine/index"
import NetworkEngine from "../networkEngine/index"

export default class SoundEngine extends DefaultEngine {
    gameEngine: GameEngine;
    graphicsEngine: GraphicsEngine;
    networkEngine: NetworkEngine;

    __init__() {}
}