import * as BABYLON from "babylonjs";

import FPSCamera from "./fpsCamera";

export default class Body {
    head: BABYLON.Mesh;
    handLeft: BABYLON.Mesh;
    handRight: BABYLON.Mesh;
    body: BABYLON.Mesh;
    legLeft: BABYLON.Mesh;
    legRight: BABYLON.Mesh;

    constructor(private camera: FPSCamera, private scene: BABYLON.Scene) {
        this._createHead();
        this._createHands();
        this._createBody();
        this._createLegs();
    }

    private _createHead() {
        this.head = BABYLON.SphereBuilder.CreateSphere("player.head", { diameterY: 0.40, diameterX : 0.20, diameterZ: 0.30 } , this.scene);
        this.head.parent = this.camera;
        this.head.material = this._getDebugMaterial();

        this.head.position = new BABYLON.Vector3( 0, 0, 0);

    }

    private _createHands() {
        this.handLeft = BABYLON.BoxBuilder.CreateBox("player.hand-left", { width: 0.1, depth: 0.1, height: 0.8 } , this.scene);
        this.handLeft.parent = this.camera;
        this.handLeft.material = this._getDebugMaterial();

        this.handRight = BABYLON.BoxBuilder.CreateBox("player.hand-Right", { width: 0.1, depth: 0.1, height: 0.8 } , this.scene);
        this.handRight.parent = this.camera;
        this.handRight.material = this._getDebugMaterial();

        this.handLeft.position = new BABYLON.Vector3( -0.3, -0.6,0);
        this.handRight.position = new BABYLON.Vector3( 0.3, -0.6,0);
        this.handRight.rotation = new BABYLON.Vector3(-Math.PI / 2, 0,0);
        console.log(this.handRight.rotation);
    }

    private _createBody() {
        this.body = BABYLON.BoxBuilder.CreateBox("player.body", { width: 0.4, depth: 0.2, height: 0.9 } , this.scene);
        this.body.parent = this.camera;
        this.body.material = this._getDebugMaterial();
        this.body.position = new BABYLON.Vector3(0, -0.6,0);
    }

    private _createLegs() {
        this.legLeft = BABYLON.BoxBuilder.CreateBox("player.leg-left", { width: 0.1, depth: 0.1, height: 0.8 } , this.scene);
        this.legLeft.parent = this.camera;
        this.legLeft.material = this._getDebugMaterial();

        this.legRight = BABYLON.BoxBuilder.CreateBox("player.leg-Right", { width: 0.1, depth: 0.1, height: 0.8 } , this.scene);
        this.legRight.parent = this.camera;
        this.legRight.material = this._getDebugMaterial();

        this.legLeft.position = new BABYLON.Vector3( 0.2, -1.6,0);
        this.legRight.position = new BABYLON.Vector3( -0.2, -1.6,0);
    }

    private _getDebugMaterial(){
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);

        myMaterial.diffuseColor = BABYLON.Color3.Red();
        myMaterial.specularColor = BABYLON.Color3.Black();
        myMaterial.emissiveColor = BABYLON.Color3.Blue();
        myMaterial.ambientColor = BABYLON.Color3.Gray();
        return myMaterial;
    }
}