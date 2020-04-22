
export const name = "object-physics";

/**
 *  When mesh have type object-physics we spwan a new ObjectPhysics and we add collisons and body
 * 
 * if data have mass or restitution params, their is apply to the physics impositor
 */
export default class ObjectPhysics {
    constructor(private mesh: BABYLON.AbstractMesh, data: any = {}) {
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { 
                mass: data.mass || 1, 
                restitution: data.restitution || 0.9, 
                ignoreParent: true 
            }
        );
        this.mesh.checkCollisions = true;
    }
}