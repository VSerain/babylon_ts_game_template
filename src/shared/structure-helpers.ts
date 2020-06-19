import * as BABYLON from "babylonjs";
import Loader from "app/loader/index";
import Structrue from "./structure";
import Structure from "./structure";

export function applyController(structure: Structrue, loader: Loader) {
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
    if (mesh.metadata.instance) return mesh.metadata.instance as Structrue;

    if (mesh.parent && mesh.parent instanceof BABYLON.AbstractMesh) return getStructureByMesh(mesh.parent as BABYLON.AbstractMesh);

    return null;
}

export interface StructureConstructor {
    new(mesh: BABYLON.Mesh, data: any): Structure;
    (): Structure;
}