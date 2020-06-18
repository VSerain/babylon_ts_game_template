import * as BABYLON from "babylonjs";
import PlayerController from "app/player/index";
import ObjectsController from "app/objects/index";
import EntitiesController from "app/entities/index";
import SceneryController from "app/scenery/index";

import { WeaponOwner, Touchable } from 'app/entities/interfaces';
export default class Structure {
    require = {
        playerController: false,
        objectsController: false,
        entitiesController: false,
        sceneryController: false,
    }

    name: string = (new Date().getTime() + Math.random() * Math.random()).toString();

    constructor(protected mesh: BABYLON.Mesh, data: any = {}) {
        this.name = data.name || this.name;
        if (!this.mesh.metadata) this.mesh.metadata = {};
        this.mesh.metadata.instance = this;
    }

    load(){}
    renderLoop() {}

    playerController: PlayerController;
    objectsController: ObjectsController;
    entitiesController: EntitiesController;
    sceneryController: SceneryController;

    get position() {
        return this.mesh.position;
    }
    set position(position) {
        this.mesh.position = position;
    }

    get absolutePosition() {
        return this.mesh.getAbsolutePosition();
    }

    get rotation() {
        return this.mesh.rotation;
    }
    set rotation(rotation) {
        this.mesh.rotation = rotation;
    }

    get scaling() {
        return this.mesh.scaling;
    }
    set scaling(scaling) {
        this.mesh.scaling = scaling;
    }

    getMesh() {
        return this.mesh;
    }

    wasTouched(by: Structure, at: BABYLON.Mesh, pickInfo: BABYLON.PickingInfo, owner: WeaponOwner): boolean {
        console.log(by, owner);
        return true;
    }

    toTouch(touchable: Touchable, pickInfo: BABYLON.PickingInfo) {

    }
}