import * as BABYLON from "babylonjs"

import { MINIMAL_DIST_EVENT } from "app/objects/constants";
import eventManager from "app/shared/eventManager";

import Structure from "app/shared/structure";

export const name = "enemies-spawner";

export default class WeaponSpawner extends Structure {

    enemiesNames: Array<string> = [];
    enemiesQuantity: number = 1;
    delayBetweenSpawn: number = 0;
    delayWithFirstSpawn: number = 0;

    start: boolean = false;

    startAt: number = 0;
    lastSpawn: number = 0;

    /**
     * @param mesh Structrue mesh
     * @param data params of structure
     * @param data.name is the unique name of structrue
     * @param data.enemiesNames is the names of enemies spawn
     * @param data.enemiesQuantity is the number spawned enemies (Optional default value 1)
     * @param data.delayBetweenSpawn is time (in sec) between spawn enemies (Optional default value 0)
     * @param data.delayWithFirstSpawn is time (in sec) behind spawn the first enemy (Optional default value 0)
     * 
     */
    constructor(mesh: BABYLON.Mesh, private data: any = {}) {
        super(mesh, data);
        this.require.entitiesController = true;
        this.require.objectsController = true;
        this.require.sceneryController = true;

        this.enemiesNames = (data.enemiesNames as string).split(";");
        this.enemiesQuantity = data.enemiesQuantity || this.enemiesQuantity;
        this.delayBetweenSpawn = data.delayBetweenSpawn || this.delayBetweenSpawn;
        this.delayWithFirstSpawn = data.delayWithFirstSpawn || this.delayWithFirstSpawn;

    }

    load() {
        this.startAt = new Date().getTime();
    }

    renderLoop() {
        if (this.enemiesQuantity === 0) {
            this.dispose();
            return;
        }

        const now = new Date().getTime();
        if (!this.start && now - this.startAt > this.delayWithFirstSpawn * 1000) {
            this.start = true;
        }
        else if(this.start && now - this.lastSpawn > this.delayBetweenSpawn * 1000) {
            this.spawnEnemy();
            this.lastSpawn = now;
        }
    }

    spawnEnemy() {
        this.enemiesQuantity--;
        const randomName: string = this.enemiesNames[Math.floor(Math.random() * this.enemiesNames.length -1) + 1];
        const entity = this.entitiesController.createEntities(randomName);
        entity.position = this.position.clone();
    }

    dispose() {
        this.mesh.dispose();
        this.objectsController.disposeObject(this);
    }
}