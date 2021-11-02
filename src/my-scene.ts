import * as BABYLON from 'babylonjs';
import * as BABYLON_GUI from 'babylonjs-gui';
import "@babylonjs/loaders/glTF";

export default class MyScene {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.HemisphericLight;
    private _houses: BABYLON.InstancedMesh[] = [];

    public scene: BABYLON.Scene;

    constructor() {
        this._canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    addGUI() : void {
        const adt = BABYLON_GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const panel = new BABYLON_GUI.StackPanel();
        panel.width = "220px";
        panel.top = "-25px";
        panel.horizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        adt.addControl(panel);

        const header = new BABYLON_GUI.TextBlock();
        header.text = "Night to Day";
        header.height = "30px";
        header.color = "white";
        panel.addControl(header);

        const slider = new BABYLON_GUI.Slider();
        slider.minimum = 0;
        slider.maximum = 1;
        slider.borderColor = "black";
        slider.color = "gray";
        slider.background = "white";
        slider.value = 1;
        slider.height = "20px";
        slider.width = "200px";
        slider.onValueChangedObservable.add((value) => {
            if (this._light) {
                this._light.intensity = value;
            }
        });
        panel.addControl(slider);
    }

    createScene() : BABYLON.Scene {
        this.scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0), this.scene);
        this._camera.attachControl(this._canvas, true);
        this._camera.upperBetaLimit = Math.PI / 2.2;
        this._light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(2, 1, 0), this.scene);
        this._light.intensity = 1;

        const skybox: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 150 }, this.scene);
        const skyboxMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial('skyBox', this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('https://www.babylonjs-playground.com/textures/skybox', this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        return this.scene;
    }

    buildBox() : BABYLON.Mesh {
        const faceUV: BABYLON.Vector4[] = [];
        faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
        faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
        faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
        faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side

        const boxMat: BABYLON.StandardMaterial = new BABYLON.StandardMaterial('boxMat', this.scene);
        boxMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/cubehouse.png', this.scene);
        
        const box: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box', {faceUV: faceUV, wrap: true}, this.scene);
        box.material = boxMat;
        box.position.y = 0.5;

        return box;
    }

    buildRoof() : BABYLON.Mesh {
        const roofMat: BABYLON.StandardMaterial = new BABYLON.StandardMaterial('roofMat', this.scene);
        roofMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/roof.jpg', this.scene);
        
        const roof: BABYLON.Mesh = BABYLON.MeshBuilder.CreateCylinder('roof', {
            diameter: 1.5,
            height: 1.25,
            tessellation: 3
        });

        roof.material = roofMat;
        roof.scaling.x = 0.75;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.25;

        return roof;
    }

    buildHouse() : BABYLON.Mesh {
        const box = this.buildBox();
        const roof = this.buildRoof();

        return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
    } 

    addHouses() : void {
        const house = this.buildHouse();

        const places: {
            rotation: number,
            x: number,
            z: number
        }[] = [];
        places.push({rotation: -Math.PI / 16, x: -6.8, z: 2.5});
        // places.push({rotation: -Math.PI / 16, x: -4.5, z: 3});
        // places.push({rotation: -Math.PI / 16, x: -1.5, z: 4});
        // places.push({rotation: -Math.PI / 3, x: 1.5, z: 6});
        // places.push({rotation: 15 * Math.PI / 16, x: -6.4, z: -1.5});
        // places.push({rotation: 15 * Math.PI / 16, x: -4.1, z: -1});
        // places.push({rotation: 15 * Math.PI / 16, x: -2.1, z: -0.5});
        // places.push({rotation: 5 * Math.PI / 4, x: 0, z: -1});
        // places.push({rotation: Math.PI + Math.PI / 2.5, x: 0.5, z: -3});
        // places.push({rotation: Math.PI + Math.PI / 2.1, x: 0.75, z: -5});
        // places.push({rotation: Math.PI + Math.PI / 2.25, x: 0.75, z: -7});
        // places.push({rotation: Math.PI / 1.9, x: 4.75, z: -1});
        // places.push({rotation: Math.PI / 1.95, x: 4.5, z: -3});
        // places.push({rotation: Math.PI / 1.9, x: 4.75, z: -5});
        // places.push({rotation: Math.PI / 1.9, x: 4.75, z: -7});
        // places.push({rotation: -Math.PI / 3, x: 5.25, z: 2});
        // places.push({rotation: -Math.PI / 3, x: 6, z: 4});

        
        places.forEach((place, i) => {
            let tempHouse: BABYLON.InstancedMesh = house.createInstance('house_' + i);

            tempHouse.rotation.y = place.rotation;
            tempHouse.position.x = place.x;
            tempHouse.position.z = place.z;

            this._houses.push(tempHouse);
        });

        this.scene.removeMesh(house);
    }

    addGround() : void {
        const groundMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/villagegreen.png', this.scene);
        groundMaterial.diffuseTexture.hasAlpha = true;

        const ground: BABYLON.Mesh = BABYLON.MeshBuilder.CreateGround('ground', {
            width: 24,
            height: 24,
        });
        ground.material = groundMaterial;
        
        const largeGroundMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial('largeGroundMaterial', this.scene);
        largeGroundMaterial.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/valleygrass.png', this.scene);

        const largeGround: BABYLON.Mesh = BABYLON.MeshBuilder.CreateGroundFromHeightMap('largeGround', 'https://assets.babylonjs.com/environments/villageheightmap.png', { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 });
        largeGround.material = largeGroundMaterial;
        largeGround.position.y = -0.01;
    }

    addCar(): void {
        // BABYLON.SceneLoader.ImportMeshAsync('', 'https://assets.babylonjs.com/meshes/', 'car.babylon').then(() => {
        BABYLON.SceneLoader.ImportMesh('', 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/', 'PBR_Spheres.glb', this.scene, (meshes) => {
            // const car = this.scene.getMeshByName('car');
            console.log(meshes);
            // const car = res.meshes[0];
            // car.position.y = 0.16;
            // car.rotation.z = Math.PI * -0.5;
            // car.position.x = car.position.x + 0.5;

            // const wheelRB = this.scene.getMeshByName('wheelRB');
            // const wheelRF = this.scene.getMeshByName('wheelRF');
            // const wheelLB = this.scene.getMeshByName('wheelLB');
            // const wheelLF = this.scene.getMeshByName('wheelLF');
            // this.scene.beginAnimation(wheelRB, 0, 30, true);
            // this.scene.beginAnimation(wheelRF, 0, 30, true);
            // this.scene.beginAnimation(wheelLB, 0, 30, true);
            // this.scene.beginAnimation(wheelLF, 0, 30, true);

            this._camera.lockedTarget = car;
            this._camera.radius = 1.5;

            // const gamepadManager: BABYLON.GamepadManager = new BABYLON.GamepadManager();

            // gamepadManager.onGamepadConnectedObservable.add((gamepad, state) => {
            //     console.log('Conneted' + gamepad.id);

            //     gamepad.onleftstickchanged((values) => {
            //         if (values.y > 0.25 && !this.checkCollision(car)) {
            //             car.position.z = car.position.z - 0.1;
            //         } else if (values.y < -0.25 && !this.checkCollision(car)) {
            //             car.position.z = car.position.z + 0.1;
            //         } else if (values.y > 0.25 && this.checkCollision(car)) {
            //             car.position.z = car.position.z + 0.15;
            //         } else if (values.y < -0.25 && this.checkCollision(car)) {
            //             car.position.z = car.position.z - 0.15;
            //         }

            //         if (values.x > 0.25 && !this.checkCollision(car)) {
            //             car.position.x = car.position.x + 0.1;
            //         } else if (values.x < -0.25 && !this.checkCollision(car)) {
            //             car.position.x = car.position.x - 0.1;
            //         } else if (values.x > 0.25 && this.checkCollision(car)) {
            //             car.position.x = car.position.x - 0.15;
            //         } else if (values.x < -0.25 && this.checkCollision(car)) {
            //             car.position.x = car.position.x + 0.15;
            //         }
            //     });

            //     gamepad.onrightstickchanged((values) => {
            //         if (values.x > 0.4) {
            //             car.rotation.z = car.rotation.z + 0.05;
            //             this._camera.alpha = this._camera.alpha - 0.05;
            //         } else if (values.x < -0.4) {
            //             car.rotation.z = car.rotation.z - 0.05;
            //             this._camera.alpha = this._camera.alpha + 0.05;
            //         }

            //         if (values.y > 0.4) {
            //             this._camera.radius = this._camera.radius + 0.05;
            //         } else if (values.y < -0.4) {
            //             this._camera.radius = this._camera.radius - 0.05;
            //         }
            //     });
            // });
        });
    }

    addTrees() : void {
        const spriteManagerTrees: BABYLON.SpriteManager = new BABYLON.SpriteManager('treesManager', 'https://www.babylonjs-playground.com/textures/palm.png', 2000, { width: 512, height: 1024 }, this.scene);

        //We create trees at random positions
        for (let i = 0; i < 500; i++) {
            const tree: BABYLON.Sprite = new BABYLON.Sprite('tree', spriteManagerTrees);
            tree.position.x = Math.random() * (-30);
            tree.position.z = Math.random() * 20 + 8;
            tree.position.y = 0.5;
        }

        for (let i = 0; i < 500; i++) {
            const tree: BABYLON.Sprite = new BABYLON.Sprite('tree', spriteManagerTrees);
            tree.position.x = Math.random() * (25) + 7;
            tree.position.z = Math.random() * -35 + 8;
            tree.position.y = 0.5;
        }
    }

    addFountain() : void {
        const fountainOutline: BABYLON.Vector3[] = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0.5, 0, 0),
            new BABYLON.Vector3(0.5, 0.2, 0),
            new BABYLON.Vector3(0.4, 0.2, 0),
            new BABYLON.Vector3(0.4, 0.05, 0),
            new BABYLON.Vector3(0.05, 0.1, 0),
            new BABYLON.Vector3(0.05, 0.8, 0),
            new BABYLON.Vector3(0.15, 0.9, 0)
        ];

        //Create lathed fountain
        const fountain: BABYLON.Mesh = BABYLON.MeshBuilder.CreateLathe('fountain', { shape: fountainOutline, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        fountain.position.x = -4;
        fountain.position.z = -6;

        //Switch fountain on and off
        let switched = false;
        const pointerDown = (mesh) => {
            if (mesh === fountain) {
                switched = !switched;
                if (switched) {
                    // Start the particle system
                    particleSystem.start();
                }
                else {
                    // Stop the particle system
                    particleSystem.stop();
                }
            }

        }

        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if (pointerInfo.pickInfo.hit) {
                        pointerDown(pointerInfo.pickInfo.pickedMesh)
                    }
                    break;
            }
        });

        // Create a particle system
        const particleSystem: BABYLON.ParticleSystem = new BABYLON.ParticleSystem('particles', 5000, this.scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture('https://www.babylonjs-playground.com/textures/flare.png', this.scene);

        // Where the particles come from
        particleSystem.emitter = new BABYLON.Vector3(-4, 0.8, -6); // emitted from the top of the fountain
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.01, 0, -0.01); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.01, 0, 0.01); // To...

        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);

        // Size of each particle (random between...
        particleSystem.minSize = 0.01;
        particleSystem.maxSize = 0.05;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;

        // Emission rate
        particleSystem.emitRate = 1500;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(-1, 8, 1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 8, -1);

        // Power and speed
        particleSystem.minEmitPower = 0.2;
        particleSystem.maxEmitPower = 0.6;
        particleSystem.updateSpeed = 0.01;
    }

    addStreetLights() : void {
        BABYLON.SceneLoader.ImportMeshAsync('', 'https://assets.babylonjs.com/meshes/', 'lamp.babylon').then(() => {
            const lampLight: BABYLON.SpotLight = new BABYLON.SpotLight('lampLight', BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0), 0.8 * Math.PI, 0.01, this.scene);
            lampLight.diffuse = BABYLON.Color3.Yellow();
            lampLight.parent = this.scene.getMeshByName('bulb')

            const lamp = this.scene.getMeshByName('lamp');
            lamp.position = new BABYLON.Vector3(2, 0, 2);
            lamp.rotation = BABYLON.Vector3.Zero();
            lamp.rotation.y = -Math.PI / 4;

            let lamp3 = lamp.clone('lamp3', null);
            lamp3.position.z = -8;

            let lamp1 = lamp.clone('lamp1', null);
            lamp1.position.x = -8;
            lamp1.position.z = 1.2;
            lamp1.rotation.y = Math.PI / 2;

            let lamp2 = lamp1.clone('lamp2', null);
            lamp2.position.x = -2.7;
            lamp2.position.z = 0.8;
            lamp2.rotation.y = -Math.PI / 2;

            //@ts-ignore
            this.scene.getMeshByName('ground').material.maxSimultaneousLights = 5;
        });
    }

    checkCollision(car: BABYLON.AbstractMesh) {
        let collided;
        this._houses.forEach((house) => {
            if (house.intersectsMesh(car)) {
                collided = true;
                return collided;
            } else if (!house.intersectsMesh(car)) {
                collided = false;
            }
        });
        return collided;
    }

    doRender() : void {
        this._engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}
