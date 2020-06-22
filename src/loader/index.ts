import * as BABYLON from "babylonjs";

import PlayerController from "app/player/index";
import SceneryController from "app/scenery/index";
import ObjectsController from "app/objects/index";
import EntitiesController from "app/entities/index";

import eventManager from "app/shared/eventManager";

import { IMPORT_GLB } from "app/config";

import { TypesLoader, ContainerQueue, ContainerQueueItem } from "./interfaces";

/**
 * The Loader class is used for load the scene 
 */
export default class Loader {
    private typesLoader: TypesLoader = {};
    private importContainerQueue: ContainerQueue = [];
    private mapLoaded: boolean = false;

    public scene: BABYLON.Scene;

    public playerController: PlayerController;
    public sceneryController: SceneryController;
    public objectsController: ObjectsController;
    public entitiesController: EntitiesController;

    constructor(private engine: BABYLON.Engine, public canvas: HTMLCanvasElement) {
        eventManager.addMultiple("loader.sceneLoaded", "loader.beforeImportMap");
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

        // this.__dev__spawnButton();
        this.__dev__spawnWeaponSpawner();
        this.__dev__spawnEnemiesSpawner();
        eventManager.call("loader.beforeImportMap");

        BABYLON.SceneLoader.Append(IMPORT_GLB.FOLDER_PATH, IMPORT_GLB.MAP_FILE_NAME, this.scene, () => {
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

            this._loadAllContainerQueue().then( () => {
                this.importContainerQueue = [];
                this.mapLoaded = true;
                eventManager.call("loader.sceneLoaded");
            });
        });
    }

    loadAssetsContainer(assetsFileName: string): Promise<BABYLON.AssetContainer> {
        return new Promise((resolve) => this._addToContainerQueue(assetsFileName, resolve));
    }

    private _loadAllContainerQueue(): Promise<any> {
        return Promise.all(
            this.importContainerQueue.map(
                item => new Promise(resolve => this._loadAssetsContainer(item, resolve))));
    }

    private _addToContainerQueue(assetsFileName: string, resolver: () => void) {
        const containerQueueItem = {
            file: assetsFileName,
            resolver
        } as ContainerQueueItem;

        if (!this.mapLoaded)  {
            this.importContainerQueue.push(containerQueueItem);
        }
        else {
            this._loadAssetsContainer(containerQueueItem, () => {});
        }
    }

    private _loadAssetsContainer(containerQueueItem: ContainerQueueItem, next: () => void) {
        BABYLON.SceneLoader.LoadAssetContainer(IMPORT_GLB.FOLDER_PATH, containerQueueItem.file, this.scene, (container) => {
            containerQueueItem.resolver(container)
            next();
        });
    }

    __dev__spawnButton() {
        const s = BABYLON.SphereBuilder.CreateSphere("sphere", {}, this.scene);
        s.position.y = 2;
        s.position.z = 6;
        s.metadata = {
            gltf: {
                extras: {
                    type: "default-button",
                    animation: "proute",
                    name: "first-button"
                }
            }
        };

        var anim = new BABYLON.Animation("proute", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys = []; 

        keys.push(
            {
                frame: 0,
                value: s.position.y
            },
            {
                frame: 50,
                value: s.position.y + 2
            },
            {
                frame: 100,
                value: s.position.y
            }
        );
        anim.setKeys(keys);
        s.animations.push(anim);
    }

    __dev__spawnWeaponSpawner() {
        const s = BABYLON.BoxBuilder.CreateBox("weapon", {}, this.scene);
        s.position = new BABYLON.Vector3(-10,1,-10);
        s.metadata = {
            gltf: {
                extras: {
                    type: "weapon-spawner",
                    weapon: "default-weapon"
                }
            }
        };

        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);

        myMaterial.diffuseColor = BABYLON.Color3.Red();
        myMaterial.specularColor = BABYLON.Color3.Red();
        myMaterial.emissiveColor = BABYLON.Color3.Red();
        myMaterial.ambientColor = BABYLON.Color3.Red();

        s.material = myMaterial;
    }

    __dev__spawnEnemiesSpawner() {
        const s = BABYLON.BoxBuilder.CreateBox("enemiesSpawner", {}, this.scene);
        s.position = new BABYLON.Vector3(10,1,10);
        s.metadata = {
            gltf: {
                extras: {
                    type: "enemies-spawner",
                    enemiesNames: "default-turret",
                    enemiesQuantity: 1,
                    delayBetweenSpawn: 3,
                }
            }
        };

        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);

        myMaterial.diffuseColor = BABYLON.Color3.Blue();
        myMaterial.specularColor = BABYLON.Color3.Blue();
        myMaterial.emissiveColor = BABYLON.Color3.Blue();
        myMaterial.ambientColor = BABYLON.Color3.Blue();

        s.material = myMaterial;
        s.material.alpha = 0.2;
    }
}