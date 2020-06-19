import * as BABYLON from "babylonjs";
import eventManager from "app/shared/eventManager";

import FPSCamera from "./fpsCamera";
import Structure from "app/shared/structure";

export default class Body {
    head: BABYLON.Mesh;
    handLeft: BABYLON.Mesh;
    handRight: BABYLON.Mesh;
    body: BABYLON.Mesh;
    legLeft: BABYLON.Mesh;
    legRight: BABYLON.Mesh;

    colidedMeshes: Array<BABYLON.Mesh> = [];
    structuresColided: Array<Structure> = [];

    defaultWeaponHandRotation: BABYLON.Vector3 = new BABYLON.Vector3(-Math.PI / 2, 0,0);

    constructor(private camera: FPSCamera, private scene: BABYLON.Scene) {
        this._createHead();
        this._createHands();
        this._createBody();
        this._createLegs();

        eventManager.addMultiple("player.body.colide", "player.body.structuresColided.add" , "player.body.structuresColided.remove");

        eventManager.on("player.activeWeapon", { layer: Infinity}, (cbStop, weapon) => {
            this._handUpAnimation();
        });
        eventManager.on("player.unactiveWeapon", {}, (cbStop, weapon) => {
            this.handRight.rotation = new BABYLON.Vector3();
        });

        eventManager.on("player.body.structuresColided.add", { layer: 1 }, (callbackStop, structure: Structure) => {
            this.structuresColided.push(structure);
            callbackStop();
        });

        eventManager.on("player.body.structuresColided.remove", { layer: 1 }, (callbackStop, structure: Structure) => {
            callbackStop();
            const index = this.structuresColided.findIndex(struct => struct === structure );
            if (index === -1) return;
            this.structuresColided.splice(index, 1);
        });
    }

    public checkColisions() {
        this.structuresColided.forEach(structure => {
            this.colidedMeshes.forEach(partOfBody => {
                if (partOfBody.intersectsMesh(structure.getMesh())) {
                    eventManager.call("player.body.colide", [partOfBody.name, partOfBody, structure]);
                }
            });
        });
    }

    private _createHead() {
        this.head = BABYLON.SphereBuilder.CreateSphere("player.head", { diameterY: 0.40, diameterX : 0.20, diameterZ: 0.30 } , this.scene);
        this.head.parent = this.camera;
        this.head.material = this._getDebugMaterial();

        this.head.position = new BABYLON.Vector3(0, 0, 0);

        this.colidedMeshes.push(this.head);

    }

    private _createHands() {
        this.handLeft = BABYLON.BoxBuilder.CreateBox("player.hand-left", { width: 0.1, depth: 0.1, height: 0.8 } , this.scene);
        this.handLeft.parent = this.camera;
        this.handLeft.setPivotPoint(new BABYLON.Vector3(0, 0.38, 0)); // set pivotPoint with shoulder
        this.handLeft.material = this._getDebugMaterial();

        this.handRight = BABYLON.BoxBuilder.CreateBox("player.hand-Right", { width: 0.1, depth: 0.1, height: 0.8 } , this.scene);
        this.handRight.parent = this.camera;
        this.handRight.setPivotPoint(new BABYLON.Vector3(0, 0.38, 0)); // set pivotPoint with shoulder
        this.handRight.material = this._getDebugMaterial();

        this.handLeft.position = new BABYLON.Vector3( -0.3, -0.6,0);
        this.handRight.position = new BABYLON.Vector3( 0.3, -0.6,0);

        this.colidedMeshes.push(this.handRight);
        this.colidedMeshes.push(this.handLeft);

    }

    private _createBody() {
        this.body = BABYLON.BoxBuilder.CreateBox("player.body", { width: 0.4, depth: 0.2, height: 0.9 } , this.scene);
        this.body.parent = this.camera;
        this.body.material = this._getDebugMaterial();
        this.body.position = new BABYLON.Vector3(0, -0.6,0);

        this.colidedMeshes.push(this.body);

    }

    private _createLegs() {
        this.legLeft = BABYLON.BoxBuilder.CreateBox("player.leg-left", { width: 0.1, depth: 0.1, height: 0.7 } , this.scene);
        this.legLeft.parent = this.camera;
        this.legLeft.material = this._getDebugMaterial();

        this.legRight = BABYLON.BoxBuilder.CreateBox("player.leg-Right", { width: 0.1, depth: 0.1, height: 0.7 } , this.scene);
        this.legRight.parent = this.camera;
        this.legRight.material = this._getDebugMaterial();

        this.legLeft.position = new BABYLON.Vector3( 0.1, -1.4,0);
        this.legRight.position = new BABYLON.Vector3( -0.1, -1.4,0);

        this.colidedMeshes.push(this.legRight);
        this.colidedMeshes.push(this.legLeft);
    }

    private _handUpAnimation() {
        const handUp = new BABYLON.Animation("handUp", "rotation.x", 2, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        handUp.setKeys([
            {
                frame: 0,
                value: this.handRight.rotation.x
            },
            {
                frame: 1,
                value: this.defaultWeaponHandRotation.x
            },
        ]);
        this.handRight.animations.push(handUp);
        this.scene.beginDirectAnimation(this.handRight, [handUp] , 0, 1);
    }

    private _getDebugMaterial(){
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);

        myMaterial.diffuseColor = BABYLON.Color3.Red();
        myMaterial.specularColor = BABYLON.Color3.Black();
        myMaterial.emissiveColor = BABYLON.Color3.Blue();
        myMaterial.ambientColor = BABYLON.Color3.Gray();
        // myMaterial.alpha = 0;
        return myMaterial;
    }
}