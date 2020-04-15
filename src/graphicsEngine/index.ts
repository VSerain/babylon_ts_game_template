import * as BABYLON from "babylonjs";

import DefaultEngine from "../shared/defaultEngine"
import GameEngine from "../gameEngine/index"
import NetworkEngine from "../networkEngine/index"
import SoundEngine from "../soundEngine/index"

import { EntityUnserializeObject } from "../shared/entityInterface";

import Scene from "./scene";
import MainCamera from "./mainCamera";

export default class GraphicsEngine extends DefaultEngine {
    $scene: Scene;
    $canvas: HTMLCanvasElement;

    gameEngine: GameEngine;
    networkEngine: NetworkEngine;
    soundEngine: SoundEngine;

    camera: MainCamera;

    __init__(canvas: HTMLCanvasElement) {
        this.$canvas = canvas;
        this.$scene = new Scene(this);
        this.camera = new MainCamera(this, new BABYLON.Vector3(0, 10, 0),  new BABYLON.Vector3(0, 10, -5));
    }

    render() {
        this.$scene.render();
    }

    loadStructure(entityUnserializeObject: EntityUnserializeObject) {
        return this.gameEngine.loadStructure(entityUnserializeObject);
    }

}