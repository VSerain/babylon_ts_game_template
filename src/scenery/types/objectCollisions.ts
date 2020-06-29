import * as BABYLON from "babylonjs";
import ObjectStructure from "app/shared/object-structure";

export const name = "object-collisions";

export default class ObjectPhysics extends ObjectStructure {
    constructor(protected mesh: BABYLON.Mesh, data: any = {}) {
        super(mesh, data);
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { 
                mass: 0, 
                restitution: data.restitution || 0.9, 
                ignoreParent: true 
            }
        );
        this.mesh.checkCollisions = true;
    }
}