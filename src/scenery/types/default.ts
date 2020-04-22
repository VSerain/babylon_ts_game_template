import * as BABYLON from "babylonjs";

export const name = "default"

/**
 * Default class linked to mesh
 */
export default class Default {
    constructor(private mesh: BABYLON.AbstractMesh, data?: any){}
}