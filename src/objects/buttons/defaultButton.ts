import * as BABYLON from "babylonjs";

import Structure from "app/shared/structure";

import { MINIMAL_DIST_EVENT } from "app/objects/constants";
import eventManager from "app/shared/eventManager";

export const name = "default-button"

export default class DefaultButton extends Structure {
    eventActive: boolean = false;
    animationInPlay: boolean = false;

    /**
     * @param mesh Structrue mesh
     * @param data params of structure
     * @param data.name is the unique name of structrue
     * @param data.animation is the name of animation start on event interactive is up
     */
    constructor(mesh: BABYLON.Mesh, private data: any = {}) {
        super(mesh, data);
        this.require.playerController = true;
        this.require.sceneryController = true;
    }

    load() {
        // Manage callback
        eventManager.add(`interactive-object.${this.name}.startEvent`);

        eventManager.on("player.input.interactive.on", {}, () => {
            if (!this.eventActive || this.animationInPlay) return;
            this.startEvent();
        });
    }

    renderLoop() {
        const distanceToPlayer = BABYLON.Vector3.Distance(this.position, this.playerController.camera.position);
        this.eventActive = distanceToPlayer < MINIMAL_DIST_EVENT;
        if (this.eventActive && !this.animationInPlay) {
            eventManager.call("interactive-object.message.show");
        }
    }

    async startEvent() {
        eventManager.call(`interactive-object.${this.name}.startEvent`, [this]);

        // TODO: Implement GSAP / tweenmax

        let animation = null;
        // Find animation
        if (this.data.animation) {
            animation = this.mesh.animations.find(animation => animation.name === this.data.animation);
        }
        else if(this.mesh.animations.length > 0) {
            animation = this.mesh.animations[0];
        }

        if(!animation) {
            console.warn(`Not animation found in ${this.name}`);
            return;
        }

        const { minFrame, maxFrame } = animation.getKeys().reduce( (acc, key) => {
            if (key.frame > acc.maxFrame) acc.maxFrame = key.frame;
            if(key.frame < acc.minFrame) acc.minFrame = key.frame;
            return acc;
        }, { minFrame: Infinity, maxFrame: -Infinity })

        this.animationInPlay = true;

        const animatable = this.sceneryController.scene.beginAnimation(this.mesh, minFrame, maxFrame);

        await animatable.waitAsync();
        this.animationInPlay = false;
    }
}