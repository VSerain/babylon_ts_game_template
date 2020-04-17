import * as BABYLON from "babylonjs";
import mixins from "../mixins/index";
export default class DefaultEntity {
    static type: String = "default-entity";
    constructor(protected $mesh: BABYLON.Mesh, data? : any) {
        this.$mesh.metadata = this.$mesh.metadata || {};
        this.$mesh.metadata.structure = this;
    }

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

    public loadMixins() {
        const currentClass: any = this; // this is the hack for load mixin
        Object.keys(mixins).forEach((mixinName) => {
            if (this.hasOwnProperty(`${mixinName}Mixin`)) {
                currentClass[`${mixinName}Load`]();
            }
        });
    }

    protected callMethodMixin(methodName: string, args: Array<any> ) {
        const currentClass: any = this; // this is the hack for load mixin
        if (this.hasOwnProperty(methodName)) {
            return currentClass[methodName](...args);
        }

        throw new Error(`${methodName} is not found in ${this}`);
    }
}