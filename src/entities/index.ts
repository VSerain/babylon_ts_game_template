import * as BABYLON from "babylonjs";

import Loader from "app/loader/index";
import Store from "./store";
import eventManager from "app/shared/eventManager";
import Structure from "app/shared/structure";
import * as structureHelpers from "app/shared/structure-helpers";

import Weapons from "./weapons/index";

export default class EntitiesController {
    scene: BABYLON.Scene;
    store: Store;

    private data = {
        load: false,
    }

    types: Array<any> = [];

    entities: Array<Structure> = [];

    constructor(private loader: Loader) {
        this.loader.entitiesController = this;
        this.store = new Store(this.loader);
        this.initTypes();

        eventManager.on("loader.sceneLoaded", {}, () => {
            this.data.load = true;
            this.entities.forEach(entity => entity.load());
        });
    }

    isLoad() {
        return this.data.load;
    }

    initTypes() {
        this.types.push(...Weapons);

        this.types.forEach((module) => {
            if (module.glb) {
                this.store.addAssets(module.name, module.glb);
            }
            this.loader.addEnitiesType(module.name);
        });
    }

    renderLoop() {
        if (!this.isLoad()) return;
        this.entities.forEach(entity => entity.renderLoop());
    }

    addMesh(typeName: string, mesh: BABYLON.AbstractMesh, data?: any) {
        const type = this.types.find((type) => type.name == typeName);
        if (!type) return;

        if (!mesh.metadata) mesh.metadata = {};
        
        const instance = new type.default(mesh, data) as Structure;

        structureHelpers.applyController(instance, this.loader);

        this.entities.push(instance);
    }

    createEntities(entityName:string) {
        const type = this.types.find((type) => type.name == entityName);
        if (!type) return;

        const instance = new type.default() as Structure;

        structureHelpers.applyController(instance, this.loader);
        this.entities.push(instance);

        if (this.isLoad()) instance.load();

        return instance;
    }

    disposeEntity(disposedEntity: Structure) {
        const entityIndex = this.entities.findIndex(entity => entity === disposedEntity);
        if (entityIndex === -1) return;
        this.entities.splice(entityIndex, 1);
    }

    devSpawnWeapon() {
        setTimeout(() => {
            const entries = this.store.getEntries("default-weapon");
            entries.rootNodes[0].position.x += 3;
            entries.rootNodes[0].position.z += 3;
            entries.rootNodes[0].position.y = 1.75;

            entries.rootNodes[0].scaling = new BABYLON.Vector3(0.2,0.2,0.2);
        }, 2000);
    }
}