
export const name = "object-collisions";

export default class ObjectPhysics {
    constructor(private mesh: BABYLON.AbstractMesh, data: any = {}) {
        this.mesh.checkCollisions = true;
    }
}