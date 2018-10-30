// Wochentage
const weekdays = [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

// Beruf und Klasse gespeichert aus Localstorage
var store_beruf_id = localStorage.getItem('beruf_id') || undefined
var store_klasse_id = localStorage.getItem('klasse_id') || undefined

// Date Object Funktion für die Wochennummer
Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
	var dayOfYear = ((today - onejan +1)/86400000);
	return Math.ceil(dayOfYear/7)
  }

// Aktuelles dargestelltes Datum
var date = new Date;

$(function() {
	initApp();
})

// On change listener für Berufs Select
$('#berufs-select').on('change', function() {
	$('#stundenplan').hide();
	let beruf_id = $('#berufs-select').val();
	localStorage.setItem('beruf_id', beruf_id);
	localStorage.setItem('klasse_id', '')
	getKlassen(beruf_id);
})


// On change listener für Klassen Select
$('#klasse-select').on('change', function() {
	let klasse_id = $('#klasse-select').val();
	localStorage.setItem('klasse_id', klasse_id);
	getTafel(klasse_id, date.getWeek(), date.getFullYear());
})

// On change listener für Nächste Woche Button
$('#next-week').on('click', function() {
	incrementWeek();
})

// On change listener für Letzte Woche Button
$('#prev-week').on('click', function() {
	decrementWeek();
})

// Holt alle Berufe und stellt sie in Select dar
function getBerufe() {
	$.getJSON("https://sandbox.gibm.ch/berufe.php")
		.done(function(data) {
			// Selectbox vorbereiten
			$('#berufs-select').empty();
			$('#berufs-select').append('<option selected disabled>Bitte Berufsgruppe auswählen...</option>');
			// Befüllen der Selectbox
			$.each(data, function(key, val) {
				$('#berufs-select').append("<option value=" + val.beruf_id + ">" + val.beruf_name + "</option>");
			})
			// Wenn Beruf von Localstorage schon gegeben ist
			if(store_beruf_id) {
				$('#berufs-select').val(store_beruf_id);
				getKlassen(store_beruf_id);
				store_beruf_id = undefined;
			}		
		})
		.fail(function(data) {
			console.log(data)
		});
}

// Holt alle Klassen des ausgewählten Berufs und stellt sie in Select dar
function getKlassen(beruf_id) {
	$.getJSON("https://sandbox.gibm.ch/klassen.php?beruf_id=" + beruf_id)
		.done(function(data) {
			// Selectbox vorbereiten
			$('#klasse-select').empty();
			$('#klasse-select').append('<option selected disabled>Bitte Klasse auswählen...</option>')
			// Befüllen der Selectbox
			$.each(data, function(key, val) {
				$('#klasse-select').append("<option value=" + val.klasse_id + ">" + val.klasse_longname + "</option>");
			})
			// Anzeige fals keine Klassen verfügbar
			if(data.length === 0) {
				$('#klasse-select').empty();
				$('#klasse-select').append('<option selected disabled>Keine Klasse verfügbar</option>')
			}
			$('#klasse-gruppe').fadeIn();
			// Wenn Klasse von Localstorage schon gegeben ist
			if(store_klasse_id) {
				$('#klasse-select').val(store_klasse_id);
				getTafel(store_klasse_id, date.getWeek(), date.getFullYear());
				store_klasse_id = undefined;
			}
		})
		.fail(function(data) {
			console.log(data)
		});
}

// Holt Stundenplan für ausgewählte Woche und stellt ihn in Tabelle dar.
function getTafel(klasse_id, week, year) {
	$.getJSON("https://sandbox.gibm.ch/tafel.php?klasse_id=" + klasse_id + "&woche=" + week + "-" + year)
		.done(function(data) {
			$('table tbody').empty();
			// Tabelle befüllen
			$.each(data, function(key, val) {
				$('table tbody').append('<tr><td>' + val.tafel_datum +'</td><td>' + weekdays[val.tafel_wochentag] +'</td><td>' + val.tafel_von +'</td> \
				<td>' + val.tafel_bis +'</td><td>' + val.tafel_lehrer +'</td><td>' + val.tafel_longfach +'</td><td>' + val.tafel_raum +'</td></tr>')
			})
			// Nachricht fals kein Stundenplan verfügar ist in dieser Woche
			if(data.length === 0) {
				$('table tbody').append('<tr><td class="table-warning" colspan="7">Es findet kein Unterricht in dieser Woche statt. Eventuell sind Schulferien.</td><tr>')
			}
			$('#stundenplan').fadeIn();
		})
		.fail(function(data) {
			console.log(data)
		});
}

// Updated das Label der Aktuellen Woche
function updateWeekLabel() {
	$('#curr-week').text(date.getFullYear() + ", " + date.getWeek())
}

// Holt die Stundenpläne der nächsten Woche
function incrementWeek() {
	$('#stundenplan').fadeOut();
	date.setDate(date.getDate()+7);
	updateWeekLabel();
	let klasse_id = $('#klasse-select').val();
	getTafel(klasse_id, date.getWeek(), date.getFullYear());
	$('#stundenplan').fadeIn();
}

// Holt die Stundenpläne der letzten Woche
function decrementWeek() {
	$('#stundenplan').fadeOut();
	date.setDate(date.getDate()-7);
	updateWeekLabel();
	let klasse_id = $('#klasse-select').val();
	getTafel(klasse_id, date.getWeek(), date.getFullYear());
	$('#stundenplan').fadeIn();
}

// Initialisiert die Applikation
function initApp() {
	$('#stundenplan').hide();
	$('#klasse-gruppe').hide();
	updateWeekLabel();
	getBerufe();
}
