import * as BABYLON from "babylonjs";

import eventManager from "app/shared/eventManager";
import Structure from "app/shared/structure";
import DefaultBullet from "./defaultBullet";

export const name = "default-weapon";

export const glb = "weapon.glb"

export default class DefaultWeapon extends Structure {
    weaponName: string = name;
    isAttached: boolean = false;
    entries: BABYLON.InstantiatedEntries;
    node: BABYLON.TransformNode;
    inFireAnimation: boolean = false;
    bulletName: string = "default-bullet";
    animations: Array<any> = [];

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
        this.node.parent = this.playerController.camera.body.handRight;
        
        this.node.position = new BABYLON.Vector3(0, -0.6 , -0.1);
        this.node.rotation = new BABYLON.Vector3(0, Math.PI / 2,  Math.PI / 2);
        
        // @TODO remove me
        this.node.scaling = new BABYLON.Vector3(0.08,0.08,0.08);
        this.computeAnimation(this.node);
    }

    detachToPlayer() {
        this.isAttached = false;
        this.node.animations = [];
        this.node.parent = null;
        this.node.dispose();
    }

    async fire() {
        const bullet = this.entitiesController.createEntities("default-bullet") as DefaultBullet;
        const cameraRay = BABYLON.Ray.CreateNewFromTo(this.playerController.camera.position, this.playerController.camera.getTarget());
        bullet.parentDirection = cameraRay.direction;
        bullet.parentPosition = this.absolutePosition.clone().add(new BABYLON.Vector3(0,0.2,0));

        this.inFireAnimation = true;
        bullet.fire();
        await this.startAnimation("fire");
        this.inFireAnimation = false;
    }

    async startAnimation(animationName: String): Promise<boolean> {
        const animationData = this.animations.find(animationData => animationData.name === animationName);
        if (!animationData) return false;
        const animatable = this.sceneryController.scene.beginDirectAnimation(this.node, [animationData.animation] , animationData.start, animationData.end, animationData.loop, animationData.speed);
        await animatable.waitAsync();
        return true;
    }

    computeAnimation(node: BABYLON.TransformNode) {
        node.animations = [];
        const walkAnimation = new BABYLON.Animation("walk", "position.y", 4, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const walkKey = []; 

        walkKey.push(
            {
                frame: 20,
                value: node.position.y
            },
            {
                frame: 21,
                value: node.position.y + 0.004
            },
            {
                frame: 22,
                value: node.position.y + 0.008
            },
            {
                frame: 23,
                value: node.position.y
            }
        );
        walkAnimation.setKeys(walkKey);
        node.animations.push(walkAnimation);
        
        this.animations.push({
            name: "walk",
            start: 20,
            end: 23,
            loop: true,
            speed: 1,
            animation: walkAnimation
        });

        const fireAnimation = new BABYLON.Animation("fire", "rotation.z", 3, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        const fireKey = []; 

        fireKey.push(
            {
                frame: 10,
                value: node.rotation.z
            },
            {
                frame: 11,
                value: node.rotation.z - Math.PI / 12
            },
            {
                frame: 12,
                value: node.rotation.z
            }
        );
        fireAnimation.setKeys(fireKey);
        node.animations.push(fireAnimation);
        
        this.animations.push({
            name: "fire",
            start: 10,
            end: 12,
            loop: false,
            speed: 3,
            animation: fireAnimation
        });
    }

    get position() {
        return this.node.position;
    }
    set position(position) {
        this.node.position = position;
    }

    get absolutePosition() {
        return this.node.getAbsolutePosition();
    }

    get rotation() {
        return this.node.rotation;
    }
    set rotation(rotation) {
        this.node.rotation = rotation;
    }

    get scaling() {
        return this.node.scaling;
    }
    set scaling(scaling) {
        this.node.scaling = scaling;
    }
}