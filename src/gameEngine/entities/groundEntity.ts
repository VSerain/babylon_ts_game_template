import DefaultEntity from "./defaultEntity";
import applyMixins from "../../shared/mixinHelpers";


export default class GroundEntity extends applyMixins(DefaultEntity, ["body"]) {
    static type: string = "ground-entity"
    mass = 0;
}