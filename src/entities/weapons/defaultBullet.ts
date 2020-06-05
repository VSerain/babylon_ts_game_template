import * as BABYLON from "babylonjs";

import eventManager from "app/shared/eventManager";
import Structure from "app/shared/structure";
import { getStructureByMesh } from "app/shared/structure-helpers";
import { debugRay } from "app/shared/debug-helpers";

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
    
    parentStructure: Structure;
    colidedStructures: Array<Structure> = [];

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

        eventManager.on("player.body.colide", {
            filter: (partName: string, mesh: BABYLON.Mesh, structureColided: Structure) => structureColided === this,
        }, (cbStop, partName: string, mesh: BABYLON.Mesh) => {
            cbStop();
            this.playerTouched(partName, mesh)
        })
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

        const animationEndEvent = new BABYLON.AnimationEvent(this.maxDistLife -1 , () => this.dispose(), true);

        fireAnimation.addEvent(animationEndEvent);

        this.mesh.animations.push(fireAnimation);

        this.animatable = this.sceneryController.scene.beginDirectAnimation(this.mesh, [fireAnimation] , 0 , this.maxDistLife);
    }

    renderLoop() {
        if (!this.animatable) return;
        this.checkColide();

        this.lastPosition = this.position.clone();
    }

    checkColide() {
        const directionVector = this.position.subtract(this.lastPosition);
        const ray = new BABYLON.Ray(this.lastPosition, directionVector.clone().normalize(), directionVector.length());
        const pickInfo = this.sceneryController.scene.pickWithRay(ray, (mesh) => getStructureByMesh(mesh) ? true : false);
        debugRay(ray, this.sceneryController.scene);

        if (!pickInfo || !pickInfo.pickedMesh) return;

        const structure = getStructureByMesh(pickInfo?.pickedMesh) as Structure;

        if (!this.colidedStructures.includes(structure)) {
            console.log(pickInfo);
            this.explode(pickInfo.pickedPoint as BABYLON.Vector3, pickInfo.faceId, structure);
            this.dispose();
            return;
        }

        console.log(structure, pickInfo);
    }

    explode(positionImpact: BABYLON.Vector3, faceId: number, structure: Structure) {
        const structureMesh = structure.getMesh();
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
        eventManager.call("player.body.structuresColided.remove", [this]);
        this.entitiesController.disposeEntity(this);
    }
}