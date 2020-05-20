import * as BABYLON from "babylonjs";

import eventManager from "app/shared/eventManager";
import Structure from "app/shared/structure";

export const name = "default-weapon";

export const glb = "weapon.glb"

export default class DefaultWeapon extends Structure {
    weaponName: string = name;
    isAttached: boolean = false;
    entries: BABYLON.InstantiatedEntries;
    node: BABYLON.TransformNode;
    inFireAnimation: boolean = false;
    annimations: Array<any> = [];

    constructor() {
        super(new BABYLON.Mesh("tmpMesh"), {});
        this.require.playerController = true;
        this.require.entitiesController = true;
        this.require.sceneryController = true;
    }

    load() {
        eventManager.on("player.activeWeapon", {}, (cbStop, weapon) => {
            if (this.name !== weapon.name) return;
            this.attachToPlayer();
        });
        eventManager.on("player.unactiveWeapon", {}, (cbStop, weapon) => {
            if (this.name !== weapon.name) return;
            this.detachToPlayer();
        });

        eventManager.on("player.input.mouse.right.click", {}, () => {
            if (this.inFireAnimation || !this.isAttached) return;
            this.fire();
        });

        eventManager.on("player.move.status.changed", {}, (cbStop, status) => {
            if (status === "static") {
                this.sceneryController.scene.stopAnimation(this.node, "walk");
            }
            else if (status === "walk") {
                if (this.inFireAnimation) return;
                this.startAnimation("walk");
            }
        });


        this.playerController.addWeapon(this);
    }

    attachToPlayer() {
        this.isAttached = true;
        this.entries = this.entitiesController.store.getEntries(name);
        this.node = this.entries.rootNodes[0];
        this.node.parent = this.playerController.camera;
        this.node.position = new BABYLON.Vector3(0.7, -0.9 ,2.5);
        this.node.rotation = new BABYLON.Vector3(0, Math.PI / 2,0);
        
        // @TODO remove me
        this.node.scaling = new BABYLON.Vector3(0.2,0.2,0.2);

        this.computeAnimation(this.node);
    }

    detachToPlayer() {
        this.isAttached = false;
        this.node.animations = [];
        this.node.parent = null;
        this.node.dispose();
    }

    async fire() {
        this.inFireAnimation = true;
        await this.startAnimation("fire");
        this.inFireAnimation = false;
    }

    async startAnimation(animationName: String): Promise<boolean> {
        const animation = this.annimations.find(animationData => animationData.name === animationName);
        if (!animation) return false;
        const animatable = this.sceneryController.scene.beginAnimation(this.node, animation.start, animation.end, animation.loop, animation.speed);
    
        await animatable.waitAsync();
        return true;
    }

    computeAnimation(node: BABYLON.TransformNode) {
        const walkAnimation = new BABYLON.Animation("walk", "position.y", 4, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const walkKey = []; 

        walkKey.push(
            {
                frame: 0,
                value: node.position.y
            },
            {
                frame: 1,
                value: node.position.y + 0.008
            },
            {
                frame: 2,
                value: node.position.y + 0.02
            },
            {
                frame: 3,
                value: node.position.y
            }
        );
        walkAnimation.setKeys(walkKey);
        node.animations.push(walkAnimation);
        
        this.annimations.push({
            name: "walk",
            start: 0,
            end: 3,
            loop: true,
            speed: 1,
            animation: walkAnimation
        });

        const fireAnimation = new BABYLON.Animation("fire", "rotation.z", 3, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const fireKey = []; 

        fireKey.push(
            {
                frame: 10,
                value: node.rotation.z
            },
            {
                frame: 11,
                value: node.rotation.z - Math.PI / 8
            },
            {
                frame: 12,
                value: node.rotation.z
            }
        );
        fireAnimation.setKeys(fireKey);
        node.animations.push(fireAnimation);
        
        this.annimations.push({
            name: "fire",
            start: 10,
            end: 12,
            loop: false,
            speed: 3,
            animation: fireAnimation
        });
    }
}