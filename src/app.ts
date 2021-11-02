import MyScene from './my-scene';

window.addEventListener('DOMContentLoaded', () => {
    const game = new MyScene();
    
    game.createScene();
    game.addGround();
    game.addHouses();
    game.addCar();
    game.addTrees();
    game.addFountain();
    game.addStreetLights();

    game.addGUI();
    game.doRender();
});
