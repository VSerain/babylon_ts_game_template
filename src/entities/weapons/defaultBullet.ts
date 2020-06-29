import * as BABYLON from "babylonjs";

import EntityStructure from "app/shared/entity-structure";
import { getTouchableByMesh } from "app/shared/structure-helpers";
import { debugRay } from "app/shared/debug-helpers";

import { Touchable, Weapon } from "app/entities/interfaces";

export const name = "default-bullet";

export const glb = "bullet.glb";

export default class DefaultBullet extends EntityStructure {
    entries: BABYLON.InstantiatedEntries;
    animatable: BABYLON.Animatable;
    ray: BABYLON.Ray;
    speed: number = 240;
    maxDistLife: number = 100;
    sizeImpact: BABYLON.Vector3 = new BABYLON.Vector3(0.08, 0.08, 0.08);
    lastPosition: BABYLON.Vector3 = new BABYLON.Vector3();
    impactMaterial: BABYLON.Material;
    
    parent: Weapon;

    constructor() {
        super();
        this.require.entitiesController = true;
        this.require.sceneryController = true;
    }

    get position() {return super.position}
    set position(position: BABYLON.Vector3) {
        super.position = position
        this.lastPosition = position.clone();
    }

    initMaterial() {
        const impactMaterial = new BABYLON.StandardMaterial("impactMat", this.sceneryController.scene);
        impactMaterial.diffuseTexture = new BABYLON.Texture("assets/images/textures/impact-2.png", this.sceneryController.scene); // Check if is posible load assets on start game
        impactMaterial.diffuseTexture.hasAlpha = true;
        impactMaterial.zOffset = -2;
    }

    load() {
        this.initMaterial();
    }

    fire() {
        this.entries = this.entitiesController.store.getEntries(name);
        this.node = this.entries.rootNodes[0];
        this.node.scaling = new BABYLON.Vector3(0.04, 0.04, 0.04);
        this.node.setAbsolutePosition(this.ray.origin);
        this.lastPosition = this.node.position;

        const fireAnimation = new BABYLON.Animation("move-with-ray-fire", "position", this.speed, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        fireAnimation.setKeys([
            {
                frame: 0,
                value: this.position
            },
            {
                frame: this.maxDistLife,
                value: this.position.add(this.ray.direction.scale(this.maxDistLife))
            }
        ]);

        this.node.animations.push(fireAnimation);

        this.animatable = this.sceneryController.scene.beginDirectAnimation(this.node, [fireAnimation] , 0 , this.maxDistLife);

        this.animatable.onAnimationEnd = () => this.dispose();
    }

    renderLoop() {
        if (!this.animatable || this.node.isDisposed()) return;
        this.checkColide();

        this.lastPosition = this.position.clone();
    }

    checkColide() {
        const directionVector = this.position.subtract(this.lastPosition);
        const ray = new BABYLON.Ray(this.lastPosition, directionVector.clone().normalize(), directionVector.length());
        const pickInfo = this.sceneryController.scene.pickWithRay(ray, (mesh) => {
            if (mesh === this.node) return false;
            const touchable = getTouchableByMesh(mesh) as Touchable;

            if (!touchable) return false;
            if (this.parent === touchable as any) return false;
            if (this.parent.owner as any === touchable) return false;

            return true;
        });
     
        // debugRay(ray, this.sceneryController.scene);

        if (!pickInfo || !pickInfo.pickedMesh) return;

        const touchable = getTouchableByMesh(pickInfo?.pickedMesh) as Touchable;

        if (!touchable) return;

        this.parent.owner.toTouch(touchable, pickInfo);

        const destroy = touchable.wasTouched(this, pickInfo.pickedMesh, pickInfo, this.parent.owner);

        if (destroy) {
            this.explode(pickInfo.pickedPoint as BABYLON.Vector3, pickInfo.faceId, pickInfo.pickedMesh);
            this.dispose();
            return;
        }
    }

    explode(positionImpact: BABYLON.Vector3, faceId: number, structureMesh: BABYLON.AbstractMesh) {
        if (structureMesh.isDisposed()) return;

        const impact = BABYLON.MeshBuilder.CreateDecal("decal", structureMesh, {
            position: positionImpact,
            normal: structureMesh.getFacetNormal(faceId).scale(-1), 
            size: this.sizeImpact,
        });

        impact.material = this.impactMaterial;
        impact.parent = structureMesh;
        impact.setAbsolutePosition(positionImpact);
    }

    dispose() {
        if (this.animatable) this.animatable.stop();
        this.entitiesController.disposeEntity(this);
        super.dispose();
    }
}