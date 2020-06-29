import * as BABYLON from "babylonjs"
import * as structureHelpers from "app/shared/structure-helpers";

import { Weapon, Touchable, WeaponOwner } from "app/entities/interfaces";
import InputManager from "app/player/inputs/index";
import Body from "app/player/body";

import eventManager from "app/shared/eventManager";
import BaseStructure from "app/shared/base-structure";

export default class FPSCamera extends BABYLON.UniversalCamera implements Touchable, WeaponOwner {
    inputManager: InputManager;
    body: Body;
    jumpHeight: number = 4;
    life: number = 4;

    private _lastY: number = 0;
    private _lastStructureCollide: BaseStructure;
    weapons: Array<Weapon> = [];
    _currentWeapon: Weapon;

    isTouchable = true;

    constructor(name: string, position: BABYLON.Vector3, scene: BABYLON.Scene) {
        super(name, position, scene);
  
        this.speed = 5;
        this.angularSensibility = 5000; // TODO Make paramtrable by player
        this.minZ = 0.4;
        this.ellipsoid = new BABYLON.Vector3(1, 1.75,1);
        this.ellipsoidOffset.y = this.ellipsoid.y;
        this.setTarget(new BABYLON.Vector3(-0.8, -0.12, 0.83));
        this.rotation = new BABYLON.Vector3(0, -2 ,0);
        this.inputManager = new InputManager(this);
        this.body = new Body(this, scene);
        
        this._enabledPhysics();
        this._attachCallback();
    }

    private _attachCallback() {
        eventManager.addMultiple(
            "onPlayerCollide",
            "onPlayerCollideBottom",
            "onPlayerCollideTop",
            "onPlayerEveryCollide",
            "player.move.status.changed",
            "player.dead",
        );
        this.onCollide = (collidedMesh) => this._onCollide(collidedMesh);

        eventManager.on("player.input.mouse.right.click", {}, () => {
            if (!this.currentWeapon) return;
            this.currentWeapon.fire();
        });
    }

    private _enabledPhysics() {
        this._lastY = this.position.y;
        this.checkCollisions = true;
        this.applyGravity = true;
        // _needMoveForGravity is private, but we whant set a true and in typescript is not posible ! Yes this is caca
        const self = this as any
        self._needMoveForGravity = true;
    }

    private _onCollide(collidedMesh: BABYLON.AbstractMesh) {
        const structure = structureHelpers.getStructureByNode(collidedMesh);
        if (!structure || structure === this._lastStructureCollide) return;
        this._lastStructureCollide = structure;
        eventManager.call("onPlayerEveryCollide", [structure]);
        if (structure.position.y < this.position.y) {
            eventManager.call("onPlayerCollideBottom", [structure]);
        }
        else if (structure.position.y >= this.position.y + this.ellipsoid.y) {
            eventManager.call("onPlayerCollideTop", [structure]);
        }
        else {
            eventManager.call("onPlayerCollide", [structure]);
        }
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

    /**
     * -------------
     * | Move Part |
     * -------------
     */

    isStatic: boolean = true;
    isInWalk: boolean = false;

    switchToStatic() {
        if (this.isStatic) return;
        this.isInWalk = false;
        this.isStatic = true;
        eventManager.call("player.move.status.changed", ["static"]);
    }

    switchToWalk() {
        if (this.isInWalk) return;
        this.isInWalk = true;
        this.isStatic = false;
        eventManager.call("player.move.status.changed", ["walk"]);
    }

    /**
     * -------------
     * | Weapon Part |
     * -------------
     */

    get directionVector() {
        return this.getTarget().subtract(this.position).normalize();
    }

    get currentWeapon(): Weapon {
        return this._currentWeapon;
    }

    set currentWeapon(weapon: Weapon) {
        if (this.currentWeapon) this.currentWeapon.detachToParent();
        this._currentWeapon = weapon;
        this.currentWeapon.attachToParent(this.body.handRight, this);
        eventManager.call("player.activeWeapon", [weapon])
    }

    addWeapon(weapon: Weapon) {
        this.weapons.push(weapon);
        if (this.weapons.length === 1) this.currentWeapon = weapon;
    }

    wasTouched(by: BaseStructure, at: BABYLON.Mesh, pickInfo: BABYLON.PickingInfo, owner: WeaponOwner): boolean {
        console.log(`Player is touch at ${at.name} by ${owner.name}`);
        this.life--;
        if (this.life === 0) {
            this.dead();
        }
        return true;
    }

    toTouch(touchable: Touchable, pickInfo: BABYLON.PickingInfo) {
    }

    dead() {
        console.log("you'r dead");
        eventManager.call("player.dead");
        this.life = 4;
    }
}