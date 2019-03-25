/**
 * Questo file JavaScript ospita tutti i controller relativi alla gestione delle aziende.
 */

// Variabili utili
var IDFormRicercaAzienda = 'formCercaAzienda';
var IDBoxNotificheRicercaAzienda = 'boxNotificheRicercaAziende';
var IDBoxNotificheAzienda = 'boxNotifiche';

var IDBoxErroreAssociazioneAziendaContatti = 'boxErroriAssociazioneAC';
var IDBoxInfoAssociazioneAziendaContatti = 'boxInfoAssociazioneAC';
var IDHeaderPannelloContatti = 'headerPannelloContatti';
var IDPannelloAziendaContatti = 'pannelloAziendaContatti';
var IDModaleConfermaEliminazioneAssociazioneContatto = 'modaleConfermaEliminazioneAssociazioneContatto';
var IDModaleAggiungiContatto = 'modaleAggiungiContatto';

var IDBoxErroreAssociazioneAziendaBrand = 'boxErroriAssociazioneAB';
var IDBoxInfoAssociazioneAziendaBrand = 'boxInfoAssociazioneAB';
var IDHeaderPannelloBrand = 'headerPannelloBrand';
var IDPannelloAziendaBrand = 'pannelloAziendaBrand';
var IDModaleConfermaEliminazioneAssociazioneBrand = 'modaleConfermaEliminazioneAssociazioneBrand';
var IDModaleAggiungiBrand = 'modaleAggiungiBrand';

var IDBoxErroreAziendaNota = 'boxErroriAN';
var IDBoxInfoAziendaNota = 'boxInfoAN';
var IDHeaderPannelloNote = 'headerPannelloNote';
var IDPannelloAziendaNote = 'pannelloAziendaNote';
var IDModaleConfermaAggiornamentoNota = 'modaleConfermaAggiornamentoNota';
var IDModaleConfermaEliminazioneNota = 'modaleConfermaEliminazioneNota';
var IDModaleAggiungiNota = 'modaleAggiungiNota';

var chiaveStorageAzienda = 'azienda';
var chiaveStorageAziende = 'aziende';

var chiaveStorageMostraTagServizi = 'mostraTagServizi';
var chiaveStorageCaricamentoTagServizi = 'tagServiziCaricati';
var chiaveStorageTagServiziPerAzienda = 'aziendaTagServizi';

var chiaveStorageMostraContatti = 'mostraContatti';
var chiaveStorageCaricamentoContatti = 'contattiCaricati';
var chiaveStorageContattiPerAzienda = 'aziendaContatti';

var chiaveStorageMostraBrand = 'mostraBrand';
var chiaveStorageCaricamentoBrand = 'brandCaricati';
var chiaveStorageBrandPerAzienda = 'aziendaBrand';

var chiaveStorageMostraIndirizzoAzienda = 'mostraIndirizzoAzienda';
var chiaveStorageCaricamentoIndirizzoAzienda = 'IndirizzoAziendaCaricati';
var chiaveStorageIndirizzoAzienda = 'aziendaIndirizzoAzienda';

var chiaveStorageMostraCategorieAzienda = 'mostraCategorieAzienda';
var chiaveStorageCaricamentoCategorieAzienda = 'CategorieAziendaCaricate';
var chiaveStorageCategorieAzienda = 'aziendaCategorieAzienda';

var chiaveStorageMostraServiziAzienda = 'mostraServiziAzienda';
var chiaveStorageCaricamentoServiziAzienda = 'serviziAziendaCaricati';
var chiaveStorageServiziAzienda = 'aziendaServiziAzienda';

var chiaveStorageMostraNote = 'mostraNote';
var chiaveStorageCaricamentoNote = 'noteCaricate';
var chiaveStorageNotePerAzienda = 'aziendaNote';

var pathSchedaAzienda = '/schedaAzienda';

var IDPannelloAziendaTagServizi = 'pannelloAziendaServizi';
var IDPannelloAziendaTagCategorie = 'pannelloAziendaCategorie';

var IDHeaderPannelloAziendaIndirizzo = 'headerPannelloIndirizzo';
var IDPannelloAziendaIndirizzo = 'pannelloAziendaIndirizzo';

/**
 * Classe di oggetti che rappresenta un'azienda.
 */
function Azienda(ragioneSociale, partitaIva, sitoWeb, email, telefono, inTrattiva, appetibile, tipoLogistica, valutazione, descrizione, indirizzo) {
	this.ragioneSociale = ragioneSociale;
	this.partitaIva = partitaIva;
	this.sitoWeb = sitoWeb;
	this.email = email;
	this.telefono = telefono;
	this.inTrattiva = inTrattiva;
	this.appetibile = appetibile;
	this.tipoLogistica = tipoLogistica;
	this.valutazione = valutazione;
	this.descrizione = descrizione;
	this.indirizzo = indirizzo;
};

/**
 * Classe di oggetti che rappresenta una nota.
 */
function Nota(autore, azienda, contatto, note) {
	this.autore = autore,
	this.azienda = azienda,
	this.contatto = contatto,
	this.note = note;
};

ltcApp.controller('nuovaAziendaController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/nuovaAzienda');
	
	$scope.salva = function() {
		//Creo l'oggetto da passare per l'inserimento.
		var azienda = new Azienda($scope.ragioneSociale, $scope.partitaIva, $scope.sitoWeb, $scope.email, $scope.telefono, $scope.inTrattiva, $scope.appetibile, $scope.tipoLogistica, $scope.valutazione, $scope.descrizione, null);
		//Imposto i parametri della chiamata
		var funzioneOk = function(data) {
			$scope.visualizzaDettaglio(data, chiaveStorageAzienda, pathSchedaAzienda);
		};
		var params = new ParametriChiamata(contextPath + wsAzienda, azienda, funzioneOk);
		params.statusCodeSuccesso = 201;
		//Eseguo la richiesta di inserimento
		$scope.chiamataPost(params);
	}
	
});

ltcApp.controller('cercaAziendaController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/cercaAzienda');
		
	mostraElemento(IDFormRicercaAzienda);
	
	//Controllo se ho già in memoria una ricerca precedente.
	var aziende = sessionStorage.getItem(chiaveStorageAziende);
	if (aziende == "undefined" || aziende == undefined || aziende == null) {
		$scope.aziende = [];
	} else {
		$scope.aziende = JSON.parse(aziende);
	}
	
	$scope.cerca = function() {
		//Condizioni di ricerca
		var filtro = { testo : $scope.testo };
		//Imposto i parametri della chiamata
		var funzioneOk = function(data) {
			$scope.aziende = data;
			sessionStorage.setItem(chiaveStorageAziende, JSON.stringify(data));
			//Se non sono state trovate aziende mostro il messaggio di consiglio.
			if (data.length == 0)
				mostraMessaggio(messaggioNessunRisultato, IDBoxNotificheRicercaAzienda);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaAzienda, filtro, funzioneOk);
		params.IDInfo = IDBoxNotificheRicercaAzienda;
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	}
	
});

ltcApp.controller('schedaAziendaController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/schedaAzienda');

	//Recupero i dati
	$scope.azienda = JSON.parse(sessionStorage.getItem(chiaveStorageAzienda));
	
	$scope.salva = function() {
		//Creo l'oggetto da passare per l'inserimento e ne valorizzo l'ID.
		var azienda = new Azienda($scope.azienda.ragioneSociale, $scope.azienda.partitaIva, $scope.azienda.sitoWeb, $scope.azienda.email, $scope.azienda.telefono, $scope.azienda.inTrattiva, $scope.azienda.appetibile, $scope.azienda.tipoLogistica, $scope.azienda.valutazione, $scope.azienda.descrizione, $scope.azienda.indirizzo);
		azienda.id = $scope.azienda.id;
		var funzioneOk = function(data) {
			//Salvo la risposta in locale come azienda selezionata 
			sessionStorage.setItem(chiaveStorageAzienda, JSON.stringify(data));
			//Notifico che la modifica è avvenuta con successo.
			mostraMessaggio(messaggioSalvataggioOk, IDBoxNotificheAzienda);
		};
		var params = new ParametriChiamata(contextPath + wsAzienda, azienda, funzioneOk);
		//Eseguo la richiesta di aggiornamento
		$scope.chiamataPut(params);
	}
	
});

ltcApp.controller('pannelloAziendaContattiController', function($scope, $http, $location, $filter) {
	
	$scope.azienda = JSON.parse(sessionStorage.getItem(chiaveStorageAzienda));
	$scope.contattoSelezionato = undefined;
	
	//Funzioni per il recupero delle informazioni addizionali sui contatti.
	sessionStorage.setItem(chiaveStorageMostraContatti, 'false');
	sessionStorage.setItem(chiaveStorageCaricamentoContatti, 'false');
	$scope.aziendaContatti = [];
	$scope.caricaContatti = function() {
		//Se non ho ancora caricato i contatti li carico
		var url = contextPath + wsContattiPerAzienda + $scope.azienda.id;
		var funzioneOk = function(data) {
			$scope.aziendaContatti = data;
			sessionStorage.setItem(chiaveStorageContattiPerAzienda, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoContatti, 'true');
		};
		var params = new ParametriChiamata(url, undefined, funzioneOk);
		params.IDLoading = IDHeaderPannelloContatti;
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.getItem(chiaveStorageMostraContatti) == 'true') {
			sessionStorage.setItem(chiaveStorageMostraContatti, 'false');
			$("#" + IDPannelloAziendaContatti).collapse('hide');
		} else {
			sessionStorage.setItem(chiaveStorageMostraContatti, 'true');
			$("#" + IDPannelloAziendaContatti).collapse('show');
		}
	}
	
	$scope.mostraConfermaEliminazione = function(contatto) {
		//Memorizzo la selezione.
		$scope.contattoSelezionato = contatto;
		//Mostro un messaggio di conferma, se Ok procedo con l'eliminazione.
		$("#" + IDModaleConfermaEliminazioneAssociazioneContatto).modal("show");
	};
	
	$scope.eliminaAssociazione = function() {
		var associazioneAziendaContatto = {
			azienda : $scope.azienda.id,
			contatto : $scope.contattoSelezionato.id
		};
		var funzioneOk = function() {
			//Indico che i contatti debbano essere ricaricati
			sessionStorage.setItem(chiaveStorageCaricamentoContatti, 'false');
			sessionStorage.setItem(chiaveStorageMostraContatti, 'false');
			$("#" + IDPannelloAziendaContatti).collapse('hide');
			//Notifico che l'eliminazione è avvenuta con successo.
			mostraMessaggio(messaggioEliminazioneOk, IDBoxInfoAssociazioneAziendaContatti);
		};
		var params = new ParametriChiamata(contextPath + wsAssociazioneAziendaContatto, associazioneAziendaContatto, funzioneOk);
		params.IDError = IDBoxErroreAssociazioneAziendaContatti;
		params.IDInfo = IDBoxInfoAssociazioneAziendaContatti;
		$scope.chiamataDelete(params);
	};
	
	$scope.associa = function(contatto) {
		var associazioneAziendaContatto = {
			azienda : $scope.azienda.id,
			contatto : contatto.id
		};
		var funzioneOk = function() {
			$("#" + IDModaleAggiungiContatto).modal("hide");
			//Indico che i contatti debbano essere ricaricati
			sessionStorage.setItem(chiaveStorageCaricamentoContatti, 'false');
			sessionStorage.setItem(chiaveStorageMostraContatti, 'false');
			$("#" + IDPannelloAziendaContatti).collapse('hide');
			mostraMessaggio(messaggioSalvataggioOk, IDBoxInfoAssociazioneAziendaContatti);
		};
		var params = new ParametriChiamata(contextPath + wsAssociazioneAziendaContatto, associazioneAziendaContatto, funzioneOk);
		params.statusCodeSuccesso = 201;
		params.IDError = IDBoxErroreAssociazioneAziendaContatti;
		params.IDInfo = IDBoxInfoAssociazioneAziendaContatti;
		$scope.chiamataPost(params);
	};
	
	$scope.contatti = [];
	
	$scope.cerca = function() {
		var filtro = {
			testo : $scope.testo
		};
		var funzioneOk = function(data) { 
			$scope.contatti = data;
			sessionStorage.setItem('associazioneAziendaContatti', JSON.stringify(data));
			sessionStorage.setItem('ricercaAssociazioneAziendaContatti', 'false');
			//Se non sono state trovate aziende mostro il messaggio di consiglio.
			if (data.length == 0)
				mostraMessaggio(messaggioNessunRisultato, IDBoxErroreAssociazioneAziendaContatti);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaContatto, filtro, funzioneOk);
		params.IDError = IDBoxErroreAssociazioneAziendaContatti;
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	};
	
});

ltcApp.controller('pannelloAziendaBrandController', function($scope, $http, $location, $filter) {
	
	$scope.azienda = JSON.parse(sessionStorage.getItem(chiaveStorageAzienda));
	$scope.brandSelezionato = undefined;
	
	//Funzioni per il recupero delle informazioni addizionali sui contatti.
	sessionStorage.setItem(chiaveStorageMostraBrand, 'false');
	sessionStorage.setItem(chiaveStorageCaricamentoBrand, 'false');
	$scope.aziendaBrands = [];
	
	$scope.caricaBrand = function() {
		//Se non ho ancora caricato i brand li carico
		var url = contextPath + wsBrandPerAzienda + $scope.azienda.id;
		var funzioneOk = function(data) {
			$scope.aziendaBrands = data;
			sessionStorage.setItem(chiaveStorageBrandPerAzienda, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoBrand, 'true');
		};
		var params = new ParametriChiamata(url, undefined, funzioneOk);
		params.IDLoading = IDHeaderPannelloBrand;
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.getItem(chiaveStorageMostraBrand) == 'true') {
			sessionStorage.setItem(chiaveStorageMostraBrand, 'false');
			$("#" + IDPannelloAziendaBrand).collapse('hide');
		} else {
			sessionStorage.setItem(chiaveStorageMostraBrand, 'true');
			$("#" + IDPannelloAziendaBrand).collapse('show');
		}
	}
	
	$scope.mostraConfermaEliminazione = function(brand) {
		//Memorizzo la selezione.
		$scope.brandSelezionato = brand;
		//Mostro un messaggio di conferma, se Ok procedo con l'eliminazione.
		$("#" + IDModaleConfermaEliminazioneAssociazioneBrand).modal("show");
	}
	
	$scope.eliminaAssociazione = function() {
		var associazioneAziendaBrand = {
			azienda : $scope.azienda.id,
			brand : $scope.brandSelezionato.id
		};
		var funzioneOk = function() {
			//Indico che i brand debbano essere ricaricati
			sessionStorage.setItem(chiaveStorageCaricamentoBrand, 'false');
			sessionStorage.setItem(chiaveStorageMostraBrand, 'false');
			$("#" + IDPannelloAziendaBrand).collapse('hide');
			//Notifico che l'eliminazione è avvenuta con successo.
			mostraMessaggio(messaggioEliminazioneOk, IDBoxInfoAssociazioneAziendaBrand);
		};
		var params = new ParametriChiamata(contextPath + wsAssociazioneAziendaBrand, associazioneAziendaBrand, funzioneOk);
		params.IDError = IDBoxErroreAssociazioneAziendaBrand;
		params.IDInfo = IDBoxInfoAssociazioneAziendaBrand;
		$scope.chiamataDelete(params);
	}
	
	$scope.associa = function(brand) {
		var associazioneAziendaBrand = {
			azienda : $scope.azienda.id,
			brand : brand.id
		};
		var funzioneOk = function() {
			$("#" + IDModaleAggiungiBrand).modal("hide");
			//Indico che i brand debbano essere ricaricati
			sessionStorage.setItem(chiaveStorageCaricamentoBrand, 'false');
			sessionStorage.setItem(chiaveStorageMostraBrand, 'false');
			$("#" + IDPannelloAziendaBrand).collapse('hide');
			mostraMessaggio(messaggioSalvataggioOk, IDBoxInfoAssociazioneAziendaBrand);
		};
		var params = new ParametriChiamata(contextPath + wsAssociazioneAziendaBrand, associazioneAziendaBrand, funzioneOk);
		params.statusCodeSuccesso = 201;
		params.IDError = IDBoxErroreAssociazioneAziendaBrand;
		params.IDInfo = IDBoxInfoAssociazioneAziendaBrand;
		$scope.chiamataPost(params);
	}
	
	$scope.brands = [];
	
	$scope.cerca = function() {
		var filtro = {
			testo : $scope.testo
		};
		var funzioneOk = function(data) {
			$scope.brands = data;
			sessionStorage.setItem('associazioneAziendaBrand', JSON.stringify(data));
			sessionStorage.setItem('ricercaAssociazioneAziendaBrand', 'false');
			//Se non sono state trovati brand mostro il messaggio di consiglio.
			if (data.length == 0)
				mostraMessaggio(messaggioNessunRisultato, IDBoxErroreAssociazioneAziendaBrand);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaBrand, filtro, funzioneOk);
		params.IDError = IDBoxErroreAssociazioneAziendaBrand;
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	};
	
});

ltcApp.controller('pannelloAziendaNoteController', function($scope, $http, $location, $filter) {
	
	$scope.azienda = JSON.parse(sessionStorage.getItem(chiaveStorageAzienda));
	
	$scope.note = [];
	$scope.contattiNota = [];
	$scope.contattoSelezionato = undefined;
	//$scope.notaSelezionata = undefined;
	
	sessionStorage.mostraNote = 'false';
	sessionStorage.noteCaricate = 'false';
	
	$scope.caricaNote = function() {
		//Se non ho ancora caricato le note le carico ora.
		var url = contextPath + wsNote + '/azienda/' + $scope.azienda.id;
		var funzioneOk = function(data) {
			$scope.note = data;
			sessionStorage.setItem(chiaveStorageNotePerAzienda, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoNote, 'true');
		};
		var params = new ParametriChiamata(url, undefined, funzioneOk);
		params.IDLoading = 'headerPannelloNote';
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.mostraNote == 'true') {
			sessionStorage.mostraNote = 'false';
			$("#pannelloAziendaNote").collapse('hide');
		} else {
			sessionStorage.mostraNote = 'true';
			$("#pannelloAziendaNote").collapse('show');
		}
	}
	
	$scope.cercaContatto = function() {
		var filtro = {
			testo : $scope.nomeContatto
		};
		var funzioneOk = function(data) { 
			$scope.contattiNota = data;
			sessionStorage.setItem('contattiPerNota', JSON.stringify(data));
			sessionStorage.setItem('ricercaContattiPerNota', 'false');
			//Se non sono state trovate aziende mostro il messaggio di consiglio.
			if (data.length == 0)
				mostraMessaggio(messaggioNessunRisultato, IDBoxErroreAssociazioneAziendaContatti);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaContatto, filtro, funzioneOk);
		params.IDError = 'boxErroriRicercaContattoNota';
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	}
	
	$scope.selezionaContattoNota = function(contatto) {
		$scope.contattoSelezionato = contatto;
	};
	
	$scope.aggiungiNota = function() {
		var contattoSelezionato = undefined;
		if ($scope.contattoSelezionato != undefined) {
			contattoSelezionato = $scope.contattoSelezionato.id;
		};
		var nota = new Nota(sessionStorage.username, $scope.azienda.id, contattoSelezionato, $scope.noteScritte);
		var funzioneOk = function(data) {
			$scope.note.unshift(data);
			sessionStorage.setItem(chiaveStorageNotePerAzienda, JSON.stringify($scope.note));
			mostraMessaggio('Nota inserita!', 'boxInfoAziendaNote');
		};
		var params = new ParametriChiamata(contextPath + wsNote, nota, funzioneOk);
		params.statusCodeSuccesso = 201;
		params.IDError = 'boxErroriRicercaContattoNota';
		$scope.chiamataPost(params);
	};
	
	$scope.impostaNote = function() {
		$scope.noteScritte = $scope.facsimile;
	}

});

ltcApp.controller('pannelloAziendaIndirizzoController', function($scope, $http, $location, $filter) {
	
	$scope.azienda = JSON.parse(sessionStorage.getItem(chiaveStorageAzienda));
	$scope.indirizzo = undefined; //JSON.parse(sessionStorage.getItem(chiaveStorageIndirizzoAzienda));
	$scope.province = $scope.getProvince();
	$scope.nazioni = $scope.getNazioni();
	
	sessionStorage.setItem(chiaveStorageMostraIndirizzoAzienda, 'false');
	sessionStorage.setItem(chiaveStorageCaricamentoIndirizzoAzienda, 'false');
	
	$scope.caricaIndirizzo = function() {
		//Se l'azienda ha un indirizzo e non l'ho ancora caricato lo faccio ora.
		
		var url = contextPath + wsAziendaIndirizzo + $scope.azienda.id;
		var funzioneOk = function(data) {
			$scope.indirizzo = data;
			sessionStorage.setItem(chiaveStorageIndirizzoAzienda, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoIndirizzoAzienda, 'true');
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
		params.IDLoading = IDHeaderPannelloAziendaIndirizzo;
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.getItem(chiaveStorageMostraIndirizzoAzienda) == 'true') {
			sessionStorage.setItem(chiaveStorageMostraIndirizzoAzienda, 'false');
			$("#" + IDPannelloAziendaIndirizzo).collapse('hide');
		} else {
			sessionStorage.setItem(chiaveStorageMostraIndirizzoAzienda, 'true');
			$("#" + IDPannelloAziendaIndirizzo).collapse('show');
		}
	};
	
	$scope.salva = function() {
		var url = contextPath + wsAziendaIndirizzo + $scope.azienda.id;
		var funzioneOk = function(data) {
			$scope.indirizzo = data;
			$scope.azienda.indirizzo = $scope.indirizzo.id;
			sessionStorage.setItem(chiaveStorageAzienda, JSON.stringify($scope.azienda));
			sessionStorage.setItem(chiaveStorageIndirizzoAzienda, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoIndirizzoAzienda, 'true');
			//Notifico che la modifica è avvenuta con successo.
			mostraMessaggio(messaggioSalvataggioOk, 'boxInfoAziendaIndirizzo');
		};
		var params = new ParametriChiamata(url, $scope.indirizzo, funzioneOk);
		params.IDInfo = 'boxInfoAziendaIndirizzo';
		params.IDLoading = 'bottoneSalvaIndirizzo';
		params.IDError = 'boxInfoAziendaIndirizzo';
		params.statusCodeSuccesso = 201;
		$scope.chiamataPost(params);
	};
	
});

ltcApp.controller('pannelloAziendaServiziController', function($scope, $http, $location, $filter) {
	
	$scope.azienda = JSON.parse(sessionStorage.getItem(chiaveStorageAzienda));
	
	//Funzioni per il recupero delle informazioni addizionali sulle categorie.
	sessionStorage.setItem(chiaveStorageMostraServiziAzienda, 'false');
	sessionStorage.setItem(chiaveStorageCaricamentoServiziAzienda, 'false');
	
	$scope.nuovoServizio = "";
	$scope.servizi = [];
	
	$scope.caricaServizi = function() {
		//Se non ho ancora caricato le note le carico ora.
		var url = contextPath + wsTagServizi + '/azienda/' + $scope.azienda.id;
		var funzioneOk = function(data) {
			$scope.servizi = data;
			sessionStorage.setItem(chiaveStorageServiziAzienda, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoServiziAzienda, 'true');
		};
		var params = new ParametriChiamata(url, undefined, funzioneOk);
		params.IDLoading = 'headerPannelloServizi';
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.getItem(chiaveStorageMostraServiziAzienda) == 'true') {
			sessionStorage.setItem(chiaveStorageMostraServiziAzienda, 'false');
			$("#" + IDPannelloAziendaTagServizi).collapse('hide');
		} else {
			sessionStorage.setItem(chiaveStorageMostraServiziAzienda, 'true');
			$("#" + IDPannelloAziendaTagServizi).collapse('show');
		}
	};
	
	$scope.aggiungi = function() {
		var nuovoTagServizio = {azienda : $scope.azienda.id, tag : $scope.nuovoServizio};
		var funzioneOk = function(data) {
			$scope.servizi.unshift(data);
			sessionStorage.setItem(chiaveStorageServiziAzienda, JSON.stringify($scope.servizi));
			mostraMessaggio('Servizio inserito!', 'boxInfoAziendaServizi');
			$scope.nuovoServizio = '';
		};
		var params = new ParametriChiamata(contextPath + wsTagServizi, nuovoTagServizio, funzioneOk);
		params.statusCodeSuccesso = 201;
		params.IDError = 'boxInfoAziendaServizi';
		$scope.chiamataPost(params);
	};
	
});

ltcApp.controller('tagAziendaServiziController', function($scope, $http, $location, $filter) {
	
	$scope.elimina = function(tag) {
		var funzioneOk = function(data) {
			var index = -1;
			for (var i = 0; i < $scope.servizi.length; i++) {
				if (data.tag == $scope.servizi[i].tag) {
					index = i;
				}
			}
			if (index != -1) {
				$scope.servizi.splice(index, 1);
				sessionStorage.setItem(chiaveStorageServiziAzienda, JSON.stringify($scope.servizi));
				mostraMessaggio('Servizio eliminato!', 'boxInfoAziendaServizi');
			} else {
				console.log('Warning: Servizio non trovato.')
			}
		};
		var params = new ParametriChiamata(contextPath + wsTagServizi, tag, funzioneOk);
		params.IDError = 'boxInfoAziendaServizi';
		$scope.chiamataDelete(params);
	};
	
});


ltcApp.controller('pannelloAziendaCategorieController', function($scope, $http, $location, $filter) {
	
	$scope.azienda = JSON.parse(sessionStorage.getItem(chiaveStorageAzienda));
	
	//Funzioni per il recupero delle informazioni addizionali sulle categorie.
	sessionStorage.setItem(chiaveStorageMostraCategorieAzienda, 'false');
	sessionStorage.setItem(chiaveStorageCaricamentoCategorieAzienda, 'false');
	
	$scope.nuovaCategoria = "";
	$scope.categorie = [];
	
	$scope.caricaCategorie = function() {
		//Se non ho ancora caricato le note le carico ora.
		var url = contextPath + wsTagCategorie + '/azienda/' + $scope.azienda.id;
		var funzioneOk = function(data) {
			$scope.categorie = data;
			sessionStorage.setItem(chiaveStorageCategorieAzienda, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoCategorieAzienda, 'true');
		};
		var params = new ParametriChiamata(url, undefined, funzioneOk);
		params.IDLoading = 'headerPannelloCategorie';
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.getItem(chiaveStorageMostraCategorieAzienda) == 'true') {
			sessionStorage.setItem(chiaveStorageMostraCategorieAzienda, 'false');
			$("#" + IDPannelloAziendaTagCategorie).collapse('hide');
		} else {
			sessionStorage.setItem(chiaveStorageMostraCategorieAzienda, 'true');
			$("#" + IDPannelloAziendaTagCategorie).collapse('show');
		}
	};
	
	$scope.aggiungi = function() {
		var nuovoTagCategoria = {azienda : $scope.azienda.id, tag : $scope.nuovaCategoria};
		var funzioneOk = function(data) {
			$scope.categorie.unshift(data);
			sessionStorage.setItem(chiaveStorageCategorieAzienda, JSON.stringify($scope.categorie));
			mostraMessaggio('Categoria inserita!', 'boxInfoAziendaCategorie');
			$scope.nuovaCategoria = "";
		};
		var params = new ParametriChiamata(contextPath + wsTagCategorie, nuovoTagCategoria, funzioneOk);
		params.statusCodeSuccesso = 201;
		params.IDError = 'boxInfoAziendaCategorie';
		$scope.chiamataPost(params);
	};
	
});

ltcApp.controller('tagAziendaCategorieController', function($scope, $http, $location, $filter) {
	
	$scope.elimina = function(tag) {
		var funzioneOk = function(data) {
			var index = -1;
			for (var i = 0; i < $scope.categorie.length; i++) {
				if (data.tag == $scope.categorie[i].tag) {
					index = i;
				}
			}
			if (index != -1) {
				$scope.categorie.splice(index, 1);
				sessionStorage.setItem(chiaveStorageCategorieAzienda, JSON.stringify($scope.categorie));
				mostraMessaggio('Categoria eliminata!', 'boxInfoAziendaCategorie');
			} else {
				console.log('Warning: Categoria non trovata.')
			}
		};
		var params = new ParametriChiamata(contextPath + wsTagCategorie, tag, funzioneOk);
		params.IDError = 'boxInfoAziendaCategorie';
		$scope.chiamataDelete(params);
	};
	
});

ltcApp.controller('pannelloAziendaNotaController', function($scope, $http, $location, $filter) {
	
	$scope.resetMessaggi = function() {
		$scope.mostraInfoNota = false;
		$scope.mostraErroreNota = false;
		$scope.messaggioInfo = '';
		$scope.messaggioErrore = '';
	}
	
	$scope.resetMessaggi();
	
	$scope.aggiornaNota = function() {		
		$scope.resetMessaggi();
		var funzioneOk = function(data) {
			$scope.messaggioInfo = 'Nota aggiornata!';
			$scope.mostraInfoNota = true;
		};
		var funzioneErrore = function(response) { 
			$scope.messaggioErrore = readErrorMessage(response);
			$scope.mostraErroreNota = true;
		};
		var params = new ParametriChiamata(contextPath + wsNote, $scope.nota, funzioneOk);
		params.errore = funzioneErrore;
		$scope.chiamataPut(params);
		//$("#" + IDModaleConfermaAggiornamentoNota + $scope.nota.id).modal("hide");
	};
	
	$scope.mostraConfermaEliminazioneNota = function() {
		//Mostro un messaggio di conferma, se Ok procedo con l'eliminazione.
		$("#" + IDModaleConfermaEliminazioneNota + $scope.nota.id).modal("show");
	}
	
	$scope.eliminaNota = function() {
		chiudiModale(IDModaleConfermaEliminazioneNota + $scope.nota.id);
		$scope.resetMessaggi();
		var funzioneOk = function(data) {
			var index = -1;
			for (var i = 0; i < $scope.note.length; i++) {
				if (data.id == $scope.note[i].id) {
					index = i;
				}
			}
			if (index != -1) {
				$scope.note.splice(index, 1);
				sessionStorage.setItem(chiaveStorageNotePerAzienda, JSON.stringify($scope.note));
				mostraMessaggio('Nota eliminata!', 'boxInfoAziendaNote');
			} else {
				console.log('Warning: Nota non trovata.')
			}
		};
		var params = new ParametriChiamata(contextPath + wsNote, $scope.nota, funzioneOk);
		params.IDError = 'boxErroriRicercaContattoNota';
		$scope.chiamataDelete(params);
	}
	
});