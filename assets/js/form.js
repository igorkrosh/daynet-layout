$('#contacts-form input').on('input', function() {
    let value = $(this).val();

    if (value != "")
    {
        $(this).siblings('label').addClass('hidden')
    }
    else
    {
        $(this).siblings('label').removeClass('hidden')
    }
})


$('.btn-send-form').on('click', function () {
    let data = $('#contacts-form').serialize();
    
    $.ajax({
        type: "POST",    
        url: "mailer.php",    
        data: data    
      }).done(function() {
    
      });
      $('#contacts-form').find("input").val("");
      $('#contacts-form label').removeClass('hidden')
})
