import * as BABYLON from "babylonjs";

export default class DefaultEntity {
    static type: String = "default-entity";
    constructor(protected $mesh: BABYLON.Mesh) {}

    get name(): string {
        return this.$mesh.name;
    }

    get position(): BABYLON.Vector3 {
        return this.$mesh.position;
    }
    set position(newPosition: BABYLON.Vector3) {
        this.$mesh.position = newPosition;
    }

    get rotation(): BABYLON.Vector3 {
        return this.$mesh.rotation;
    } 
    set rotation(newRotation: BABYLON.Vector3) {
        this.$mesh.position = newRotation;
    }

    get scaling(): BABYLON.Vector3 {
        return this.$mesh.scaling;
    }
    set scaling(newScaling: BABYLON.Vector3) {
        this.$mesh.scaling = newScaling;
    }

    get worldMatrix(): BABYLON.Matrix {
        return this.$mesh.worldMatrixFromCache;
    }
}