$(document).ready(function() {
  var views = ['home', 'newsfeed', 'portfolio', 'about'];
	var currentView = 'home';
  var currentDateFilter = 0;

  $('#' + currentView).css('display', 'flex');
  
  loadNewsfeed();

  $('#circle .circle-sector').click(function() {
    $('#' + currentView).hide();
    currentView = $(this).attr('id').match(/(.*)\-button/)[1];
    $('#' + currentView).css('display', 'flex');
  });

  $(document).on('click', '#newsfeed-filter-options div', function() {
    var selectedIndex = $(this).index();

    currentDateFilter = selectedIndex;
    $('#newsfeed-filter-options .selected').removeClass('selected');
    $(this).addClass('selected');

    if (selectedIndex == 0) {
      $('#newsfeed-list .article').show();
    } else {
      var month = $(this).data('month');
      var year  = $(this).data('year');

      $('#newsfeed-list .article').hide();
      $('#newsfeed-list .article.m-' + month + '.y-' + year).show();
    }
  })
});

function loadNewsfeed() {
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
}

function renderArticle(month, year, timestamp, content) {
  var parsedContent = marked(content);
  var outer = '<div class="article m-' + month + ' y-' + year + '"></div>';
  var inner = parsedContent + '<div class="timestamp">' + timestamp + '</div>';

  $(outer).html(inner).appendTo('#newsfeed-list');
}
