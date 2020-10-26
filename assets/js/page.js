// Скрипты для внутренних страниц
let textArray = [
    //'если вам жарко',
    'если у вас есть водительские права',
    //'если вам просто любопытно',
    //'если это читаете',
    'если вы выпили слишком много текилы'
];

let lineIndex = 0;
let symbolIndex = 0;
let typing = true;
let typingPause = false;

$(document).ready(Core)

function Core()
{
    // Инициализация WOW.JS 
    let wow = new WOW({
        animateClass: 'animate__animated',
    })
    wow.init();

    SetNavbarMenu();
    SetCursor();
    SetInputForms();
    SetTypingText();
    SetSpincrement();
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

function SetTypingText()
{
    let intervalTyping = setInterval(function () {
        
        let textCount = textArray.length;
        let typingText = $('.typing-text').text();
        let htmlTextLength = $('.typing-text').text().length;

        if (lineIndex + 1 > textCount) {lineIndex = 0}

        let textLineLength = textArray[lineIndex].length;

        if (typing)
        {
            typingText = typingText + textArray[lineIndex][symbolIndex];
            $('.typing-text').text(typingText);
    
            symbolIndex++;
            
            if (textLineLength - 1  < symbolIndex) { lineIndex++; symbolIndex = 0; typing = false; typingPause = true;}
        }
        else
        {
            if (typingPause == true) {setTimeout(function() {typingPause = false;}, 1000); return}
            if (htmlTextLength == 0)
            {
                typing = true;
            }
            else
            {
                let htmlText = $('.typing-text').text().substring(0, htmlTextLength - 1);
                $('.typing-text').text(htmlText)
            }
        }
    }, 100)
}

function SetSpincrement()
{
    $('.numbers-wrapper .number-item').spincrement({
        duration: 2000
    })
}