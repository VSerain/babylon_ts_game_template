import * as BABYLON from "babylonjs";

import Structure from "app/shared/structure";
import { getTouchableByMesh } from "app/shared/structure-helpers";
import { debugRay } from "app/shared/debug-helpers";

import { Touchable, Weapon } from "app/entities/interfaces";

export const name = "default-bullet";

export const glb = "bullet.glb";

export default class DefaultBullet extends Structure {
    entries: BABYLON.InstantiatedEntries;
    node: BABYLON.TransformNode;
    animatable: BABYLON.Animatable;
    ray: BABYLON.Ray;
    speed: number = 100;
    maxDistLife: number = 100;
    sizeImpact: BABYLON.Vector3 = new BABYLON.Vector3(0.08, 0.08, 0.08);
    lastPosition: BABYLON.Vector3 = new BABYLON.Vector3();
    impactMaterial: BABYLON.Material;
    
    parent: Weapon;

    constructor() {
        super(new BABYLON.Mesh("tmpMesh"), {});
        this.require.entitiesController = true;
        this.require.sceneryController = true;
    }

    get position() {
        return this.mesh.position;
    }
    set position(position) {
        this.mesh.position = position;
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

    playerTouched(partName: string, mesh: BABYLON.Mesh) {
        console.log("Player as touch at " + partName + " by bullet " + this.name);
        this.dispose();
    }

    fire() {
        this.entries = this.entitiesController.store.getEntries(name);
        this.node = this.entries.rootNodes[0];
        this.mesh = this.node.getChildMeshes()[0] as BABYLON.Mesh;
        this.mesh.parent = null;
        this.mesh.scaling = new BABYLON.Vector3(0.04, 0.04, 0.04);
        this.mesh.setAbsolutePosition(this.ray.origin);
        this.lastPosition = this.mesh.position;

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

        this.mesh.animations.push(fireAnimation);
        
        this.animatable = this.sceneryController.scene.beginDirectAnimation(this.mesh, [fireAnimation] , 0 , this.maxDistLife);

        this.animatable.onAnimationEnd = () => this.dispose();
    }

    renderLoop() {
        if (!this.animatable || this.mesh.isDisposed()) return;
        this.checkColide();

        this.lastPosition = this.position.clone();
    }

    checkColide() {
        const directionVector = this.position.subtract(this.lastPosition);
        const ray = new BABYLON.Ray(this.lastPosition, directionVector.clone().normalize(), directionVector.length());
        const pickInfo = this.sceneryController.scene.pickWithRay(ray, (mesh) => getTouchableByMesh(mesh) ? true : false);
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

        console.log(touchable, pickInfo);
    }

    explode(positionImpact: BABYLON.Vector3, faceId: number, structureMesh: BABYLON.AbstractMesh) {
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
        this.mesh.dispose();
        this.entitiesController.disposeEntity(this);
    }
}