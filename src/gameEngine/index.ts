import * as BABYLON from "babylonjs";

import DefaultEngine from "../shared/defaultEngine";
import { EntityUnserializeObject } from "../shared/entityInterface";

import GraphicsEngine from "../graphicsEngine/index";
import NetworkEngine from "../networkEngine/index";
import SoundEngine from "../soundEngine/index";

import DefaultEntity  from "./entities/defaultEntity";
import EntitiesClass from "./entities/index";

export default class GameEngine extends DefaultEngine {
    graphicsEngine: GraphicsEngine;
    networkEngine: NetworkEngine;
    soundEngine: SoundEngine;

    structures: Array<DefaultEntity> = [];

    __init__() {
    }

    loadStructure(entityObject: EntityUnserializeObject): DefaultEntity {
        if (entityObject.type.length == 0) throw new Error("Type is not defined");
        const EntityClass = EntitiesClass.filter((EntityClass: any) => EntityClass.type === entityObject.type)[0];
        if (!EntityClass) throw new Error(`${entityObject.type} as not found in structuresClass`);
        const entity = new EntityClass(entityObject.mesh);
        
        if (entityObject.data) {
            const data = entityObject.data;

            Object.keys(data).forEach((propName) => {
                if (entity[propName]) {
                    entity[propName] = data[propName];
                }
            });
        }

        return entity;
    }
}