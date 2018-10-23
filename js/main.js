$(function() {
	initApp();
})


$('#berufs-select').on('change', function() {
	var beruf_id = $('#berufs-select').val();
	getKlassen(beruf_id);
})

$('#klasse-select').on('change', function() {
	var klasse_id = $('#klasse-select').val();
	getTafel(klasse_id);
})


function getBerufe() {
	$.getJSON("http://sandbox.gibm.ch/berufe.php")
		.done(function(data) {
			$('#berufs-select').empty();
			$('#berufs-select').append('<option selected disabled>Bitte Berufsgruppe auswählen...</option>')
			$.each(data, function(key, val) {
				$('#berufs-select').append("<option value=" + val.beruf_id + ">" + val.beruf_name + "</option>");
			})		
		})
		.fail(function(data) {
			console.log(data)
		});
}

function getKlassen(beruf_id) {
	$.getJSON("http://sandbox.gibm.ch/klassen.php?beruf_id=" + beruf_id)
		.done(function(data) {
			$('#klasse-select').empty();
			$('#klasse-select').append('<option selected disabled>Bitte Klasse auswählen...</option>')
			$.each(data, function(key, val) {
				$('#klasse-select').append("<option value=" + val.klasse_id + ">" + val.klasse_longname + "</option>");
			})
			$('#klasse-gruppe').show();	
		})
		.fail(function(data) {
			console.log(data)
		});
}

function getTafel(klasse_id) {
	$.getJSON("http://sandbox.gibm.ch/tafel.php?klasse_id=" + klasse_id)
		.done(function(data) {
			$.each(data, function(key, val) {
				console.log(val)
				$('table tbody').append('<tr><td>' + val.tafel_datum +'</td></tr>')
			})
			$('#stundenplan').show();
		})
		.fail(function(data) {
			console.log(data)
		});
}

function initApp() {
	$('#stundenplan').hide();
	$('#klasse-gruppe').hide();
	getBerufe();
}
