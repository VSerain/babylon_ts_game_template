import Game from "./game";
import { BUILD_CONFIG } from "./config";
import 'babylonjs-loaders';
import * as cannon from "cannon";

declare global {
    interface Window { 
        game: Game;
        CANNON: any;
    }
}

function main(): void {
    window.CANNON = cannon;
    const game = new Game("renderCanvas");

    if (BUILD_CONFIG.mode === "DEV" ) {
        window.game = game;
    }
}

window.addEventListener('DOMContentLoaded', () => main());