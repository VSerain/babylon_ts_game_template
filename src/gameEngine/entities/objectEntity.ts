import * as BABYLON from "babylonjs";

import applyMixins from "../../shared/mixinHelpers";

import DefaultEntity from "./defaultEntity";

export default class ObjectEntity extends applyMixins(DefaultEntity, ["body"]) {
    static type: string = "object-entity"

    mass: number = 1;
    restitusion: number = 0.01;

    constructor(protected $mesh: BABYLON.Mesh, data?: any) {
        super($mesh);

        if (data) {
            this.mass = data.body_mass || this.mass;
            this.restitusion = data.body_restitusion || this.restitusion;
        }
    }
}