export default function (Base: any) {
    return class extends Base {
        $mesh: BABYLON.Mesh;
        bodyMixin: boolean = true;

        mass:number = 1;
        restitusion: number = 0.9;
        physicsIgnoreParent: boolean = true;

        bodyLoad() {
            this.physicsImpostor = new BABYLON.PhysicsImpostor(
                this.$mesh, 
                BABYLON.PhysicsImpostor.BoxImpostor, 
                { mass: this.mass, restitution: this.restitusion, ignoreParent: this.physicsIgnoreParent }
            );

            this.$mesh.checkCollisions = true;
        }

        get physicsImpostor() {
            return this.$mesh.physicsImpostor as BABYLON.PhysicsImpostor;
        }
        set physicsImpostor(physicsImpostor: BABYLON.PhysicsImpostor) {
            this.$mesh.physicsImpostor = physicsImpostor;
        }

    };
}