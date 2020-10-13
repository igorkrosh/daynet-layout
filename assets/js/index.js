$(document).ready(function () {
    SetCursor();
    SetNavbarMenu();
    
    let wow = new WOW({
        animateClass: 'animate__animated'
    })
    wow.init();
    DisableScroll();
})

function SetCursor() {
    let initCursorHeight = $('.cursor .bg').height();
    let initCursotWidth = $('.cursor .bg').width();

    let animateOptions = {
        queue: false,
        duration: 200
    }
    
    $('body').mousemove(function(event) {
        $('.cursor').css('transform', `translate3d(${event.clientX}px, ${event.clientY}px, 0)`)
    })

    $('a, button').hover(function() {
        let itemHeight = $(this).height() * 1.5;
        $('.cursor .bg').animate({
            height: itemHeight + 'px',
            width: itemHeight + 'px'
        }, animateOptions)
    });

    $('a, button').mouseleave(function() {
        $('.cursor .bg').animate({
            height: initCursorHeight + 'px',
            width: initCursotWidth + 'px'
        }, animateOptions)
    });
}

function SetNavbarMenu() {
    let animateInClass = 'animate__slideInLeft';
    let animateOutClass = 'animate__slideOutLeft'

    $('.btn-menu').on('click', function () {
        if (!$('.navbar-menu').hasClass('animate__animated'))
        {
            $('.navbar-menu').addClass('animate__animated');
        }

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


$('.scroll-block button').on('click', function() {
    let screenIndex = parseInt(window.scrollY / window.innerHeight);
    let arrayScreens = $('.screen');

    let scrollTop = arrayScreens[screenIndex + 1].offsetTop;

    window.scrollTo({
        top: scrollTop,
        left: 0,
        behavior: 'smooth'
    })
})



