import * as BABYLON from "babylonjs";
import Loader from "app/loader/index";
import { Touchable } from "app/entities/interfaces";
import FPSCamera from "app/player/fpsCamera";

import ObjectStructure from "./object-structure";
import BaseStructure from "./base-structure";

export function applyController(structure: BaseStructure, loader: Loader) {
    if (structure.require.playerController) {
        structure.playerController = loader.playerController;
    }
    if (structure.require.objectsController) {
        structure.objectsController = loader.objectsController;
    }
    if (structure.require.entitiesController) {
        structure.entitiesController = loader.entitiesController;
    }
    if (structure.require.sceneryController) {
        structure.sceneryController = loader.sceneryController;
    }
}

export function getStructureByNode(node: BABYLON.Node): BaseStructure | null{
    if (node.isDisposed()) return null;
    
    if (node.metadata && node.metadata.instance) return node.metadata.instance as BaseStructure;

    if (node.parent) return getStructureByNode(node.parent);

    return null;
}

export function getTouchableByMesh(mesh: BABYLON.AbstractMesh): Touchable | null {
    if (mesh.isDisposed()) return null;

    const structure = getStructureByNode(mesh); 
    if (structure && structure.isTouchable) return structure as any;

    if (mesh.name.startsWith("player")) {
        return mesh._scene.getCameraByName("player-camera") as FPSCamera;
    }

    return null;
}

export interface ObjectStructureConstructor {
    new(mesh: BABYLON.Mesh, data: any): ObjectStructure;
    (): ObjectStructure;
}