import * as BABYLON from "babylonjs";

import Structure from "app/shared/structure";

import DefaultBullet from "./defaultBullet";
import { WeaponOwner } from 'app/entities/interfaces';

export const name = "default-weapon";

export const glb = "weapon.glb"

export default class DefaultWeapon extends Structure {
    weaponName: string = name;
    bulletName: string = "default-bullet";

    entries: BABYLON.InstantiatedEntries;
    node: BABYLON.TransformNode;

    owner: WeaponOwner;
    isAttached: boolean = false;

    animations: Array<any> = [];
    groupAnimation: BABYLON.AnimationGroup;
    currentAnimatable: BABYLON.Animatable;

    constructor() {
        super(new BABYLON.Mesh("tmpMesh"), {});
        this.require.playerController = true;
        this.require.entitiesController = true;
        this.require.sceneryController = true;
    }

    attachToParent(parentMesh: BABYLON.Mesh, owner: WeaponOwner) {
        this.isAttached = true;
        this.entries = this.entitiesController.store.getEntries(name);
        this.node = this.entries.rootNodes[0];
        this.node.parent = parentMesh;
        this.owner = owner;
        
        this.node.position = new BABYLON.Vector3(0, -0.6 , -0.1);
        this.node.rotation = new BABYLON.Vector3(0, Math.PI / 2,  Math.PI / 2);
        
        // @TODO remove me
        this.node.scaling = new BABYLON.Vector3(0.08,0.08,0.08);
        this.computeAnimation(this.node);
    }

    detachToParent() {
        this.isAttached = false;
        this.node.animations = [];
        this.node.parent = null;
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

        const directionRay = new BABYLON.Ray(this.absolutePosition.clone().add(new BABYLON.Vector3(0, 0.2,0)), this.owner.directionVector, 1);
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

        const fireAnimation = new BABYLON.Animation("fire", "rotation.z", 3, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        const fireKey = []; 

        fireKey.push(
            {
                frame: 0,
                value: node.rotation.z
            },
            {
                frame: 1,
                value: node.rotation.z - Math.PI / 12
            },
            {
                frame: 2,
                value: node.rotation.z
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