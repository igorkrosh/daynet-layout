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

let directionsStates = {
    '#reputation': {
        position: {
            x: 5,
            y: -9.74,
            z: 0.34
        },
        rotation: {
            x: 0,
            y: -3,
            z: 0.5
        },
    },
    '#marketing': {
        position: {
            x: 7,
            y: -8,
            z: 0.34
        },
        rotation: {
            x: 0,
            y: -3,
            z: 0
        },
    },
    '#design': {
        position: {
            x: -8,
            y: -9,
            z: 0.4
        },
        rotation: {
            x: 0,
            y: -0.2,
            z: 0
        },
    }
}

let sceneWrapperId = 'dayzy-background'
let sceneWrapperNode;

let modelInDirectionState = false;

let changeStateProgress = {progress: 0};
let tweenDirection = new TWEEN.Tween(changeStateProgress).to({progress: 100}, 500);

let stateIndex = parseInt(window.scrollY / window.innerHeight);

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

    TWEEN.update();

    _renderer.render(_scene, _camera);
}

function LoadModels()
{
    //let stateIndex = parseInt(window.scrollY / window.innerHeight);

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

            dayzy.model.position.x = dayzy.states[stateIndex].position.x;
            dayzy.model.position.y = dayzy.states[stateIndex].position.y;
            dayzy.model.position.z = dayzy.states[stateIndex].position.z;

            dayzy.model.rotation.x = dayzy.states[stateIndex].rotation.x;
            dayzy.model.rotation.y = dayzy.states[stateIndex].rotation.y;
            dayzy.model.rotation.z = dayzy.states[stateIndex].rotation.z;
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

function ModelChangeState(model, state, progress)
{
    model.position.x = model.position.x + (state.position.x - model.position.x) * progress;
    model.position.y = model.position.y + (state.position.y - model.position.y) * progress;
    model.position.z = model.position.z + (state.position.z - model.position.z) * progress;

    model.rotation.x = model.rotation.x + (state.rotation.x - model.rotation.x) * progress;
    model.rotation.y = model.rotation.y + (state.rotation.y - model.rotation.y) * progress;
    model.rotation.z = model.rotation.z + (state.rotation.z - model.rotation.z) * progress;  
}



window.addEventListener('scroll', function(e) {
    let scrollProcess = window.scrollY / window.innerHeight;
    let stateIndex = parseInt(scrollProcess);
    
    let progress = scrollProcess % 1;

    let btnClickDown = document.querySelector('.scroll-block');

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

    if (moveDown)
    {
        if (stateIndex >= dayzy.states.length - 1)
        {
            return;
        }

        if (modelInDirectionState)
        {
            ExitInDirectionState()
        }

        ModelChangeState(dayzy.model, dayzy.states[stateIndex + 1], progress);
    }
    else
    {
        progress = 1 - progress;

        if (modelInDirectionState)
        {
            ExitInDirectionState()
        }

        ModelChangeState(dayzy.model, dayzy.states[stateIndex], progress);
    }
})

$('.second-screen .btn-follow').on('click', function () {
    let target = $(this).attr('data-target');
    
    sceneWrapperNode.classList.add('active');

    tweenDirection.onUpdate(() => {
        ModelChangeState(dayzy.model, directionsStates[target], changeStateProgress.progress / 100);
    }).onComplete(() => {
        changeStateProgress.progress = 0;
        modelInDirectionState = true;
    });
    tweenDirection.start();  
})

$('.direction-popup .btn-back').on('click', function() {
    document.querySelector('.direction-popup.active').classList.remove('active');
    tweenDirection.onUpdate(() => {
        ModelChangeState(dayzy.model, dayzy.states[stateIndex], changeStateProgress.progress / 100);
    }).onComplete(() => {
        changeStateProgress.progress = 0;
        ExitInDirectionState();
    });
    tweenDirection.start();
})

function ExitInDirectionState()
{
    if (document.querySelector('.direction-popup').classList.contains('active'))
    {
        document.querySelector('.direction-popup.active').classList.remove('active');
    }
    $('.direction-popup.active').removeClass('active');
    if (document.querySelector('.navbar').classList.contains('active'))
    {
        document.querySelector('.navbar').classList.remove('active');
    }
    
    sceneWrapperNode.classList.remove('active');
    document.querySelector('.second-screen .main-container').classList.remove('active');
    
    modelInDirectionState = false;
}


