import * as BABYLON from "babylonjs";
import GraphicsEngine from "./index";

export default class Scene extends BABYLON.Scene {
    constructor(private graphicsEngine: GraphicsEngine) {
        super(graphicsEngine.$engine);
        this.createScene();
    }

    private createScene() {
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this);
        
        BABYLON.GroundBuilder.CreateGround("defaultGround", { width: 200, height: 200 }, this);

        const boxMesh = BABYLON.BoxBuilder.CreateBox("block1", {width: 10, height: 20, depth: 10 }, this);

        this.graphicsEngine.loadStructure({type: "object-entity", mesh: boxMesh, data: {
            position: new BABYLON.Vector3(15, 1, -20),
        }});
    }
}