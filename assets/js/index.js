import * as THREE from './lib/three.module.js';
import { GLTFLoader } from './lib/GLTFLoader.js';

//*ПЕРЕМЕННЫЕ СЛАЙДЕР-СКРОЛА*//

let keys = {37: 1, 38: 1, 39: 1, 40: 1}; // Коды стрелок на клавиатуре

let supportsPassive = false; // Современные браузеры на базе Chrome требуют { passive: false } при добавление обработчика на event

let wheelOpt;
let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

let moveDown = false // false => move up; true => move down

let lastScrollTop = 0;
let startTouch = null;

// Переменная для отслеживания состояния скролла. В функции-обработчике скролов при смене слайда устанавливается значение true на 500 мс. При значении true блокируется скролл дальше, чтобы анимация перехода корректно отработала.
let blockTransition = false; 

//*КОНЕЦ ПЕРЕМЕННЫХ СЛАЙДЕР-СКРОЛА*//

//*ПЕРЕМЕННЫЕ 3D-BACKGROUND*//

let _camera, _scene, _renderer;
let modelLoaderGLTF;

// Объект для работы с 3d моделью. Содержит саму модель и массив состояний объекта на разных экранах. 
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
                x: 8,
                y: -9.79,
                z: 0.34
            },
            rotation: {
                x: -0,
                y: -3.0,
                z: -0
            },
        }
    ]
};

// Объект состояний объекта во время вызова окон на втором скролле
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

let sceneWrapperId = 'dayzy-background' // ID HTML-блока в который будет помещена сцена с 3d-моделью
let sceneWrapperNode;

let modelInDirectionState = false; // Переменная служит для понимая находиться ли объект в состоянии вызова окон на втором скролее

let changeStateProgress = {progress: 0};
let tweenDirection = new TWEEN.Tween(changeStateProgress).to({progress: 100}, 500);

let stateIndex = parseInt(window.scrollY / window.innerHeight);

let hiddenScreen = [2, 4]; // На каком экрана нужно спрятать 3d-background;

//*ПЕРЕМЕННЫХ 3D-BACKGROUND*//

$(document).ready(Core);

function Core() // Инизиализация осовных компонентов 
{
    SetNavbarMenu(); // Инициализация бокового меню сайта
    SetScrollBtn(); // Инициализация кнопки Scroll
    SetDirectionBtn(); // Инициализация кнопок направлений компании на втором скролле
    SetSlickCases();
    SetSlickDots();

    // Инициализация WOW.JS 
    let wow = new WOW({
        animateClass: 'animate__animated'
    })
    wow.init();

    try
    {
        window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassive = true;
            }
        }));
    }
    catch(e) {}

    wheelOpt = supportsPassive ? {passive: false} : false;

    DisableScroll(); // Отключает стандартный скоролл на странице

    Init();
    Animate();

    //! ВАЖНО: Курсор должен инициализироваться после всех остальных функций создающих элементы на странице. 
    //! В противном случае на новообразовавшиеся элементы <a> и <button> не будут повешаны обработчики событий mouseenter и mouseleave, 
    //! которые видоизменяют курсор при наведении на интерактивные объекты.
    SetCursor(); // Инициализация кастомного курсора

}

//*БЛОК UI/UX СКРИПТОВ*//

function SetCursor() // Устанавливает кастомный курсор на странице
{
    let initCursorHeight = $('.cursor .bg').height();
    let initCursotWidth = $('.cursor .bg').width();

    let animateOptions = {
        queue: false,
        duration: 200
    }
    
    $('body').mousemove(function(event) {
        $('.cursor').css('transform', `translate3d(${event.clientX}px, ${event.clientY}px, 0)`)
    })

    $("a, button").on(
    {
        mouseenter: function() 
        {
            let itemHeight = $(this).height() * 1.5;
            $('.cursor .bg').animate({
                height: itemHeight + 'px',
                width: itemHeight + 'px'
            }, animateOptions)
        },
        mouseleave: function()
        {
            $('.cursor .bg').animate({
                height: initCursorHeight + 'px',
                width: initCursotWidth + 'px'
            }, animateOptions)
        }
    });
}

function SetNavbarMenu() // Установка бокового меню навбара
{
    let animateInClass = 'animate__slideInLeft';
    let animateOutClass = 'animate__slideOutLeft'

    $('.btn-menu').on('click', function () {
        if (!$('.navbar-menu').hasClass('animate__animated'))
        {
            $('.navbar-menu').addClass('animate__animated');
        }

        $('.direction-popup').removeClass('active');
        $('.navbar').removeClass('active');

        if ($(this).hasClass('active'))
        {
            $(this).removeClass('active');
            $('.navbar-menu').removeClass(animateInClass);
            $('.navbar-menu').addClass(animateOutClass);
        }
        else
        {
            $(this).addClass('active');
            $('.navbar-menu').addClass(animateInClass);
            $('.navbar-menu').removeClass(animateOutClass);
        }        
    })
}

function SetScrollBtn() // Установка кнопки Scroll внизу старницы
{
    $('.scroll-block button').on('click', function() {
        let screenIndex = parseInt(window.scrollY / window.innerHeight);
        let arrayScreens = $('.screen');

        moveDown = true;
    
        let scrollTop = arrayScreens[screenIndex + 1].offsetTop;
    
        window.scrollTo({
            top: scrollTop,
            left: 0,
            behavior: 'smooth'
        })
    })
}

function SetDirectionBtn() // Установка кнопок направлений компании на втором скоролле
{
    $('.second-screen .btn-follow').on('click', function () {
        let target = $(this).attr('data-target');

        $(sceneWrapperNode).addClass('active');
        $(target).addClass('active')
        $('.navbar').addClass('active');
        $('.second-screen .main-container').addClass('active');

        tweenDirection.onUpdate(() => {
            ModelChangeState(dayzy.model, directionsStates[target], changeStateProgress.progress / 100);
        }).onComplete(() => {
            changeStateProgress.progress = 0;
            modelInDirectionState = true;
        });
        tweenDirection.start();  
    });

    $('.direction-popup .btn-back').on('click', function() {
        $('.direction-popup.active').removeClass('active');
        $('.navbar.active').removeClass('active');

        tweenDirection.onUpdate(() => {
            ModelChangeState(dayzy.model, dayzy.states[stateIndex], changeStateProgress.progress / 100);
        }).onComplete(() => {
            changeStateProgress.progress = 0;
            ExitInDirectionState();
        });
        tweenDirection.start();
    })
}

function SetSlickCases()
{
    $(".slick-cases-wrapper").slick({

        items: 1,
        vertical: false,
        prevArrow: '<button type="button" class="btn-slider slider-prev"></button>',
        nextArrow: '<button type="button" class="btn-slider slider-next"></button>',
        appendArrows: $('.slick-cases-nav'),
        dots: true,
        appendDots: $('.slick-cases-dots'),
        dotsClass: 'slider-dots',
        fade: true,
        speed: 1000,
        infinite: true,
    });

}

function SetSlickDots()
{
    let dots = $('.slick-cases-dots .slider-dots button');

    for (let dot of dots)
    {
        let slideId = $(dot).attr('aria-controls');

        let slideTitle = $(`#${slideId} .slide-title span`).text();
        
        $( `<span>${slideTitle}</span>` ).insertBefore( dot );
    }
}

//*КОНЕЦ БЛОКА UI/UX СКРИПТОВ*//

//*БЛОК СЛАЙДЕР-СКРОЛА*//

function PreventDefaultForScroll(e) // Функция вызывается для event'ов DOMMouseScroll, onwheel, wheel, mousewheel
{
    e.preventDefault();

    if (e.deltaY < 0)
    {
        moveDown = false;
    }
    else if (e.deltaY > 0)
    {
        moveDown = true;
    }

    ScrollHandler();
}

function PreventDefaultForScrollKeys(e) // Функция вызывается для event'а keydown
{
    if (keys[e.keyCode])
    {
        e.preventDefault();

        if (e.keyCode == 38)
        {
            moveDown = false;
        }

        if (e.keyCode == 40)
        {
            moveDown = true;
        }

        ScrollHandler();
        return false;
    }
}

function PreventDefaultForTouch(e) // Функция вызывается для event'а touchmove
{
    e.preventDefault();
    ScrollHandler();
}

// Получает координаты начала свайпа
$(window).on('touchstart', function(e) {
    startTouch = e.changedTouches[0];
})

// Получаем координаты конца свайпа и вычисляем направление свайпа
$(window).on('touchend', function(e) {
    let endTouch = e.changedTouches[0];

    if (endTouch.screenY - startTouch.screenY > 0)
    {
        moveDown = false;
    }
    else if (endTouch.screenY - startTouch.screenY < 0)
    {
        moveDown = true;
    }
});

function ScrollHandler()
{
    let screenIndex = stateIndex;

    let arrayScreens = $('.screen');
    let scrollTop;
    
    if (screenIndex + 1 >= arrayScreens.length && moveDown == true) { return; }
    if (screenIndex == 0 && moveDown == false) { return }
    if (blockTransition) { return }

    if (moveDown)
    {
        scrollTop = arrayScreens[screenIndex + 1].offsetTop;
    }
    else
    {
        scrollTop = arrayScreens[screenIndex - 1].offsetTop;
    }

    window.scrollTo({
        top: scrollTop,
        left: 0,
        behavior: 'smooth'
    });

    blockTransition = true;
    setTimeout(UnblockTransition, 500);
}

function UnblockTransition()
{
    blockTransition = false;
}

function DisableScroll() // Отключает стандартный скрол на странице
{
    window.addEventListener('DOMMouseScroll', PreventDefaultForScroll, false); //  Для старых версий Firefox
    window.addEventListener(wheelEvent, PreventDefaultForScroll, wheelOpt); // Для современных браузеров
    window.addEventListener('touchmove', PreventDefaultForTouch, wheelOpt); // Для смартфонов
    window.addEventListener('keydown', PreventDefaultForScrollKeys, false); // Для нажатий клавиш на клавиатуре
}

function EnableScroll() // Включает  стандартный скролл на странице
{
    window.removeEventListener('DOMMouseScroll', PreventDefault, false);
    window.removeEventListener(wheelEvent, PreventDefault, wheelOpt); 
    window.removeEventListener('touchmove', PreventDefault, wheelOpt);
    window.removeEventListener('keydown', PreventDefaultForScrollKeys, false);
}

function OnResizeSlider()
{
    let arrayScreens = $('.screen');

    let scrollTop = arrayScreens[stateIndex].offsetTop;

    window.scrollTo({
        top: scrollTop,
        left: 0,
        behavior: 'smooth'
    });
}

//*КОНЕЦ БЛОКА СЛАЙДЕР-СКРОЛА*//

//*БЛОК РАБОТЫ С 3D-BACKGROUND*//

function Init() // Инизиализация Three.js и сцены с 3d-моделью.
{
    modelLoaderGLTF = new GLTFLoader();

    _scene = new THREE.Scene();

    _camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    _camera.position.z = 10;

    sceneWrapperNode = $(`#${sceneWrapperId}`)[0];

    _renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    _renderer.setPixelRatio( window.devicePixelRatio );
    _renderer.setSize(sceneWrapperNode.offsetWidth, sceneWrapperNode.offsetHeight);

    SetLight();

    LoadModels();

    $(sceneWrapperNode).append(_renderer.domElement);
}

function Animate() // Фукнция отрисовки анимации на сцене 
{
    requestAnimationFrame(Animate);

    TWEEN.update();

    _renderer.render(_scene, _camera);
}

function LoadModels() // Функиця для загрузки моделей и добавление их на сцену
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

            dayzy.model.position.x = dayzy.states[stateIndex].position.x;
            dayzy.model.position.y = dayzy.states[stateIndex].position.y;
            dayzy.model.position.z = dayzy.states[stateIndex].position.z;

            dayzy.model.rotation.x = dayzy.states[stateIndex].rotation.x;
            dayzy.model.rotation.y = dayzy.states[stateIndex].rotation.y;
            dayzy.model.rotation.z = dayzy.states[stateIndex].rotation.z;
        }
    )    
}

function OnWindowResize() // Функция перерисовки сцены при event resize
{
    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();

    _renderer.setSize( sceneWrapperNode.offsetWidth, sceneWrapperNode.offsetHeight );
}

function SetLight() // Функция добавляет источники света на сцену
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

/**
 * Функция для перевода модели из одного состояния в другое
 * @param {*} model - Параметр долджен содержать саму модель состояние которой будет изменено
 * @param {*} state - Состояние в которое переходит модель
 * @param {*} progress - Прогресс перехода. Значение от 0, 0.1, ... 1
 */    

function ModelChangeState(model, state, progress)
{
    model.position.x = model.position.x + (state.position.x - model.position.x) * progress;
    model.position.y = model.position.y + (state.position.y - model.position.y) * progress;
    model.position.z = model.position.z + (state.position.z - model.position.z) * progress;

    model.rotation.x = model.rotation.x + (state.rotation.x - model.rotation.x) * progress;
    model.rotation.y = model.rotation.y + (state.rotation.y - model.rotation.y) * progress;
    model.rotation.z = model.rotation.z + (state.rotation.z - model.rotation.z) * progress;  
}

function OnScrollBackground(scrollProcess)
{
    let progress = scrollProcess % 1;

    let btnClickDown = $('.scroll-block');

    if (parseInt(scrollProcess + 0.3) >= $('.screen').length - 1)
    {
        $(btnClickDown).addClass('hidden');
    }
    else if ($(btnClickDown).hasClass('hidden'))
    {
        $(btnClickDown).removeClass('hidden');
    }

    if (modelInDirectionState) { ExitInDirectionState(); }

    if (moveDown)
    {
        if (stateIndex >= dayzy.states.length - 1) { return; }

        if (hiddenScreen.indexOf(stateIndex + 1) != -1) { return; }

        if (hiddenScreen.indexOf(stateIndex) != -1)
        {
            ModelChangeState(dayzy.model, dayzy.states[stateIndex + 1], 1);
            return;
        }

        ModelChangeState(dayzy.model, dayzy.states[stateIndex + 1], progress);
    }
    else
    {
        if (hiddenScreen.indexOf(stateIndex + 1) != -1) 
        {
            ModelChangeState(dayzy.model, dayzy.states[stateIndex], 1); 
            return; 
        }

        if (hiddenScreen.indexOf(stateIndex) != -1)
        {
            return;
        }

        progress = 1 - progress;

        ModelChangeState(dayzy.model, dayzy.states[stateIndex], progress);
    }
}

function ExitInDirectionState()
{
    $('.direction-popup.active').removeClass('active');
    $('.navbar').removeClass('.active');
    
    $(sceneWrapperNode).removeClass('active');

    $('.second-screen .main-container').removeClass('active');

    modelInDirectionState = false;
}

//*КОНЕЦ БЛОКА РАБОТЫ С 3D-BACKGROUND*//

//*ОБРАБОТЧИКИ СОБЫТИЙ ЭКРАНА*//

$(window).on('scroll', function(e) {
    let scrollProcess = window.scrollY / window.innerHeight;
    stateIndex = parseInt(scrollProcess);

    OnScrollBackground(scrollProcess);
});

$(window).on('resize', function(e) {
    OnWindowResize();
    OnResizeSlider();
})

//*КОНЕЦ ОБРАБОТЧИКОВ СОБЫТИЙ ЭКРАНА*//