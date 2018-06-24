class Game {
    constructor() {
        this.app = new PIXI.Application(800, 600, {
            backgroundColor: 0xcccccc
        });
        document.body.appendChild(this.app.view);
    }
}

export default Game;