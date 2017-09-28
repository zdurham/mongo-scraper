$(document).ready(function() {
  $('.modal').modal();

  $(".add-comment").on('click', function(e) {
    e.preventDefault()

    let siteUrl = window.location.origin

    let url = siteUrl + $(this).attr('data-id')
    let comment = $('#body').val()

    $.ajax({
      url: url,
      type: 'POST',
      data: comment
    }).done(function() {
      location.reload();
    })
  })
})