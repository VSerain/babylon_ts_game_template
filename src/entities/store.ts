import * as BABYLON from "babylonjs";
import Loader from "app/loader/index";

import { StoreList } from "./interfaces";

export default class Store {
    private storedContainer : StoreList = {};
    constructor(private loader: Loader) {}

    addAssets(name: string, fileName: string) {
        this.storedContainer[name] = {
            name,
            loaded: false,
        };
        this.loader.loadAssetsContainer(fileName).then(container => {
            this.storedContainer[name].container = container;
            this.storedContainer[name].loaded = true;
        });
    }

    getEntries(name: string, firstPartName: string = "Clone of ", cloneMaterials: boolean = false) {
        if (!this.storedContainer[name] || !this.storedContainer[name].loaded) throw new Error("Assets not found or not loaded");
        const container = this.storedContainer[name].container as BABYLON.AssetContainer;
        return container.instantiateModelsToScene((name) => firstPartName + name, cloneMaterials)
    }
}