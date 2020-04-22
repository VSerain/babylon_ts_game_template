import * as BABYLON from "babylonjs";

import PlayerController from "../player/index";
import SceneryController from "../scenery/index";
import ObjectsController from "../objects/index";
import EntitiesController from "../entities/index";

import { TypesLoader } from "./interfaces";

export default class Loader {
    private typesLoader: TypesLoader = {};
    public scene: BABYLON.Scene;

    public playerController: PlayerController;
    public sceneryController: SceneryController;
    public objectsController: ObjectsController;
    public entitiesController: EntitiesController;

    constructor(private engine: BABYLON.Engine, public canvas: HTMLCanvasElement) {}

    public addPlayerType(type: string) {
        this.addType("player", type);
    }
    public addSceneryType(type: string) {
        this.addType("scenery", type);
    }
    public addObjectsType(type: string) {
        this.addType("objects", type);
    }
    public addEnitiesType(type: string) {
        this.addType("entities", type);
    }

    private addType(controllerName: string, type: string) {
        this.typesLoader[type] = controllerName;
    }

    private loadMesh(type: string, mesh: BABYLON.AbstractMesh, data?: any) {
        if (!this.typesLoader[type]) return;
        switch(this.typesLoader[type]) {
            case "player":
                this.playerController.addMesh(type, mesh, data);
                break;
            case "scenery":
                this.sceneryController.addMesh(type, mesh, data);
                break;
            case "objects":
                this.objectsController.addMesh(type, mesh, data);
                break;
            case "entities":
                this.entitiesController.addMesh(type, mesh, data);
                break;
        }
    }

    loadScene() {
        this.scene = new BABYLON.Scene(this.engine);

        this.playerController.scene = this.scene;
        this.objectsController.scene = this.scene;
        this.sceneryController.scene = this.scene;
        this.entitiesController.scene = this.scene;

        const ground = BABYLON.GroundBuilder.CreateGround("ground", { width: 100, height: 100}, this.scene);

        this.loadMesh("ground", ground);

        BABYLON.SceneLoader.Append("assets/glb/", "test3.glb", this.scene, () => {
            this.scene.createDefaultLight();
            this.scene.meshes.forEach(mesh => {

                if (mesh.metadata && mesh.metadata.instance) return;

                let type = "default";
                let data = {} as any;
                if (mesh.metadata && mesh.metadata.gltf && mesh.metadata.gltf.extras) {
                    data = mesh.metadata.gltf.extras;
                    if (data.hasOwnProperty("type")) {
                        type = data.type;
                    }
                }

                this.loadMesh(type, mesh, data);
            });
        });
    }
}