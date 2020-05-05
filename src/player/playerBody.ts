import * as BABYLON from "babylonjs"

import eventManager from "app/shared/eventManager";

/**
 * PlayerBody manage the camera Gravity and Colistion
 */
export default class PlayerBody {
    root: BABYLON.Mesh;
    constructor(private camera: BABYLON.UniversalCamera) {

        this.root = BABYLON.CylinderBuilder.CreateCylinder("player-body", { 
            height: 1.7,
            diameterBottom: 2,
            diameterTop: 0.5
        }, this.camera.getScene());

        this.root.rotation = BABYLON.Vector3.ZeroReadOnly.clone();
        this.root.position = this.camera.position.clone();
        this.camera.position = new BABYLON.Vector3(0, 0, 0);
        this.camera.parent = this.root;
        this.root.checkCollisions = true;
        this.root.physicsImpostor = new BABYLON.PhysicsImpostor(this.root, BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 2,
            friction: 5,
            restitution: 0.001,
        });

        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.camera.getScene());

        myMaterial.diffuseColor = BABYLON.Color3.Red();
        myMaterial.specularColor = BABYLON.Color3.Red();
        myMaterial.emissiveColor = BABYLON.Color3.Red();
        myMaterial.ambientColor = BABYLON.Color3.Red();

        this.root.material = myMaterial;
        this.root.setPivotPoint(new BABYLON.Vector3(0, 1.7, 0));

        this.camera.setTarget(new BABYLON.Vector3(0,0,1));

        this.initCollistionCallback();
    }

    initCollistionCallback() {
        eventManager.addMultiple("onPlayerCollide", "onPlayerCollideBottom", "onPlayerCollideTop");
        this.root.onCollide = () => {
            // TODO check good collide
            eventManager.call("onPlayerCollide", [this.root.collider?.collidedMesh]);
        }
    }

    get position() {
        return this.root.position;
    }
    set position(position) {
        this.root.position = position;
    }
}