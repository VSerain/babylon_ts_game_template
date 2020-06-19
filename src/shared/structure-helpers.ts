import * as BABYLON from "babylonjs";
import Loader from "app/loader/index";
import Structure from "./structure";
import { Touchable } from "app/entities/interfaces";
import FPSCamera from "app/player/fpsCamera";

export function applyController(structure: Structure, loader: Loader) {
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

export function getStructureByMesh(mesh: BABYLON.AbstractMesh): Structure | null {
    if (mesh.metadata && mesh.metadata.instance) return mesh.metadata.instance as Structure;

    if (mesh.parent && mesh.parent instanceof BABYLON.AbstractMesh) return getStructureByMesh(mesh.parent as BABYLON.AbstractMesh);

    return null;
}

export function getTouchableByMesh(mesh: BABYLON.AbstractMesh): Touchable | null {
    const structure = getStructureByMesh(mesh); 
    if (structure) return structure;

    if (mesh.name.startsWith("player")) {
        return mesh._scene.getCameraByName("player-camera") as FPSCamera;
    }

    return null;
}

export interface StructureConstructor {
    new(mesh: BABYLON.Mesh, data: any): Structure;
    (): Structure;
}