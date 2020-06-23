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

    private _mesh: BABYLON.Mesh;

    name: string = (new Date().getTime() + Math.random() * Math.random()).toString();

    constructor(mesh: BABYLON.Mesh, data: any = {}) {
        this.mesh = mesh;
        this.name = data.name || this.name;
 
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
        return this._mesh;
    }

    protected set mesh(mesh: BABYLON.Mesh) {
        this._mesh = mesh;
        if (!this.mesh.metadata) this.mesh.metadata = {};
        this.mesh.metadata.instance = this;
    }
    protected get mesh() {
        return this._mesh;
    }

    wasTouched(by: Structure, at: BABYLON.Mesh, pickInfo: BABYLON.PickingInfo, owner: WeaponOwner): boolean {
        return true;
    }

    toTouch(touchable: Touchable, pickInfo: BABYLON.PickingInfo) {

    }

    dispose(){
        this.mesh.dispose();
    }
}