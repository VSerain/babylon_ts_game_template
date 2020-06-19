import * as BABYLON from "babylonjs"

export function debugRay(ray: BABYLON.Ray, scene: BABYLON.Scene, color: BABYLON.Color3 = BABYLON.Color3.Random()) {
    BABYLON.RayHelper.CreateAndShow(ray, scene, color);
}