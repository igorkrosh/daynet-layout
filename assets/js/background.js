import * as THREE from './lib/three.module.js';
import { GLTFLoader } from './lib/GLTFLoader.js';

let _camera, _scene, _renderer;
let modelLoaderGLTF;

let dayzy = {
    model: {},
    states: [
        {
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
        {
            position: {
                x: 0,
                y: -9.79,
                z: 0.34
            },
            rotation: {
                x: 0,
                y: -1.55,
                z: 0
            },
        },
        {
            position: {
                x: 1.14,
                y: -9.79,
                z: 3.34
            },
            rotation: {
                x: 0,
                y: -2.14,
                z: 0.21
            },
        }
    ]
};


let sceneWrapperId = 'dayzy-background'
let sceneWrapperNode;

Init()
Animate()

function Init() 
{
    modelLoaderGLTF = new GLTFLoader();
    
    _scene = new THREE.Scene();

    _camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    _camera.position.z = 10;

    sceneWrapperNode = document.getElementById(sceneWrapperId);

    _renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    _renderer.setPixelRatio( window.devicePixelRatio );
    _renderer.setSize(sceneWrapperNode.offsetWidth, sceneWrapperNode.offsetHeight);

    SetLight();

    LoadModels()

    sceneWrapperNode.appendChild(_renderer.domElement);

    window.addEventListener( 'resize', OnWindowResize, false );
}

function Animate()
{
    requestAnimationFrame(Animate);

    _renderer.render(_scene, _camera);
}

function LoadModels()
{
    modelLoaderGLTF.setPath('../assets/models/');
    modelLoaderGLTF.load('deer.glb', 
        function (gltf) {
            dayzy.model = gltf.scene;
            _scene.add( gltf.scene );

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            dayzy.model.traverse((o) => {
                if (o.isMesh) o.material = new THREE.MeshNormalMaterial();
            });

            dayzy.model.position.x = dayzy.states[0].position.x;
            dayzy.model.position.y = dayzy.states[0].position.y;
            dayzy.model.position.z = dayzy.states[0].position.z;

            dayzy.model.rotation.x = dayzy.states[0].rotation.x;
            dayzy.model.rotation.y = dayzy.states[0].rotation.y;
            dayzy.model.rotation.z = dayzy.states[0].rotation.z;
        }
    )
    
}

function OnWindowResize()
{
    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();

    _renderer.setSize( sceneWrapperNode.offsetWidth, sceneWrapperNode.offsetHeight );
}

function SetLight()
{
    let ambientLight = new THREE.AmbientLight(0x999999 );
    _scene.add(ambientLight);

    let lights = [];

    lights[0] = new THREE.DirectionalLight( 0xffffff, 1 );
    lights[0].position.set( 1, 0, 0 );

    lights[1] = new THREE.DirectionalLight( 0x11E8BB, 1 );
    lights[1].position.set( 0.75, 1, 0.5 );

    lights[2] = new THREE.DirectionalLight( 0x8200C9, 1 );
    lights[2].position.set( -0.75, -1, 0.5 );

    _scene.add( lights[0] );
    _scene.add( lights[1] );
    _scene.add( lights[2] );
}

function ModelChangeState(model, states, progress)
{
    let stateIndex = parseInt(progress);

    if (stateIndex >= states.length - 1)
    {
        return;
    }

    progress = progress % 1;

    model.position.x = states[stateIndex].position.x + (states[stateIndex + 1].position.x - states[stateIndex].position.x) * progress;
    model.position.y = states[stateIndex].position.y + (states[stateIndex + 1].position.y - states[stateIndex].position.y) * progress;
    model.position.z = states[stateIndex].position.z + (states[stateIndex + 1].position.z - states[stateIndex].position.z) * progress;

    model.rotation.x = states[stateIndex].rotation.x + (states[stateIndex + 1].rotation.x - states[stateIndex].rotation.x) * progress;
    model.rotation.y = states[stateIndex].rotation.y + (states[stateIndex + 1].rotation.y - states[stateIndex].rotation.y) * progress;
    model.rotation.z = states[stateIndex].rotation.z + (states[stateIndex + 1].rotation.z - states[stateIndex].rotation.z) * progress;  
}



window.addEventListener('scroll', function(e) {
    let scrollProcess = window.scrollY / window.innerHeight;
    console.log(window.scrollY)

    ModelChangeState(dayzy.model, dayzy.states, scrollProcess);

    let btnClickDown = document.querySelector('.scroll-block button');

    if (parseInt(scrollProcess + 0.3) >= document.querySelectorAll('.screen').length - 1)
    {
        btnClickDown.classList.add('hidden')
    }
    else
    {
        if (btnClickDown.classList.contains('hidden'))
        {
            btnClickDown.classList.remove('hidden');
        }
    }
})


