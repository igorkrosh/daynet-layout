let supportsPassive = false; // Современные браузеры на базе Chrome требуют { passive: false } при добавление обработчика на event
let wheelOpt;
let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
let moveDown = true;

let tweenRails;
let tweenDuration = 12000;
let tweenFastDuration = 4000;
let translateCoord;
let railsProgress;
let railsItemsWrapper = '.rails-items-wrapper';

let checkScroll;
let isScrolling = false;
let isFast = false;

$(document).ready(Core)

function Core() 
{
    SetLabelRails();
    animate();

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

    window.addEventListener('DOMMouseScroll', SetScrollDirection, false); //  Для старых версий Firefox
    window.addEventListener(wheelEvent, SetScrollDirection, wheelOpt); // Для современных браузеров
    window.addEventListener('touchmove', SetTouchDirection, wheelOpt);

}

function animate(time) {
	requestAnimationFrame(animate);
    TWEEN.update(time);
}

function SetLabelRails()
{
    translateCoord = {x: 0}
    CreateTween({x: -100}, tweenDuration, true);
}

function SetScrollDirection(e) 
{
    isScrolling = true;

    if (e.deltaY < 0 && moveDown == true)
    {
        moveDown = false;
        
        ChangeTweenDirection(moveDown)
    }
    else if (e.deltaY > 0 && moveDown == false)
    {
        moveDown = true;

        ChangeTweenDirection(moveDown)
    }

    if (!isFast)
    {
        ChangeTweenDirection(moveDown, tweenFastDuration);
        isFast = true;
    }
}

function ChangeTweenDirection(direction, newDuration = tweenDuration)
{
    let toCoord;
    let duration;
    let onCompleteCoord;

    tweenRails.stop();

    if (direction)
    {
        toCoord = {x: -100};
        duration = newDuration * (1 - railsProgress);
        onCompleteCoord = 0;
    }
    else
    {
        toCoord = {x: 0};
        duration = newDuration * railsProgress;
        onCompleteCoord = -100;
    }

    CreateTween(toCoord, duration, false);
    
    tweenRails.onComplete(function() {
        translateCoord.x = onCompleteCoord;
        CreateTween(toCoord, newDuration, true);
    });

}

function CreateTween(toCoord, duration, infinity)
{
    tweenRails = new TWEEN.Tween(translateCoord);
    tweenRails.to(toCoord, duration);
    tweenRails.onUpdate(function (progress) {
        railsProgress = SetRailsTranslate3D(translateCoord.x);
    }); 

    if (infinity)
    {
        tweenRails.repeat(Infinity);
    }

    tweenRails.start();
}

function SetRailsTranslate3D(translateX)
{
    $(railsItemsWrapper).css('transform', `translate3d(${translateX}%, 0, 0)`);
    return Math.abs(translateX / 100);
}

function SetTouchDirection(e) // Функция вызывается для event'а touchmove
{
    isScrolling = true;
        
    // Получаем координаты конца свайпа и вычисляем направление свайпа
    let endTouch = e.changedTouches[0];
    let touchDirection = endTouch.screenY - startTouch.screenY;
    
    if (touchDirection > 0 && moveDown == true)
    {
        moveDown = false;
        ChangeTweenDirection(moveDown)
    }
    else if (touchDirection < 0 && moveDown == false)
    {
        moveDown = true;
        ChangeTweenDirection(moveDown)
    }

    if (!isFast)
    {
        ChangeTweenDirection(moveDown, tweenFastDuration);
        isFast = true;
    }
}

$(window).on('scroll', function (e) {
    isScrolling = true;
    window.clearTimeout(checkScroll);
    checkScroll = setTimeout(function() {
        isScrolling = false;
        ChangeTweenDirection(moveDown);
        isFast = false;
    }, 60)
})

$(window).on('touchstart', function(e) {
    startTouch = e.changedTouches[0];
});
