import Loader from "app/loader/index";
import Structrue from "./structure";

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