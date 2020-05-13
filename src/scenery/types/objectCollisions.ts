import * as BABYLON from "babylonjs";
import Structure from "app/shared/structure";

export const name = "object-collisions";

export default class ObjectPhysics extends Structure {
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