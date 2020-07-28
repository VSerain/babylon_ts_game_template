import * as BABYLON from "babylonjs";

import eventManager from "app/shared/eventManager";
import ObjectCollisions from "app/scenery/types/objectCollisions";

export const name = "default-interactive";

export default class DefaultInteractive extends ObjectCollisions {
    private animationGroups: Array<BABYLON.AnimationGroup> = [];

    /**
     * @param mesh Structrue mesh
     * @param data params of structure
     * @param data.onEvent is the name of structrue trigger event
     * @param data.animation is the name of animation start on event
     */
    constructor(mesh: BABYLON.Mesh, data: any = {}) {
        super(mesh, data);
        this.require.sceneryController = true;
    }

    load() {
        this.animationGroups = this.sceneryController.scene.animationGroups.filter(animation => animation.targetedAnimations.length && animation.targetedAnimations[0].target === this.mesh);

        this.animationGroups.forEach(animationGroup => {
            animationGroup.stop();
        });

        eventManager.on(`interactive-object.${this.$data.onEvent}.startEvent`, {}, () => this.onEvent())
    }

    private onEvent() {
        let animation = null;
        // Find animation
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

        animation.start();
    }
}