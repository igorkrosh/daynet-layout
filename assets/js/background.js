import * as THREE from './lib/three.module.js';
import { GLTFLoader } from './lib/GLTFLoader.js'; 

let modelLoaderGLTF;
let _scenes = {
    'dayzy-background': {
        scene: '',
        camera: '',
        renderer: '',
        model: '',
        node: ''
    },
    'dayzy-background-2': {
        scene: '',
        camera: '',
        renderer: '',
        model: '',
        node: ''
    }
}

let dayzy = {
    'dayzy-background': {
        position: {
            x: -0.45,
            y: -7.35,
            z: -3
        },
        rotation: {
            x: 0,
            y: -0.66,
            z: -0.09
        },
    },
    'dayzy-background-2': {
        position: {
            x: 0,
            y: -9.79,
            z: 0.34
        },
        rotation: {
            x: 0,
            y: -1.55,
            z: -0.0
        },
    }
}

Init();
Animate();

function SetupScene(canvasId)
{
    _scenes[canvasId].node = document.getElementById(canvasId);

    //СОЗДАЕМ РЕНДЕР
    _scenes[canvasId].renderer = new THREE.WebGLRenderer({
        alpha: true, 
        antialias: true,
        canvas: document.getElementById(canvasId),
    });

    //СОЗДАЕМ КАМЕРУ
    _scenes[canvasId].camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    _scenes[canvasId].camera.position.z = 10;

    _scenes[canvasId].scene = new THREE.Scene();

    //ДОБАВЛЯЕМ СВЕТ НА СЦЕНУ
    SetupLight(canvasId)

    //НАСТРОЙКА РЕНДЕРА
    _scenes[canvasId].renderer.setPixelRatio( window.devicePixelRatio );
    _scenes[canvasId].renderer.setSize(_scenes[canvasId].node.offsetWidth, _scenes[canvasId].node.offsetHeight);
}

function LoadModels()
{
    modelLoaderGLTF.setPath('../../assets/models/');
    modelLoaderGLTF.load('deer.glb', 
        function (gltf) {

            for (let canvasId of Object.keys(_scenes))
            {
                _scenes[canvasId].model = gltf.scene.clone();

                _scenes[canvasId].model.traverse((o) => {
                    if (o.isMesh) o.material = new THREE.MeshNormalMaterial();
                });

                _scenes[canvasId].model.position.x = dayzy[canvasId].position.x;
                _scenes[canvasId].model.position.y = dayzy[canvasId].position.y;
                _scenes[canvasId].model.position.z = dayzy[canvasId].position.z;
    
                _scenes[canvasId].model.rotation.x = dayzy[canvasId].rotation.x;
                _scenes[canvasId].model.rotation.y = dayzy[canvasId].rotation.y;
                _scenes[canvasId].model.rotation.z = dayzy[canvasId].rotation.z;
                
                _scenes[canvasId].scene.add( _scenes[canvasId].model );
                
                _scenes[canvasId].renderer.render( _scenes[canvasId].scene, _scenes[canvasId].camera );
            }     
        }
    )
}

function SetupLight(canvasId)
{
    let ambientLight = new THREE.AmbientLight(0x999999 );
    _scenes[canvasId].scene.add(ambientLight);

    let lights = [];

    lights[0] = new THREE.DirectionalLight( 0xffffff, 1 );
    lights[0].position.set( 1, 0, 0 );

    lights[1] = new THREE.DirectionalLight( 0x11E8BB, 1 );
    lights[1].position.set( 0.75, 1, 0.5 );

    lights[2] = new THREE.DirectionalLight( 0x8200C9, 1 );
    lights[2].position.set( -0.75, -1, 0.5 );

    _scenes[canvasId].scene.add( lights[0] );
    _scenes[canvasId].scene.add( lights[1] );
    _scenes[canvasId].scene.add( lights[2] );
}

function Init()
{
    modelLoaderGLTF = new GLTFLoader();

    for (let id of Object.keys(_scenes))
    {
        SetupScene(id);
    }

    LoadModels();

    window.addEventListener( 'resize', OnWindowResize, false );
}

function Animate()
{
    requestAnimationFrame(Animate);

    for (let canvasId of Object.keys(_scenes))
    {
        _scenes[canvasId].renderer.render( _scenes[canvasId].scene, _scenes[canvasId].camera );
    }
}

function OnWindowResize()
{
    for (let canvasId of Object.keys(_scenes))
    {
        _scenes[canvasId].camera.aspect = window.innerWidth / window.innerHeight;
        _scenes[canvasId].camera.updateProjectionMatrix();
        console.log(_scenes[canvasId].node.offsetWidth)
        _scenes[canvasId].renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
