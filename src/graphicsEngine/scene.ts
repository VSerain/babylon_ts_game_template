import * as BABYLON from "babylonjs";
import "babylonjs-loaders"

import GraphicsEngine from "./index";

export default class Scene extends BABYLON.Scene {
    constructor(private graphicsEngine: GraphicsEngine) {
        super(graphicsEngine.$engine);
        
        this.gravity = new BABYLON.Vector3(0, -9.81, 0);
        
        this.enablePhysics(this.gravity);
        this.collisionsEnabled = true;

        this.createScene();
    }

    private createScene() {
        const ground = BABYLON.GroundBuilder.CreateGround("ground", { width: 100, height: 100}, this);

        this.graphicsEngine.loadStructure({
            type: "ground-entity",
            mesh: ground
        });

        BABYLON.SceneLoader.Append("assets/glb/", "test3.glb", this, () => {
            this.createDefaultLight(true);
            this.meshes.forEach(mesh => {

                if (mesh.metadata && mesh.metadata.structure) return;

                let type = "default-entity";
                let data = {} as any;
                if (mesh.metadata && mesh.metadata.gltf && mesh.metadata.gltf.extras) {
                    data = mesh.metadata.gltf.extras;
                    if (data.hasOwnProperty("type")) {
                        type = data.type;
                    }
                }

                this.graphicsEngine.loadStructure({
                    type,
                    mesh,
                    data
                })
            });
        });
    }
}