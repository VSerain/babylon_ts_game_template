import * as BABYLON from "babylonjs";

import BaseStucture from "./base-structure";
import { Touchable, WeaponOwner } from "app/entities/interfaces";


export default class EntityStructure extends BaseStucture implements Touchable {
    isTouchable = true;

    constructor(data?: any) {
        super({
            ... data,
            node: new BABYLON.TransformNode(`tmpNode`)
        });
    }

    get position() {
        return this.node.position;
    }
    set position(position) {
        this.node.position = position;
    }

    get absolutePosition() {
        return this.node.getAbsolutePosition();
    }

    get rotation() {
        return this.node.rotation;
    }
    set rotation(rotation) {
        this.node.rotation = rotation;
    }

    get scaling() {
        return this.node.scaling;
    }
    set scaling(scaling) {
        this.node.scaling = scaling;
    }

    getNode() {
        return this.node;
    }

    protected set node(node: BABYLON.TransformNode) {
        if (this.node) this.node.dispose();

        this.$data.node = node;
        if (!this.node.metadata) this.node.metadata = {};
        this.node.metadata.instance = this;
    }
    protected get node(): BABYLON.TransformNode {
        return this.$data.node as BABYLON.TransformNode;
    }

    wasTouched(by: BaseStucture, at: BABYLON.Mesh, pickInfo: BABYLON.PickingInfo, owner: WeaponOwner): boolean {
        return true;
    }

    dispose(){
        this.node.dispose();
    }
}