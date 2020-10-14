let keys = {37: 1, 38: 1, 39: 1, 40: 1}; // Коды стрелок на клавиатуре

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;

try 
{
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () 
      { 
        supportsPassive = true; 
      } 
  }));
} 
catch(e) {}

let wheelOpt = supportsPassive ? { passive: false } : false;
let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

let moveDown = false // false => move up; true => move down
let lastScrollTop = 0;
let startTouch = null;
let blockTransition = false;

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

// call this to Disable
function DisableScroll() 
{
  window.addEventListener('DOMMouseScroll', PreventDefaultForScroll, false); // older FF
  window.addEventListener(wheelEvent, PreventDefaultForScroll, wheelOpt); // modern desktop
  window.addEventListener('touchmove', PreventDefaultForTouch, wheelOpt); // mobile
  window.addEventListener('keydown', PreventDefaultForScrollKeys, false);
}

// call this to Enable
function EnableScroll() 
{
  window.removeEventListener('DOMMouseScroll', PreventDefault, false);
  window.removeEventListener(wheelEvent, PreventDefault, wheelOpt); 
  window.removeEventListener('touchmove', PreventDefault, wheelOpt);
  window.removeEventListener('keydown', PreventDefaultForScrollKeys, false);
}



window.addEventListener('touchstart', function(e) {
    startTouch = e.changedTouches[0];
});


window.addEventListener('touchend', function(e) {
  let endTouch = e.changedTouches[0];

  if(endTouch.screenY - startTouch.screenY > 0)
  {
    moveDown = false;
  }
  else if(endTouch.screenY - startTouch.screenY < 0)
  {
    moveDown = true;
  }
});

function ScrollHandler()
{
  let screenIndex = parseInt(window.scrollY / window.innerHeight);
  let arrayScreens = document.querySelectorAll('.screen');
  let scrollTop;
  
  if (screenIndex + 1 >= arrayScreens.length && moveDown == true)
  {
    return;
  }

  if (screenIndex == 0 && moveDown == false)
  {
    return;
  }

  if (blockTransition)
  {
    return;
  }

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
  })

  blockTransition = true;
  setTimeout(UnblockTransition, 500);
}

function UnblockTransition()
{
  blockTransition = false;
}

window.addEventListener( 'resize', function() {
  let screenIndex = parseInt(window.scrollY / window.innerHeight);
  let arrayScreens = document.querySelectorAll('.screen');
  let scrollTop;

  scrollTop = arrayScreens[screenIndex].offsetTop;

  window.scrollTo({
    top: scrollTop,
    left: 0,
    behavior: 'smooth'
  })
}, false );