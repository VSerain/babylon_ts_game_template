import * as BABYLON from "babylonjs";


export interface EntityUnserializeObject {
    mesh: BABYLON.Node
    type: string,
    data ?:  {[index: string]:any}
}