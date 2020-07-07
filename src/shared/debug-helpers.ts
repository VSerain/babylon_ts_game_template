import * as BABYLON from "babylonjs"

declare var game: any;

export function debugRay(ray: BABYLON.Ray, scene: BABYLON.Scene, color: BABYLON.Color3 = BABYLON.Color3.Random()) {
    BABYLON.RayHelper.CreateAndShow(ray, scene, color);
}


export function debugVector(point: BABYLON.Vector3, vector: BABYLON.Vector3, color: BABYLON.Color4 = BABYLON.Color3.Red().toColor4()) {
    const scene = game.scene;
    const points = [
        point,
        point.add(vector)
    ];

    const vectorLine = BABYLON.MeshBuilder.CreateLines("lines", {points: points, colors: [color, color]}, scene); 
    return {
        pointA: point.clone(),
        pointB: point.add(vector).clone(),
        mesh: vectorLine
    };
}