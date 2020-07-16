import * as BABYLON from "babylonjs";
import BaseStructure from "./base-structure";

import { WeaponOwner, Touchable } from 'app/entities/interfaces';

export default class ObjectStructure extends BaseStructure implements Touchable {
    isTouchable = true;

    constructor(mesh: BABYLON.Mesh, data: any = {}) {
        super(data);
        this.mesh = mesh;
    }

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
        return this.$data.mesh as BABYLON.Mesh;
    }

    protected set mesh(mesh: BABYLON.Mesh) {
        this.$data.mesh = mesh;
        if (!this.mesh.metadata) this.mesh.metadata = {};
        this.mesh.metadata.instance = this;
    }
    protected get mesh() {
        return this.$data.mesh as BABYLON.Mesh;
    }

    wasTouched(by: BaseStructure, at: BABYLON.Mesh, pickInfo: BABYLON.PickingInfo, owner: WeaponOwner): boolean {
        return true;
    }

    dispose(){
        this.mesh.dispose();
    }
}