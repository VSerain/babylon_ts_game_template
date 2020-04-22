import * as BABYLON from "babylonjs";

export const name = "ground";

export default class Ground {
    constructor(private mesh: BABYLON.AbstractMesh, data?: any) {
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { 
                mass: 0, 
                restitution: 0.9, 
                ignoreParent: true 
            }
        );
        this.mesh.checkCollisions = true;
    }
}