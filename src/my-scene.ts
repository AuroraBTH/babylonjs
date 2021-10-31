import * as BABYLON from 'babylonjs';

export default class MyScene {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.HemisphericLight;

    public scene: BABYLON.Scene;

    constructor() {
        this._canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene() : BABYLON.Scene {
        this.scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        this._camera.attachControl(this._canvas, true);
        this._light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);

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
        places.push({ rotation: Math.PI / Math.random() * 10, x: Math.random() * 10, z: Math.random() * 10 });
        places.push({ rotation: Math.PI / Math.random() * 10, x: Math.random() * 10, z: Math.random() * 10 });
        places.push({ rotation: Math.PI / Math.random() * 10, x: Math.random() * 10, z: Math.random() * 10 });
        places.push({ rotation: Math.PI / Math.random() * 10, x: Math.random() * 10, z: Math.random() * 10 });

        const houses: BABYLON.InstancedMesh[] = [];
        places.forEach((place, i) => {
            let tempHouse: BABYLON.InstancedMesh = house.createInstance('house_' + i);

            tempHouse.rotation.y = place.rotation;
            tempHouse.position.x = place.x;
            tempHouse.position.z = place.z;

            houses.push(tempHouse);
        });

        this.scene.removeMesh(house);
    }

    addGround() : void {
        const ground: BABYLON.Mesh = BABYLON.MeshBuilder.CreateGround('ground', {
            width: 50,
            height: 50
        });

        const groundMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture('https://www.babylonjs-playground.com/textures/grass.png', this.scene);
        ground.material = groundMaterial;
    }

    buildCar() : void {
        //base
        const outline = [
            new BABYLON.Vector3(-0.3, 0, -0.1),
            new BABYLON.Vector3(0.2, 0, -0.1),
        ]

        //curved front
        for (let i = 0; i < 20; i++) {
            outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
        }

        //top
        outline.push(new BABYLON.Vector3(0, 0, 0.1));
        outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

        //back formed automatically

        //car face UVs
        const faceUV = [];
        faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
        faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
        faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

        //car material
        const carMat = new BABYLON.StandardMaterial("carMat", this.scene);
        carMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/car.png", this.scene);

        const car = BABYLON.MeshBuilder.ExtrudePolygon("car", { shape: outline, depth: 0.2, faceUV: faceUV, wrap: true });
        car.material = carMat;

        //wheel face UVs
        const wheelUV = [];
        wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
        wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
        wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

        //car material
        const wheelMat = new BABYLON.StandardMaterial("wheelMat", this.scene);
        wheelMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png", this.scene);

        const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", { diameter: 0.125, height: 0.05, faceUV: wheelUV })
        wheelRB.material = wheelMat;
        wheelRB.parent = car;
        wheelRB.position.z = -0.1;
        wheelRB.position.x = -0.2;
        wheelRB.position.y = 0.035;

        const wheelRF = wheelRB.clone("wheelRF");
        wheelRF.position.x = 0.1;

        const wheelLB = wheelRB.clone("wheelLB");
        wheelLB.position.y = -0.2 - 0.035;

        const wheelLF = wheelRF.clone("wheelLF");
        wheelLF.position.y = -0.2 - 0.035;
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
