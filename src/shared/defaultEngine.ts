import * as BABYLON from "babylonjs";

export default class DefaultEngine {
    protected _gameEngine: DefaultEngine;
    protected _graphicsEngine: DefaultEngine;
    protected _networkEngine: DefaultEngine;
    protected _soundEngine: DefaultEngine;


    constructor(public $engine: BABYLON.Engine) {}

    attachGameEngine(gameEngine: DefaultEngine) {
        this._gameEngine = gameEngine;
    }

    attachGraphicsEngine(graphicsEngine: DefaultEngine) {
        this._graphicsEngine = graphicsEngine;
    }

    attachNetworkEngine(networkEngine: DefaultEngine) {
        this._networkEngine = networkEngine;
    }

    attachSoundEngine(soundEngine: DefaultEngine) {
        this._soundEngine = soundEngine;
    }

    render(): void {}

    protected get gameEngine(): DefaultEngine {
        return this._gameEngine;
    }

    protected get graphicsEngine(): DefaultEngine {
        return this._graphicsEngine;
    }

    protected get networkEngine(): DefaultEngine {
        return this._networkEngine;
    }

    protected get soundEngine(): DefaultEngine {
        return this._soundEngine;
    }
}