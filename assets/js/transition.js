$(document).ready(function() {
    setTimeout(function() {
        $(".page-transition").addClass('animate__animated animate__slideOutUp')
    }, 500)

    $("a").click(function(event){
		event.preventDefault();
        linkLocation = this.href;
        $(".page-transition").removeClass('animate__slideOutUp')
        $(".page-transition").addClass('animate__slideInDown')
		setTimeout(() => window.location = linkLocation, 1000)
	});    
})