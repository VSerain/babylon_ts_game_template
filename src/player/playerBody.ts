import * as BABYLON from "babylonjs"

export default class PlayerBody {

    constructor(private camera: BABYLON.FreeCamera) {
        this.camera.applyGravity = true;
        this.camera.checkCollisions = true;
        this.camera.ellipsoid = new BABYLON.Vector3(1, 1.75, 1);
        this.camera.position.y = 1.75
        this.camera.speed = 0.8;
        this.camera.angularSensibility = 3000;
    }
}