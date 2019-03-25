/**
 * Questo file JavaScript ospita tutti i controller relativi alla gestione dei contatti.
 */

// Variabili utili
var IDFormRicercaContatto = 'formCercaContatto';
var IDBoxNotificheRicercaContatto = 'boxNotificheRicercaContatto';
var IDBoxNotificheContatto = 'boxNotifiche';

var IDBoxErroreAssociazioneContattoAziende = 'boxErroriAssociazioneCA';
var IDBoxInfoAssociazioneContattoAziende = 'boxInfoAssociazioneCA';
var IDHeaderPannelloAziende = 'headerPannelloAziende';
var IDPannelloContattoAziende = 'pannelloContattoAziende';
var IDModaleConfermaEliminazioneAssociazioneAzienda = 'modaleConfermaEliminazioneAssociazioneAzienda';
var IDModaleAggiungiAzienda = 'modaleAggiungiAzienda';

var IDBoxErroreRecapito = 'boxErroriRecapito';
var IDBoxInfoRecapito = 'boxInfoContattoRecapiti';
var IDHeaderPannelloRecapiti = 'headerPannelloContattoRecapiti';
var IDPannelloContattoRecapiti = 'pannelloAziendaContattoRecapiti';
var IDModaleConfermaEliminazioneRecapito = 'modaleConfermaEliminazioneRecapito';
var IDModaleAggiungiRecapito = 'modaleAggiungiRecapito';

var chiaveStorageContatto = 'contatto';
var chiaveStorageContatti = 'contatti';

var chiaveStorageMostraAziendePerContatto = 'mostraAziendePerContatto';
var chiaveStorageCaricamentoAziendePerContatto = 'aziendeCaricatePerContatto';
var chiaveStorageAziendePerContatti = 'contattoAziende';

var chiaveStorageMostraRecapitiPerContatto = 'mostraRecapitiPerContatto';
var chiaveStorageCaricamentoRecapitiPerContatto = 'recapitiCaricatiPerContatto';
var chiaveStorageRecapitiPerContatto = 'contattoRecapiti';

var chiaveStorageMostraIndirizzoContatto = 'mostraIndirizzoContatto';
var chiaveStorageCaricamentoIndirizzoContatto = 'IndirizzoContattoCaricato';
var chiaveStorageIndirizzoContatto = 'contattoIndirizzoContatto';

var pathSchedaContatto = '/schedaContatto';

var IDHeaderPannelloContattoIndirizzo = 'headerPannelloContattoIndirizzo';
var IDPannelloContattoIndirizzo = 'pannelloContattoIndirizzo';

/**
 * Classe di oggetti che rappresenta un contatto.
 */
function Contatto(nome, cognome, ruolo, descrizione) {
	this.nome = nome,
	this.cognome = cognome,
	this.ruolo = ruolo,
	this.descrizione = descrizione
}

/**
 * Classe di oggetti che rappresenta un recapito per un contatto.
 */
function Recapito(contatto, tipo, recapito) {
	this.contatto = contatto,
	this.tipo = tipo,
	this.recapito = recapito
}

ltcApp.controller('nuovoContattoController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/nuovoContatto');
	
	$scope.salva = function() {
		//Creo l'oggetto da passare per l'inserimento.
		var contatto = new Contatto($scope.nome, $scope.cognome, $scope.ruolo, $scope.descrizione);
		//Imposto i parametri della chiamata
		var funzioneOk = function(data) {
			$scope.visualizzaDettaglio(data, chiaveStorageContatto, pathSchedaContatto);
		};
		var params = new ParametriChiamata(contextPath + wsContatto, contatto, funzioneOk);
		params.statusCodeSuccesso = 201;
		//Eseguo la richiesta di inserimento
		$scope.chiamataPost(params);
	}
	
});

ltcApp.controller('cercaContattoController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/cercaContatto');
		
	mostraElemento(IDFormRicercaContatto);
	
	//Controllo se ho già in memoria una ricerca precedente.
	var contatti = sessionStorage.getItem(chiaveStorageContatti);
	if (contatti == "undefined" || contatti == undefined || contatti == null) {
		$scope.contatti = [];
	} else {
		$scope.contatti = JSON.parse(contatti);
	}
	
	$scope.cerca = function() {
		//Condizioni di ricerca
		var filtro = { testo : $scope.testo };
		//Imposto i parametri della chiamata
		var funzioneOk = function(data) {
			$scope.contatti = data;
			sessionStorage.setItem(chiaveStorageContatti, JSON.stringify(data));
			//Se non sono state trovate aziende mostro il messaggio di consiglio.
			if (data.length == 0)
				mostraMessaggio(messaggioNessunRisultato, IDBoxNotificheRicercaContatto);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaContatto, filtro, funzioneOk);
		params.IDInfo = IDBoxNotificheRicercaContatto;
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	}
	
});

ltcApp.controller('schedaContattoController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/schedaContatto');

	//Recupero i dati
	$scope.contatto = JSON.parse(sessionStorage.getItem(chiaveStorageContatto));
	
	$scope.salva = function() {
		//Creo l'oggetto da passare per l'inserimento e ne valorizzo l'ID.
		var contatto = new Contatto($scope.contatto.nome, $scope.contatto.cognome, $scope.contatto.ruolo, $scope.contatto.descrizione);
		contatto.id = $scope.contatto.id;
		var funzioneOk = function(data) {
			//Salvo la risposta in locale come azienda selezionata 
			sessionStorage.setItem(chiaveStorageContatto, JSON.stringify(data));
			//Notifico che la modifica è avvenuta con successo.
			mostraMessaggio(messaggioSalvataggioOk, IDBoxNotificheContatto);
		};
		var params = new ParametriChiamata(contextPath + wsContatto, contatto, funzioneOk);
		//Eseguo la richiesta di aggiornamento
		$scope.chiamataPut(params);
	}
	
});

ltcApp.controller('pannelloContattoAziendeController', function($scope, $http, $location, $filter) {
	
	$scope.contatto = JSON.parse(sessionStorage.getItem(chiaveStorageContatto));
	$scope.aziendaSelezionata = undefined;
	
	//Funzioni per il recupero delle informazioni addizionali sui contatti.
	sessionStorage.setItem(chiaveStorageMostraAziendePerContatto, 'false');
	sessionStorage.setItem(chiaveStorageCaricamentoAziendePerContatto, 'false');
	$scope.contattoAziende = [];
	
	$scope.caricaAziende = function() {
		//Se non ho ancora caricato i contatti li carico
		var url = contextPath + wsAzienda + '/contatto/' + $scope.contatto.id;
		var funzioneOk = function(data) {
			$scope.contattoAziende = data;
			sessionStorage.setItem(chiaveStorageAziendePerContatti, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoAziendePerContatto, 'true');
		};
		var params = new ParametriChiamata(url, undefined, funzioneOk);
		params.IDLoading = IDHeaderPannelloAziende;
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.getItem(chiaveStorageMostraAziendePerContatto) == 'true') {
			sessionStorage.setItem(chiaveStorageMostraAziendePerContatto, 'false');
			$("#" + IDPannelloContattoAziende).collapse('hide');
		} else {
			sessionStorage.setItem(chiaveStorageMostraAziendePerContatto, 'true');
			$("#" + IDPannelloContattoAziende).collapse('show');
		}
	}
	
	$scope.mostraConfermaEliminazione = function(azienda) {
		//Memorizzo la selezione.
		$scope.aziendaSelezionata = azienda;
		//Mostro un messaggio di conferma, se Ok procedo con l'eliminazione.
		$("#" + IDModaleConfermaEliminazioneAssociazioneAzienda).modal("show");
	}
	
	$scope.eliminaAssociazione = function() {
		var associazioneAziendaContatto = {
			azienda : $scope.aziendaSelezionata.id,
			contatto : $scope.contatto.id
		};
		var funzioneOk = function() {
			//Indico che i contatti debbano essere ricaricati
			sessionStorage.setItem(chiaveStorageCaricamentoAziendePerContatto, 'false');
			sessionStorage.setItem(chiaveStorageMostraAziendePerContatto, 'false');
			$("#" + IDPannelloContattoAziende).collapse('hide');
			//Notifico che l'eliminazione è avvenuta con successo.
			mostraMessaggio(messaggioEliminazioneOk, IDBoxInfoAssociazioneContattoAziende);
		};
		var params = new ParametriChiamata(contextPath + wsAssociazioneAziendaContatto, associazioneAziendaContatto, funzioneOk);
		params.IDError = IDBoxErroreAssociazioneContattoAziende;
		params.IDInfo = IDBoxInfoAssociazioneContattoAziende;
		$scope.chiamataDelete(params);
	}
	
	$scope.associa = function(azienda) {
		var associazioneAziendaContatto = {
			azienda : azienda.id,
			contatto : $scope.contatto.id
		};
		var funzioneOk = function() {
			$("#" + IDModaleAggiungiAzienda).modal("hide");
			//Indico che i contatti debbano essere ricaricati
			sessionStorage.setItem(chiaveStorageCaricamentoAziendePerContatto, 'false');
			sessionStorage.setItem(chiaveStorageMostraAziendePerContatto, 'false');
			$("#" + IDPannelloContattoAziende).collapse('hide');
			mostraMessaggio(messaggioSalvataggioOk, IDBoxInfoAssociazioneContattoAziende);
		};
		var params = new ParametriChiamata(contextPath + wsAssociazioneAziendaContatto, associazioneAziendaContatto, funzioneOk);
		params.statusCodeSuccesso = 201;
		params.IDError = IDBoxErroreAssociazioneContattoAziende;
		params.IDInfo = IDBoxInfoAssociazioneContattoAziende;
		$scope.chiamataPost(params);
	}
	
	$scope.aziende = [];
	
	$scope.cerca = function() {
		var filtro = {
			testo : $scope.testo
		};
		var funzioneOk = function(data) { 
			$scope.aziende = data;
			sessionStorage.setItem('associazioneAziendaContatti', JSON.stringify(data));
			sessionStorage.setItem('ricercaAssociazioneAziendaContatti', 'false');
			//Se non sono state trovate aziende mostro il messaggio di consiglio.
			if (data.length == 0)
				mostraMessaggio(messaggioNessunRisultato, IDBoxErroreAssociazioneContattoAziende);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaAzienda, filtro, funzioneOk);
		params.IDError = IDBoxErroreAssociazioneContattoAziende;
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	}
});

ltcApp.controller('pannelloContattoRecapitiController', function($scope, $http, $location, $filter) {
	
	$scope.contatto = JSON.parse(sessionStorage.getItem(chiaveStorageContatto));
	
	//Funzioni per il recupero delle informazioni addizionali sui contatti.
	sessionStorage.setItem(chiaveStorageMostraRecapitiPerContatto, 'false');
	sessionStorage.setItem(chiaveStorageCaricamentoRecapitiPerContatto, 'false');
	
	$scope.recapiti = [];
	$scope.recapitoSelezionato = undefined;
	
	$scope.caricaRecapiti = function() {
		//Se non ho ancora caricato i recapiti li carico
		var url = contextPath + wsRecapito + '/contatto/' + $scope.contatto.id;
		var funzioneOk = function(data) {
			$scope.recapiti = data;
			sessionStorage.setItem(chiaveStorageRecapitiPerContatto, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoRecapitiPerContatto, 'true');
		};
		var params = new ParametriChiamata(url, undefined, funzioneOk);
		params.IDLoading = IDHeaderPannelloRecapiti;
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.getItem(chiaveStorageMostraRecapitiPerContatto) == 'true') {
			sessionStorage.setItem(chiaveStorageMostraRecapitiPerContatto, 'false');
			$("#" + IDPannelloContattoRecapiti).collapse('hide');
		} else {
			sessionStorage.setItem(chiaveStorageMostraRecapitiPerContatto, 'true');
			$("#" + IDPannelloContattoRecapiti).collapse('show');
		}
	};
	
	$scope.mostraConfermaEliminazione = function(recapito) {
		//Memorizzo la selezione.
		$scope.recapitoSelezionato = recapito;
		console.log(recapito);
		//Mostro un messaggio di conferma, se Ok procedo con l'eliminazione.
		$("#" + IDModaleConfermaEliminazioneRecapito).modal("show");
	};
	
	$scope.elimina = function() {
		var recapito = new Recapito($scope.contatto.id, $scope.tipo, $scope.recapito);
		recapito.id = $scope.recapitoSelezionato.id;
		var funzioneOk = function() {
			//Indico che i contatti debbano essere ricaricati
			sessionStorage.setItem(chiaveStorageCaricamentoRecapitiPerContatto, 'false');
			sessionStorage.setItem(chiaveStorageMostraRecapitiPerContatto, 'false');
			$("#" + IDPannelloContattoRecapiti).collapse('hide');
			//Notifico che l'eliminazione è avvenuta con successo.
			mostraMessaggio(messaggioEliminazioneOk, IDBoxInfoRecapito);
		};
		var params = new ParametriChiamata(contextPath + wsRecapito, recapito, funzioneOk);
		params.IDError = IDBoxErroreRecapito;
		params.IDInfo = IDBoxInfoRecapito;
		$scope.chiamataDelete(params);
	};
	
	$scope.aggiungi = function() {
		var recapito = new Recapito($scope.contatto.id, $scope.tipo, $scope.recapito);
		var funzioneOk = function() {
			$("#" + IDModaleAggiungiRecapito).modal("hide");
			//Indico che i contatti debbano essere ricaricati
			sessionStorage.setItem(chiaveStorageCaricamentoRecapitiPerContatto, 'false');
			sessionStorage.setItem(chiaveStorageMostraRecapitiPerContatto, 'false');
			$("#" + IDPannelloContattoRecapiti).collapse('hide');
			mostraMessaggio(messaggioSalvataggioOk, IDBoxInfoRecapito);
		};
		var params = new ParametriChiamata(contextPath + wsRecapito, recapito, funzioneOk);
		params.statusCodeSuccesso = 201;
		params.IDError = IDBoxErroreRecapito;
		params.IDInfo = IDBoxInfoRecapito;
		$scope.chiamataPost(params);
	};
	
});

ltcApp.controller('pannelloContattoIndirizzoController', function($scope, $http, $location, $filter) {
	
	$scope.contatto = JSON.parse(sessionStorage.getItem(chiaveStorageContatto));
	$scope.indirizzo = undefined; //JSON.parse(sessionStorage.getItem(chiaveStorageIndirizzoContatto));
	$scope.province = $scope.getProvince();
	$scope.nazioni = $scope.getNazioni();
	
	sessionStorage.setItem(chiaveStorageMostraIndirizzoContatto, 'false');
	sessionStorage.setItem(chiaveStorageCaricamentoIndirizzoContatto, 'false');
	
	$scope.caricaIndirizzo = function() {
		//Se l'azienda ha un indirizzo e non l'ho ancora caricato lo faccio ora.
		
		var url = contextPath + wsContattoIndirizzo + $scope.contatto.id;
		var funzioneOk = function(data) {
			$scope.indirizzo = data;
			sessionStorage.setItem(chiaveStorageIndirizzoContatto, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoIndirizzoContatto, 'true');
		};
		var okParziale = function(response) {
			//Mostro semplicemente l'indirizzo vuoto.
			console.log('(Warning) Nessun indirizzo trovato!')
			$scope.indirizzo = { ragioneSociale : '', indirizzo : '', localita : '', cap : '' };
		};
		var fallimento = function(response) {
			//Mostro semplicemente l'indirizzo vuoto.
			console.log('(Warning) Nessun indirizzo trovato!')
			$scope.indirizzo = { ragioneSociale : '', indirizzo : '', localita : '', cap : '' };
		};
		var params = new ParametriChiamata(url, undefined, funzioneOk);
		params.fallimento = fallimento;
		params.okParziale = okParziale;
		params.IDLoading = IDHeaderPannelloContattoIndirizzo;
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.getItem(chiaveStorageMostraIndirizzoContatto) == 'true') {
			sessionStorage.setItem(chiaveStorageMostraIndirizzoContatto, 'false');
			$("#" + IDPannelloContattoIndirizzo).collapse('hide');
		} else {
			sessionStorage.setItem(chiaveStorageMostraIndirizzoContatto, 'true');
			$("#" + IDPannelloContattoIndirizzo).collapse('show');
		}
	};
	
	$scope.salva = function() {
		var url = contextPath + wsContattoIndirizzo + $scope.contatto.id;
		var funzioneOk = function(data) {
			$scope.indirizzo = data;
			$scope.contatto.indirizzo = $scope.indirizzo.id;
			sessionStorage.setItem(chiaveStorageContatto, JSON.stringify($scope.contatto));
			sessionStorage.setItem(chiaveStorageIndirizzoContatto, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoIndirizzoContatto, 'true');
			//Notifico che la modifica è avvenuta con successo.
			mostraMessaggio(messaggioSalvataggioOk, 'boxInfoContattoIndirizzo');
		};
		var params = new ParametriChiamata(url, $scope.indirizzo, funzioneOk);
		params.IDInfo = 'boxInfoContattoIndirizzo';
		params.IDLoading = 'bottoneSalvaIndirizzo';
		params.IDError = 'boxInfoContattoIndirizzo';
		params.statusCodeSuccesso = 201;
		$scope.chiamataPost(params);
	};
	
});