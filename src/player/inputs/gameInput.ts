import eventManager from "app/shared/eventManager";

export default class GameInput implements BABYLON.ICameraInput<BABYLON.UniversalCamera> {
    camera: BABYLON.UniversalCamera;

    private keys = {
        interactive: [
            69
        ]
    }

    constructor() {
        eventManager.addMultiple(
            "player.input.interactive.on",
            "player.input.interactive.off"
        )
    }

    getClassName() {
        return "GameInput";
    }
    getSimpleName() {
        return "Game Input";
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

        if(!found) return;

        if (!noPreventDefault) {
            evt.preventDefault();
        }
    }

    renderLoop() {}

    private interactiveOn() {
        eventManager.call("player.input.interactive.on")
    }
    private interactiveOff() {
        eventManager.call("player.input.interactive.off")
    }
}