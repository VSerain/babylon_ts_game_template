import * as BABYLON from "babylonjs"
import eventManager from "app/shared/eventManager";
import InputManager from "app/player/inputs/index";

export default class FPSCamera extends BABYLON.UniversalCamera {
    inputManager: InputManager;
    jumpHeight: number = 4;

    private _lastY: number = 0;

    constructor(name: string, position: BABYLON.Vector3, scene: BABYLON.Scene) {
        super(name, position, scene);
  
        this.speed = 5;
        this.angularSensibility = 5000; // TODO Make paramtrable by player
        this.ellipsoid = new BABYLON.Vector3(1, 1.75,1);
        this.setTarget(new BABYLON.Vector3(-0.8, -0.12, 0.83));
        this.rotation = new BABYLON.Vector3(0, -2 ,0);
        this.inputManager = new InputManager(this);
        
        this._enabledPhysics();
        this._attachCallback();
    }

    private _attachCallback() {
        eventManager.addMultiple("onPlayerCollide", "onPlayerCollideBottom", "onPlayerCollideTop");
        this.onCollide = (colidedMesh) => this._onColide(colidedMesh);
    }

    private _enabledPhysics() {
        this._lastY = this.position.y;
        this.checkCollisions = true;
        this.applyGravity = true;
        // _needMoveForGravity is private, but we whant set a true and in typescript is not posible ! Yes this is caca
        const self = this as any
        self._needMoveForGravity = true;
    }

    private _onColide(colidedMesh: BABYLON.AbstractMesh) {
        console.log(colidedMesh.metadata.instance);
        eventManager.call("onPlayerCollide", [colidedMesh]);
    }


    update() {
        super.update();

        if (this._lastY > this.position.y) {
            this.fall();
        }

        this._lastY = this.position.y
    }

    /**
     * -------------
     * | Jump Part |
     * -------------
     */

    isInJump: boolean = false;
    isInFall: boolean = false;
    isOnGround: boolean = true;

    fall() {
        this.isInJump = false;
        this.isOnGround = false;
        this.isInFall = true;
    }

    jump() {
        this.isInJump = true;
        this.isOnGround = false;
        this.isInFall = false;
    }

    ground() {
        this.isInJump = false;
        this.isOnGround = true;
        this.isInFall = false;
    }
}