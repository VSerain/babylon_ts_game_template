import eventManager from "app/shared/eventManager";

export default class FpsInput implements BABYLON.ICameraInput<BABYLON.UniversalCamera> {
    camera: BABYLON.UniversalCamera;

    directition = {
        up: false,
        down: false,
        left: false,
        right: false,
        jump: false,
    }
    gravity: number = Math.sqrt(9.81);
    walkSpeed: number = 10000 / 60 / 60 / 100; // 10km/h in m/ms
    jumpImpulse: number = 5;
    inJump:boolean = false;

    lastYPosition: number = 0;

    private keys = {
        interactive: [
            69
        ],
        jump: [
            32,96
        ],
        up: [
            // 90,
            38
        ],
        down: [
            // 83,
            40
        ],
        left: [
            // 81,
            37
        ],
        right: [
            // 68,
            39
        ]
    }


    constructor() {
        console.log(this.jumpImpulse);
        eventManager.addMultiple(
            "player.input.interactive.on",
            "player.input.interactive.off"
        )

        eventManager.on("onPlayerCollide", {layer: 0}, (cbStop, mesh) => {
            // todo refacto
            if (mesh.name === "ground") {
                console.log("Slaut");
                this.inJump = false;
            }
        });
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

    renderLoop() {
        const body = this.camera.parent as BABYLON.Mesh;
        if (!body) return;

        const verticalVelocity = body.physicsImpostor?.getLinearVelocity()?.y as number;
        if (verticalVelocity < -0.1) return;
        
        if (this.inJump && body.position.y.toFixed(2) >= this.lastYPosition.toFixed(2)) {
            this.lastYPosition = body.position.y;
            return;
        }

        if (this.directition.jump) {
            this.jump();
            return;
        }

        console.log("move");

        const cameraVector3d = this.cameraDirectionVector;
        const vector2d = new BABYLON.Vector2(cameraVector3d.x, -cameraVector3d.z).normalize();
        const normal2d = new BABYLON.Vector2(-vector2d.y, vector2d.x);

        let direction2d = new BABYLON.Vector2();

        if (this.directition.up) direction2d.addInPlace(vector2d);
        if (this.directition.down) direction2d.subtractInPlace(vector2d);
        if (this.directition.right) direction2d.addInPlace(normal2d);
        if (this.directition.left) direction2d.subtractInPlace(normal2d);

        direction2d = direction2d.normalize().scale(this.computeSpeed());

        const velocityVector = new BABYLON.Vector3(direction2d.x,0 , -direction2d.y);
        body.physicsImpostor?.setLinearVelocity(BABYLON.Vector3.Zero());
        body.physicsImpostor?.setAngularVelocity(BABYLON.Vector3.Zero());
        body.moveWithCollisions(velocityVector);

        this.inJump = false;
    }

    jump() {
        const body = this.camera.parent as BABYLON.Mesh;
        this.lastYPosition = body.position.y;
        this.inJump = true;

        let impulseVector = new BABYLON.Vector3(0,this.jumpImpulse,0);

        if (this.directition.up) impulseVector.z -= 0.5;
        if (this.directition.down) impulseVector.z += 0.5;
        if (this.directition.right) impulseVector.x -= 0.5;
        if (this.directition.left) impulseVector.x += 0.5;

        // Apply camera rotation
        var quaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, this.camera.rotation.y);
        var matrix = new BABYLON.Matrix();
        quaternion.toRotationMatrix(matrix);
        const rotatedImpluseVector = BABYLON.Vector3.TransformCoordinates(impulseVector, matrix);

        body.physicsImpostor?.applyImpulse(rotatedImpluseVector, body.getAbsolutePosition());
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

    private computeSpeed() {
        return this.walkSpeed * this.getDeltaTime();
    }
    private getDeltaTime() {
        return this.camera.getScene().getEngine().getDeltaTime();
    }
}