import * as BABYLON from "babylonjs";

import PlayerController from "app/player/index";
import ObjectsController from "app/objects/index";
import EntitiesController from "app/entities/index";
import SceneryController from "app/scenery/index";

export default class BaseStucture {

    name: string = (new Date().getTime() + Math.random() * Math.random()).toString();

    $data = {
        position: new BABYLON.Vector3(),
        rotation: new BABYLON.Vector3(),
        scaling: new BABYLON.Vector3(),
    } as any;

    require = {
        playerController: false,
        objectsController: false,
        entitiesController: false,
        sceneryController: false,
    }

    isTouchable: boolean = false;

    constructor(data: any) {
        this.$data = {
            ...this.$data,
            ...data
        };
        this.name = data.name || this.name;
    }

    load(){}
    renderLoop() {}

    playerController: PlayerController;
    objectsController: ObjectsController;
    entitiesController: EntitiesController;
    sceneryController: SceneryController;

    get position() {
        return this.$data.position;
    }
    set position(position: BABYLON.Vector3) {
        this.$data.position = position;
    }

    get rotation() {
        return this.$data.rotation;
    }
    set rotation(rotation: BABYLON.Vector3) {
        this.$data.rotation = rotation;
    }

    get scaling() {
        return this.$data.scaling;
    }
    set scaling(scaling: BABYLON.Vector3) {
        this.$data.scaling = scaling;
    }

    dispose() {}
}