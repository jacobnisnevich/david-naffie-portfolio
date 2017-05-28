$(document).ready(function() {
	var currentView = 'home';

	$('#circle div').click(function() {
		$('#' + currentView).hide();
		currentView = $(this).attr('id').match(/(.*)\-button/)[1];
		$('#' + currentView).show();
	});
});