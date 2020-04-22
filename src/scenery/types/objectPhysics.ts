
export const name = "object-physics";

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