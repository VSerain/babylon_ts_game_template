import * as BABYLON from "babylonjs"
import eventManager from "app/shared/eventManager";
import FPSCamera from "app/player/fpsCamera";

export default class FpsInput implements BABYLON.ICameraInput<FPSCamera> {
    camera: FPSCamera;

    directition = {
        up: false,
        down: false,
        left: false,
        right: false,
        jump: false,
    }

    maxJumpY: number = 0;
    lastPositionY: number = 0;
    lastDirection: BABYLON.Vector3 = BABYLON.Vector3.Zero();

    private keys = { // TODO Parametrable keys
        interactive: [
            69
        ],
        jump: [
            32,
        ],
        up: [
            90,
            38
        ],
        down: [
            83,
            40
        ],
        left: [
            81,
            37
        ],
        right: [
            68,
            39
        ]
    }


    constructor() {
        eventManager.addMultiple(
            "player.input.interactive.on",
            "player.input.interactive.off"
        )
    }

    getClassName() {
        return "FpsInput";
    }
    getSimpleName() {
        return "Fps Input";
    }

    attachControl(element: HTMLElement, noPreventDefault?: boolean) {
        element.addEventListener("keyup", (evt: KeyboardEvent) => this._onKeyUp(evt, noPreventDefault))
        element.addEventListener("keydown", (evt: KeyboardEvent) => this._onKeyDown(evt, noPreventDefault))
    }

    detachControl(element: HTMLElement) {
        // Not works
        element.removeEventListener("keydown", this._onKeyDown);
        element.removeEventListener("keyup", this._onKeyUp);
    }

    _onKeyUp(evt: KeyboardEvent, noPreventDefault?: boolean) {
        let found = false;

        if (this.keys.interactive.includes(evt.keyCode)) {
            found = true;
            this.interactiveOff();
        }

        if (this.keys.up.includes(evt.keyCode)) {
            this.directition.up = false;
        }

        if (this.keys.down.includes(evt.keyCode)) {
            this.directition.down = false;
        }

        if (this.keys.left.includes(evt.keyCode)) {
            this.directition.left = false;
        }

        if (this.keys.right.includes(evt.keyCode)) {
            this.directition.right = false;
        }

        if (this.keys.jump.includes(evt.keyCode)) {
            this.directition.jump = false;
        }

        if(!found) return;

        if (!noPreventDefault) {
            evt.preventDefault();
        }
    }

    _onKeyDown(evt: KeyboardEvent, noPreventDefault?: boolean) {
        let found = false;
        if (this.keys.interactive.includes(evt.keyCode)) {
            found = true;
            this.interactiveOn();
        }

        if (this.keys.up.includes(evt.keyCode)) {
            this.directition.up = true;
        }

        if (this.keys.down.includes(evt.keyCode)) {
            this.directition.down = true;
        }

        if (this.keys.left.includes(evt.keyCode)) {
            this.directition.left = true;
        }

        if (this.keys.right.includes(evt.keyCode)) {
            this.directition.right = true;
        }

        if (this.keys.jump.includes(evt.keyCode)) {
            this.directition.jump = true;
        }

        if(!found) return;

        if (!noPreventDefault) {
            evt.preventDefault();
        }
    }

    checkInputs() {
        let forceUpdate = false;
        if (this.camera.isInJump) {
            if (this.camera.position.y > this.maxJumpY) {
                this.camera.fall();
                this.lastPositionY = this.camera.position.y;
                forceUpdate = true;
            }
            else {
                this.camera.cameraDirection = this.lastDirection.clone();
                return;
            }
        }

        if (this.camera.isInFall) {
            if (this.camera.position.y === this.lastPositionY && !forceUpdate) {
                this.camera.ground();
                forceUpdate = true;
            }
            else {
                this.lastPositionY = this.camera.position.y;
                this.camera.cameraDirection = this.lastDirection.subtractFromFloats(0, this.lastDirection.y, 0);
                return;
            }
        }

        if (this.directition.jump && !forceUpdate) {
            this.camera.jump();
            this.maxJumpY = this.camera.position.y + this.camera.jumpHeight;
        }
        const directionVector = this.computeDirectionVector();
        this.lastDirection = directionVector;
        this.camera.cameraDirection = directionVector.clone();
    }

    private computeDirectionVector(): BABYLON.Vector3 {
        const cameraVector3d = this.cameraDirectionVector;
        const vector2d = new BABYLON.Vector2(cameraVector3d.x, -cameraVector3d.z).normalize();
        const normal2d = new BABYLON.Vector2(-vector2d.y, vector2d.x);
        const speed = this.camera._computeLocalCameraSpeed();

        let direction2d = new BABYLON.Vector2();

        if (this.directition.up) direction2d.addInPlace(vector2d);
        if (this.directition.down) direction2d.subtractInPlace(vector2d);
        if (this.directition.right) direction2d.addInPlace(normal2d);
        if (this.directition.left) direction2d.subtractInPlace(normal2d);

        direction2d = direction2d.normalize();
        return new BABYLON.Vector3(direction2d.x, 0, -direction2d.y)
            .normalize()
            .scale(speed)
            .add(new BABYLON.Vector3(0, this.camera.isInJump ? this.camera.speed / 2 : 0, 0).scale(speed));
    }

    private interactiveOn() {
        eventManager.call("player.input.interactive.on")
    }
    private interactiveOff() {
        eventManager.call("player.input.interactive.off")
    }

    private get cameraDirectionVector() {
        return BABYLON.Ray.CreateNewFromTo(this.camera.position, this.camera.getTarget()).direction;
    }
}