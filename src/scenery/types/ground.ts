import * as BABYLON from "babylonjs";

export const name = "ground";

/**
 * When mesh have type ground we spwan a new Ground and we add collisons and body
 */
export default class Ground {
    constructor(private mesh: BABYLON.AbstractMesh, data?: any) {
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { 
                mass: 0, 
                restitution: 0.9,
                friction: 10,
                ignoreParent: true 
            }
        );
        this.mesh.checkCollisions = true;
    }
}