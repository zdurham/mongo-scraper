$(document).ready(function() {
  $('#scrape').on('click', function() {
    $.ajax({method: 'post', url: '/'})
  })
})