import * as BABYLON from "babylonjs";

import BaseStructure from "app/shared/object-structure";

import { MINIMAL_DIST_EVENT } from "app/objects/constants";
import eventManager from "app/shared/eventManager";

export const name = "default-button"

export default class DefaultButton extends BaseStructure {
    eventActive: boolean = false;
    animationInPlay: boolean = false;

    animationGroups: Array<BABYLON.AnimationGroup> = [];

    /**
     * @param mesh Structrue mesh
     * @param data params of structure
     * @param data.name is the unique name of structrue
     * @param data.animation is the name of animation start on event interactive is up
     * @param data.multiple (optional) interaction number posibility
     */
    constructor(mesh: BABYLON.Mesh, data: any = {}) {
        super(mesh, {
            multiple: 1,
            ...data
        });
        this.require.playerController = true;
        this.require.sceneryController = true;
    }

    load() {
        this.animationGroups = this.sceneryController.scene.animationGroups.filter(animation => animation.targetedAnimations.length && animation.targetedAnimations[0].target === this.mesh);

        this.animationGroups.forEach(animationGroup => {
            animationGroup.stop();
        });
        // Manage callback
        eventManager.add(`interactive-object.${this.name}.startEvent`);

        eventManager.on("player.input.interactive.on", {}, () => {
            if (!this.eventActive || this.animationInPlay) return;
            this.$data.multiple--;
            this.startEvent();
        });
    }

    renderLoop() {
        const distanceToPlayer = BABYLON.Vector3.Distance(this.position, this.playerController.camera.position);
        this.eventActive = distanceToPlayer < MINIMAL_DIST_EVENT && this.$data.multiple > 0;
        if (this.eventActive && !this.animationInPlay) {
            eventManager.call("interactive-object.message.show");
        }
    }

    async startEvent() {
        eventManager.call(`interactive-object.${this.name}.startEvent`, [this]);

        let animation = null;
        // Find animation
        console.log(this.$data.animation);
        if (this.$data.animation) {
            animation = this.animationGroups.find(animation => animation.name === this.$data.animation);
        }
        else if(this.animationGroups.length > 0) {
            animation = this.animationGroups[0];
        }

        if(!animation) {
            console.warn(`Not animation found in ${this.name}`);
            return;
        }

        this.animationInPlay = true;
        animation.onAnimationEndObservable.add(() => this.animationInPlay = false);
        animation.start();
    }
}