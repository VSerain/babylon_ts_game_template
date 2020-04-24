import * as BABYLON from "babylonjs";

import PlayerController from "app/player/index";
import SceneryController from "app/scenery/index";
import ObjectsController from "app/objects/index";
import EntitiesController from "app/entities/index";

import eventManager from "app/shared/eventManager";

import { TypesLoader } from "./interfaces";

/**
 * The Loader class is used for load the scene 
 */
export default class Loader {
    private typesLoader: TypesLoader = {};
    public scene: BABYLON.Scene;

    public playerController: PlayerController;
    public sceneryController: SceneryController;
    public objectsController: ObjectsController;
    public entitiesController: EntitiesController;

    constructor(private engine: BABYLON.Engine, public canvas: HTMLCanvasElement) {
        eventManager.add("loader.sceneLoaded");
    }

    /**
     * Link mesh to the player structure
     * 
     * @param type is name of strucutre
     */
    public addPlayerType(type: string) {
        this.addType("player", type);
    }

    /**
     * Link mesh to the scenery addMesh Method
     * 
     * @param type is name of strucutre
     */
    public addSceneryType(type: string) {
        this.addType("scenery", type);
    }

    /**
     * Link mesh to the objects addMesh Method
     * 
     * @param type is name of strucutre
     */
    public addObjectsType(type: string) {
        this.addType("objects", type);
    }

    /**
     * Link mesh to the entities addMesh Method
     * 
     * @param type is name of strucutre
     */
    public addEnitiesType(type: string) {
        this.addType("entities", type);
    }

    /**
     * Link mesh to the controller addMesh Method
     * 
     * @param controllerName is the controller call when the mesh `type` is equals to `type` in params
     * @param type is name of strucutre
     */
    private addType(controllerName: string, type: string) {
        this.typesLoader[type] = controllerName;
    }

    /**
     * 
     * @param type is the mesh type
     * @param mesh
     * @param data optional data from describe the futur entity/structure 
     */
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

    /**
     * Is call from load the global scene
     */
    loadScene() {
        this.scene = new BABYLON.Scene(this.engine);

        this.playerController.scene = this.scene;
        this.objectsController.scene = this.scene;
        this.sceneryController.scene = this.scene;
        this.entitiesController.scene = this.scene;

        // remove me
        const s = BABYLON.SphereBuilder.CreateSphere("sphere", {}, this.scene);
        s.position.y = 2;
        s.position.z = 6;
        s.metadata = {
            gltf: {
                extras: {
                    type: "default-button"
                }
            }
        };

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

            eventManager.call("loader.sceneLoaded", []);
        });
    }
}