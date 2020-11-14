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

