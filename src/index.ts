import Game from "./game";

import { BUILD_CONFIG } from "./config";

declare global {
    interface Window { game: Game; }
}

function main(): void {
    const game = new Game("renderCanvas");

    if (BUILD_CONFIG.mode === "DEV" ) {
        window.game = game;
    }
}

window.addEventListener('DOMContentLoaded', () => main());