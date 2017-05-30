$(document).ready(function() {
	var currentView = 'newsfeed';
  $('#' + currentView).css('display', 'flex');

	$('#circle div').click(function() {
		$('#' + currentView).hide();
		currentView = $(this).attr('id').match(/(.*)\-button/)[1];
		$('#' + currentView).css('display', 'flex');
	});

  var months = [];
  var monthNames = [
    'January',   'February', 'March',    'April', 
    'May',       'June',     'July',     'August', 
    'September', 'October',  'November', 'December'
  ];

  $.get('newsfeed/', function(data) {
    $($.parseHTML(data)).find('a').toArray().map(function(a) {
      return new Date(a.text.match(/(.*)\.md/)[1]);
    }).sort(function(a, b) { 
      return b - a;
    }).forEach(function(timestamp) {
      var month = timestamp.getMonth() + 1;
      var day   = timestamp.getDate();
      var year  = timestamp.getFullYear();
      var filename = month + '-' + day + '-' + year + '.md';

      var uniqueMonth = monthNames[month - 1] + ' ' + year;
      if (!months.includes(uniqueMonth)) {
        months.push(uniqueMonth);
        $('#newsfeed-filter-options')
          .append('<div data-month="' + month + '" data-year="' + year + '">' 
            + uniqueMonth + '</div>');
      }

      $.get('newsfeed/' + filename, function(markdownText) {
        renderArticle(month, year, timestamp.toDateString(), markdownText);
      })
    })
  });

  var currentDateFilter = 0;

  $(document).on('click', '#newsfeed-filter-options div', function() {
    var selectedIndex = $(this).index();

    currentDateFilter = selectedIndex;
    $('#newsfeed-filter-options .selected').removeClass('selected');
    $(this).addClass('selected');

    if (selectedIndex == 0) {
      $('#newsfeed-list .article').fadeIn('fast');
    } else {
      var month = $(this).data('month');
      var year  = $(this).data('year');

      $('#newsfeed-list .article').fadeOut('fast');
      $('#newsfeed-list .article.m-' + month + '.y-' + year).fadeIn('fast');
    }
  })
});

function renderArticle(month, year, timestamp, content) {
  $('#newsfeed-list').append('<div class="article m-' + month + ' y-' + year + '">' + 
    markdown.toHTML(content) + '<div class="timestamp">' + timestamp + '</div></div>');
}
