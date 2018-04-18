/**
 * Questo file JavaScript ospita tutti i controller relativi alla gestione dei gadget.
 */

// Variabili utili
var IDFormRicercaGadget = 'formCercaGadget';
var IDBoxNotificheRicercaGadget = 'boxNotificheRicercaGadget';
var IDBoxNotificheGadget = 'boxNotifiche';

var IDBoxErroreGadgetInviati = 'boxErroriGadgetInviati';
var IDBoxErroreGadgetInviatiModale = 'boxErroriGadgetInviatiModale';
var IDBoxInfoGadgetInviati = 'boxInfoGadgetInviati';
var IDHeaderPannelloGadgetInviati = 'headerPannelloGadgetInviati';
var IDBodyPannelloGadgetInviati = 'bodyPannelloGadgetInviati';
var IDModaleConfermaEliminazioneGadgetInviato = 'modaleConfermaEliminazioneGadgetInviato';
var IDModaleAggiungiGadgetInviato = 'modaleAggiungiGadgetInviato';

var chiaveStorageGadget = 'gadget';
var chiaveStorageGadgets = 'gadgets';

var chiaveStorageMostraGadgetInviati = 'mostraGadgetInviati';
var chiaveStorageCaricamentoGadgetInviati = 'gadgetInviatiCaricatiPerGadget';
var chiaveStorageGadgetInviati = 'gadgetInviati';

var pathSchedaGadget = '/schedaGadget';

/**
 * Classe di oggetti che rappresenta un gadget.
 */
function Gadget(nome, descrizione) {
	this.nome = nome,
	this.descrizione = descrizione
}

/**
 * Classe di oggetti che rappresenta un invio di un gadget.
 */
function GadgetInviato(azienda, gadget, quantita, dataInvio, note) {
	this.azienda = azienda,
	this.gadget = gadget,
	this.quantita = quantita,
	this.dataInvio = dataInvio,
	this.note = note
}

/**
 * Classe di oggetti che rappresenta un invio di un gadget, viene usata sulle risposte del server.
 */
function GadgetInviatoServer(item) {
	this.id = item.id,
	this.azienda = item.azienda,
	this.gadget = item.gadget,
	this.quantita = item.quantita,
	this.dataInvio = new Date(item.dataInvio),
	this.note = item.note
}

ltcApp.controller('nuovoGadgetController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/nuovoGadget');
	
	$scope.salva = function() {
		//Creo l'oggetto da passare per l'inserimento.
		var gadget = new Gadget($scope.nome, $scope.descrizione);
		//Imposto i parametri della chiamata
		var funzioneOk = function(data) {
			$scope.visualizzaDettaglio(data, chiaveStorageGadget, pathSchedaGadget);
		};
		var params = new ParametriChiamata(contextPath + wsGadget, gadget, funzioneOk);
		params.statusCodeSuccesso = 201;
		//Eseguo la richiesta di inserimento
		$scope.chiamataPost(params);
	}
	
});

ltcApp.controller('cercaGadgetController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/cercaGadget');
		
	mostraElemento(IDFormRicercaGadget);
	
	//Controllo se ho già in memoria una ricerca precedente.
	var gadgets = sessionStorage.getItem(chiaveStorageGadgets);
	if (gadgets == "undefined" || gadgets == undefined || gadgets == null) {
		$scope.gadgets = [];
	} else {
		$scope.gadgets = JSON.parse(gadgets);
	}
	
	$scope.cerca = function() {
		//Condizioni di ricerca
		var filtro = { testo : $scope.testo };
		//Imposto i parametri della chiamata
		var funzioneOk = function(data) {
			$scope.gadgets = data;
			sessionStorage.setItem(chiaveStorageGadgets, JSON.stringify(data));
			//Se non sono state trovate aziende mostro il messaggio di consiglio.
			if (data.length == 0)
				mostraMessaggio(messaggioNessunRisultato, IDBoxNotificheRicercaGadget);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaGadget, filtro, funzioneOk);
		params.IDInfo = IDBoxNotificheRicercaGadget;
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	}
	
});

ltcApp.controller('schedaGadgetController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/schedaGadget');

	//Recupero i dati
	$scope.gadget = JSON.parse(sessionStorage.getItem(chiaveStorageGadget));
	
	$scope.salva = function() {
		//Creo l'oggetto da passare per l'inserimento e ne valorizzo l'ID.
		var gadget = new Gadget($scope.gadget.nome, $scope.gadget.descrizione);
		gadget.id = $scope.gadget.id;
		var funzioneOk = function(data) {
			//Salvo la risposta in locale come azienda selezionata 
			sessionStorage.setItem(chiaveStorageGadget, JSON.stringify(data));
			//Notifico che la modifica è avvenuta con successo.
			mostraMessaggio(messaggioSalvataggioOk, IDBoxNotificheGadget);
		};
		var params = new ParametriChiamata(contextPath + wsGadget, gadget, funzioneOk);
		//Eseguo la richiesta di aggiornamento
		$scope.chiamataPut(params);
	}
	
});

ltcApp.controller('pannelloGadgetInviatiController', function($scope, $http, $location, $filter) {
	
	$scope.gadget = JSON.parse(sessionStorage.getItem(chiaveStorageGadget));
	$scope.gadgetInviatoSelezionato = undefined;
	$scope.aziendaSelezionata = undefined;
	
	//Funzioni per il recupero delle informazioni addizionali sui contatti.
	sessionStorage.setItem(chiaveStorageMostraGadgetInviati, 'false');
	sessionStorage.setItem(chiaveStorageCaricamentoGadgetInviati, 'false');
	$scope.gadgetInviati = [];
	$scope.aziendePerGadgetInviato = [];
	
	$scope.caricaGadgetInviati = function() {
		//Se non ho ancora caricato i gadget inviati li carico
		var url = contextPath + wsGadgetInviatiPerGadget + $scope.gadget.id;
		var funzioneOk = function(data) {
			var gadgetInviati = [];
			for (var index = 0; index < data.length; index++) {
				var gadget = new GadgetInviatoServer(data[index]);
				gadgetInviati.push(gadget);
			}
			$scope.gadgetInviati = gadgetInviati;
			sessionStorage.setItem(chiaveStorageGadgetInviati, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoGadgetInviati, 'true');
		};
		var params = new ParametriChiamata(url, undefined, funzioneOk);
		params.IDLoading = IDHeaderPannelloGadgetInviati;
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.getItem(chiaveStorageMostraGadgetInviati) == 'true') {
			sessionStorage.setItem(chiaveStorageMostraGadgetInviati, 'false');
			$("#" + IDBodyPannelloGadgetInviati).collapse('hide');
		} else {
			sessionStorage.setItem(chiaveStorageMostraGadgetInviati, 'true');
			$("#" + IDBodyPannelloGadgetInviati).collapse('show');
		}
	}
	
	$scope.cercaAzienda = function() {
		var filtro = {
			testo : $scope.nomeAzienda
		};
		var funzioneOk = function(data) { 
			$scope.aziendePerGadgetInviato = data;
			sessionStorage.setItem('aziendePerGadgetInviato', JSON.stringify(data));
			sessionStorage.setItem('ricercaaziendePerGadgetInviato', 'false');
			//Se non sono state trovate aziende mostro il messaggio di consiglio.
			if (data.length == 0)
				mostraMessaggio(messaggioNessunRisultato, IDBoxErroreGadgetInviatiModale);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaAzienda, filtro, funzioneOk);
		params.IDError = IDBoxErroreGadgetInviatiModale;
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	}
	
	$scope.selezionaAzienda = function(azienda) {
		$scope.aziendaSelezionata = azienda;
	};
	
	$scope.aggiungiGadgetInviato = function() {
		//Controllo che siano stati inseriti i dati necessari.
		if ($scope.aziendaSelezionata == undefined || $scope.quantita == undefined || $scope.quantita < 1 || $scope.dataInvio == undefined) {
			//Notifico l'utente che la selezione è obbligatoria.
			mostraMessaggio("E' necessario specificare un'azienda, la quantita' e la data di invio!", IDBoxErroreGadgetInviatiModale);
		} else {
			//Procedo con l'inserimento.
			var gadgetInviato = new GadgetInviato($scope.aziendaSelezionata.id, $scope.gadget.id, $scope.quantita, $scope.dataInvio, $scope.note);
			var funzioneOk = function(data) {
				var gadget = new GadgetInviatoServer(data);
				$scope.gadgetInviati.unshift(gadget);
				sessionStorage.setItem(chiaveStorageNotePerAzienda, JSON.stringify($scope.note));
				//Chiudo il modale e mostro il messaggio di notifica.
				chiudiModale(IDModaleAggiungiGadgetInviato);
				mostraMessaggio('Invio dei gadget inserito!', IDBoxInfoGadgetInviati);
			};
			var params = new ParametriChiamata(contextPath + wsGadgetInviati, gadgetInviato, funzioneOk);
			params.statusCodeSuccesso = 201;
			params.IDError = IDBoxErroreGadgetInviatiModale;
			$scope.chiamataPost(params);
		}
	};
	
});

ltcApp.controller('pannelloGadgetInviatoController', function($scope, $http, $location, $filter) {
	
	$scope.resetMessaggi = function() {
		$scope.mostraInfoGadgetInviato = false;
		$scope.mostraErroreGadgetInviato = false;
		$scope.messaggioInfo = '';
		$scope.messaggioErrore = '';
	}
	
	$scope.resetMessaggi();
	
	$scope.aggiornaGadgetInviato = function() {		
		$scope.resetMessaggi();
		var funzioneOk = function(data) {
			$scope.messaggioInfo = 'Dati salvati con successo!';
			$scope.mostraInfoGadgetInviato = true;
		};
		var funzioneErrore = function(response) { 
			$scope.messaggioErrore = readErrorMessage(response);
			$scope.mostraErroreGadgetInviato = true;
		};
		var params = new ParametriChiamata(contextPath + wsGadgetInviati, $scope.gadgetInviato, funzioneOk);
		params.errore = funzioneErrore;
		$scope.chiamataPut(params);
	};
	
	$scope.mostraConfermaEliminazioneGadgetInviato = function() {
		//Mostro un messaggio di conferma, se Ok procedo con l'eliminazione.
		$("#" + IDModaleConfermaEliminazioneGadgetInviato + $scope.gadgetInviato.id).modal("show");
	}
	
	$scope.eliminaGadgetInviato = function() {
		chiudiModale(IDModaleConfermaEliminazioneGadgetInviato + $scope.gadgetInviato.id);
		$scope.resetMessaggi();
		var funzioneOk = function(data) {
			var index = -1;
			for (var i = 0; i < $scope.gadgetInviati.length; i++) {
				if (data.id == $scope.gadgetInviati[i].id) {
					index = i;
				}
			}
			if (index != -1) {
				$scope.gadgetInviati.splice(index, 1);
				sessionStorage.setItem(chiaveStorageGadgetInviati, JSON.stringify($scope.gadgetInviati));
				mostraMessaggio('Eliminato!', IDBoxInfoGadgetInviati);
			} else {
				console.log('Warning: Invio gadget non trovato.')
			}
		};
		var params = new ParametriChiamata(contextPath + wsGadgetInviati, $scope.gadgetInviato, funzioneOk);
		params.IDError = IDBoxErroreGadgetInviati;
		$scope.chiamataDelete(params);
	}
	
});