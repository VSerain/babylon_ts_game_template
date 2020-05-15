import * as BABYLON from "babylonjs";
import Structure from "app/shared/structure";

export const name = "object-physics";

/**
 *  When mesh have type object-physics we spwan a new ObjectPhysics and we add collisons and body
 * 
 * if data have mass or restitution params, their is apply to the physics impositor
 */
export default class ObjectPhysics extends Structure {
    constructor(protected mesh: BABYLON.Mesh, data: any = {}) {
        super(mesh, data);
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { 
                mass: data.mass || 100, 
                restitution: data.restitution || 0.9, 
                ignoreParent: true 
            }
        );
        this.mesh.checkCollisions = true;
    }
}