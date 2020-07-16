import * as BABYLON from "babylonjs";
import eventManager from "./eventManager";
import Loader from "app/loader/index";

interface AnimationData {
    name: string,
    target: any,
    animations: Array<BABYLON.Animation>,
    from: number,
    to: number,
    loop: boolean,
    speed: number
}

export default class AnimationsManger {
    private queue: Array<AnimationData> = [];
    private attachedAnimations: Array<AnimationData> = [];

    constructor(private loader: Loader) {}

    attachAnimation(name: string, target: any, animations: Array<BABYLON.Animation>, from: number, to: number, loop: boolean = false, speed: number = 1) {
        if (this.attachedAnimations.findIndex(animationData => animationData.name === name) !== -1) this.removeAnimation(name);

        this.attachedAnimations.push({name, target, animations, from , to, loop, speed});
    }

    removeAnimation(name: string) {
        const index = this.attachedAnimations.findIndex(animationData => animationData.name === name);
        if (index === -1) return;
        this.attachedAnimations.splice(index,1);
    }

    startAnimation(name: string) {
        const animationData = this.attachedAnimations.find(animationData => animationData.name === name);
        if (!animationData) return;
        eventManager.addMultiple(`${name}-animation-start`,`${name}-animation-end`);
        this.queue.push(animationData);
    }

    renderLoop() {

        this.queue.forEach(animationData => {
            eventManager.call(`${animationData.name}-animation-start`);
        });

        this.queue.forEach(animationData => {
            this.loader.scene.beginDirectAnimation(animationData.target, animationData.animations , animationData.from, animationData.to, animationData.loop, animationData.speed, () => {
                eventManager.call(`${animationData.name}-animation-end`);
            });
        });

        this.queue = [];
    }
}