// Скрипты для внутренних страниц

$(document).ready(Core)

function Core()
{
    SetNavbarMenu();
    SetCursor();
    SetInputForms();
}

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

    $("a, button, input").on(
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

function SetInputForms()
{
    $('.input-form input').on('focus', function() {
        $(this).siblings('label').addClass('active');
    });

    $('.input-form input').on('focusout', function() {
        $(this).siblings('label').removeClass('active');
    })
}