import * as BABYLON from "babylonjs";
import GraphicsEngine from "./index";

export default class MainCamera extends BABYLON.FreeCamera {
    constructor(private graphicsEngine: GraphicsEngine, position: BABYLON.Vector3, target: BABYLON.Vector3 = BABYLON.Vector3.Zero()) {
        super("mainCamera", position, graphicsEngine.$scene);

        this.setTarget(target);
        this.attachControl(this.graphicsEngine.$canvas, false);
    }
}