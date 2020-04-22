import * as BABYLON from "babylonjs";
// C'est pas bon il faut faire un input par un ! 
export default class JumpInput implements BABYLON.ICameraInput<BABYLON.UniversalCamera> {

    constructor(private scene: BABYLON.Scene, public jumpHeight: number = 2) {}

    _keys: Array<Number> = [
        32,
    ];

    inJump: boolean = false;

    camera: BABYLON.UniversalCamera;
    getClassName() {
        return "JumpInput";
    }
    getSimpleName() {
        return "Jump Input";
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
        if (!this._keys.find((key: number) => evt.keyCode === key)) return;
        this.inJump = false;
        if (!noPreventDefault) {
            evt.preventDefault();
        }
    }

    _onKeyDown(evt: KeyboardEvent, noPreventDefault?: boolean) {
        if (!this._keys.find((key: number) => evt.keyCode === key)) return;
        if (this.inJump) return;
        this.inJump = true;
        // this._onJump();
        if (!noPreventDefault) {
            evt.preventDefault();
        }
    }

    renderLoop() {
        // if (this.inJump) {
        //     this.camera.position.y += 1;
        // }
    }

    _onJump() {
        this.camera.animations = [];
        const annimations = new BABYLON.Animation("jumpAnnimation", "position.y", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
		
		// Animation keys
		var keys = [];
		keys.push({ frame: 0, value: this.camera.position.y });
		keys.push({ frame: 10, value: this.camera.position.y + 8 });
		keys.push({ frame: 20, value: this.camera.position.y });
		annimations.setKeys(keys);
		
		var easingFunction = new BABYLON.CircleEase();
		easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
		annimations.setEasingFunction(easingFunction);
		
        this.camera.animations.push(annimations);
		this.scene.beginAnimation(this.camera, 0, 20, false);
    }
}
