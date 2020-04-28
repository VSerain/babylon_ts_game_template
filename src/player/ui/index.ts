import eventManager from "app/shared/eventManager";


export default class UI {
    constructor() {
        eventManager.on("interactive-object.message.show", { layer: 0}, (cbStop, message) => this.showInteractiveMessage(message));
    }

    showInteractiveMessage(message: string = "")  {
        if (message) {
            console.log(message);
        }
        else {
            console.log("Press key E for active object");
        }
    }
}