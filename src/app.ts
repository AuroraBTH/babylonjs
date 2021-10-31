import { InstancedMesh } from 'babylonjs/Meshes/instancedMesh';
import MyScene from './my-scene';

window.addEventListener('DOMContentLoaded', () => {
    const game = new MyScene();
    
    game.createScene();
    // game.addGround();
    game.addHouses();
    game.buildCar();

    game.doRender();
});
