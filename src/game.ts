import * as BABYLON from "babylonjs";

import { ENGINE_CONFIG } from "./config";

import GameEngine from "./gameEngine/index";
import GraphicsEngine from "./graphicsEngine/index";
import NetworkEngine from "./networkEngine/index";
import SoundEngine from "./soundEngine/index";
export default class Game {

    private _canvas: HTMLCanvasElement;
    private $engine: BABYLON.Engine;

    private _gameEngine: GameEngine;
    private _graphicsEngine: GraphicsEngine;
    private _networkEngine: NetworkEngine;
    private _soundEngine: SoundEngine;

    constructor(private _canvasId: string) {
        this._canvas = document.getElementById(this._canvasId) as HTMLCanvasElement;
        if (!this._canvas) throw new Error(`${this._canvasId} is not found in DOM`);

        this.$engine = new BABYLON.Engine(this._canvas, ENGINE_CONFIG.ANTIALIAS);

        this._gameEngine = new GameEngine(this.$engine);
        this._graphicsEngine = new GraphicsEngine(this.$engine);
        this._networkEngine = new NetworkEngine(this.$engine);
        this._soundEngine = new SoundEngine(this.$engine);

        this._gameEngine.attachGraphicsEngine(this._graphicsEngine);
        this._gameEngine.attachNetworkEngine(this._networkEngine);
        this._gameEngine.attachSoundEngine(this._soundEngine);

        this._graphicsEngine.attachGameEngine(this._gameEngine);
        this._graphicsEngine.attachNetworkEngine(this._networkEngine);
        this._graphicsEngine.attachSoundEngine(this._soundEngine);

        this._networkEngine.attachGameEngine(this._gameEngine);
        this._networkEngine.attachGraphicsEngine(this._graphicsEngine);
        this._networkEngine.attachSoundEngine(this._soundEngine);

        this._soundEngine.attachGameEngine(this._gameEngine);
        this._soundEngine.attachGraphicsEngine(this._graphicsEngine);
        this._soundEngine.attachNetworkEngine(this._networkEngine);

        this._graphicsEngine.__init__(this._canvas); // Init the babylon scene
        this._gameEngine.__init__();
        this._networkEngine.__init__();
        this._soundEngine.__init__();

        this.$engine.runRenderLoop(() => {
            this._networkEngine.render();
            this._gameEngine.render();
            this._soundEngine.render();
            this._graphicsEngine.render();
        });

        window.addEventListener('resize', () => {
            this.$engine.resize();
        });
    }
}