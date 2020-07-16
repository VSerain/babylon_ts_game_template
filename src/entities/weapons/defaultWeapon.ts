import * as BABYLON from "babylonjs";

import EntityStructure from "app/shared/entity-structure";

import DefaultBullet from "./defaultBullet";
import { WeaponOwner } from 'app/entities/interfaces';

export const name = "default-weapon";

export const glb = "weapon.glb"

export default class DefaultWeapon extends EntityStructure {
    weaponName: string = name;
    bulletName: string = "default-bullet";

    entries: BABYLON.InstantiatedEntries;

    owner: WeaponOwner;
    parentNode: BABYLON.TransformNode;
    isAttached: boolean = false;

    animations: Array<any> = [];
    groupAnimation: BABYLON.AnimationGroup;
    currentAnimatable: BABYLON.Animatable;

    constructor() {
        super();
        this.require.playerController = true;
        this.require.entitiesController = true;
        this.require.sceneryController = true;
    }

    attachToParent(parentNode: BABYLON.TransformNode, owner: WeaponOwner) {
        this.isAttached = true;
        this.entries = this.entitiesController.store.getEntries(name, name);
        this.node = this.entries.rootNodes[0];
        this.parentNode = parentNode;
        this.owner = owner;

        // @TODO remove me
        this.computeAnimation(this.node);
    }

    detachToParent() {
        this.isAttached = false;
        this.node.animations = [];
        this.node.dispose();
    }

    onParentMoveStatusChange(status: string) {
        if (status === "static") {
            this.sceneryController.scene.stopAnimation(this.node, "walk");
        }
        else if (status === "walk") {
            this.startAnimation("walk");
        }
    }

    async fire() {
        if (!this.isAttached) return;
        // Not use position because there is relative whit parent position
        const directionRay = new BABYLON.Ray(this.absolutePosition.add(new BABYLON.Vector3(0, 0.2,0)), this.owner.directionVector, 1);
        const bullet = this.entitiesController.createEntities("default-bullet") as DefaultBullet;
        bullet.parent = this;
        bullet.ray = directionRay;

        bullet.fire();
        await this.startAnimation("fire");
    }

    async startAnimation(animationName: String): Promise<any> {
        const animationData = this.animations.find(animationData => animationData.name === animationName);
        if (!animationData)  return false;
        this.currentAnimatable = this.sceneryController.scene.beginDirectAnimation(this.node, [animationData.animation] , animationData.start, animationData.end, animationData.loop, animationData.speed);
        return this.currentAnimatable.waitAsync();
    }

    computeAnimation(node: BABYLON.TransformNode) {
        this.animations = [];
        node.animations = [];
        const walkAnimation = new BABYLON.Animation("walk", "position.y", 4, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const walkKey = []; 

        walkKey.push(
            {
                frame: 0,
                value: node.position.y
            },
            {
                frame: 1,
                value: node.position.y + 0.004
            },
            {
                frame: 2,
                value: node.position.y + 0.008
            },
            {
                frame: 3,
                value: node.position.y
            }
        );
        walkAnimation.setKeys(walkKey);
        node.animations.push(walkAnimation);
        
        this.animations.push({
            name: "walk",
            start: 0,
            end: 3,
            loop: true,
            speed: 1,
            animation: walkAnimation
        });

        const fireAnimation = new BABYLON.Animation("fire", "rotation.x", 3, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        const fireKey = []; 

        fireKey.push(
            {
                frame: 0,
                value: node.rotation.x
            },
            {
                frame: 1,
                value: node.rotation.x - Math.PI / 12
            },
            {
                frame: 2,
                value: node.rotation.x
            }
        );
        fireAnimation.setKeys(fireKey);
        node.animations.push(fireAnimation);
        
        this.animations.push({
            name: "fire",
            start: 0,
            end: 2,
            loop: false,
            speed: 3,
            animation: fireAnimation
        });
    }
}