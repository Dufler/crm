/**
 * Questo file JavaScript ospita tutti i controller relativi alla gestione dei brand.
 */

// Variabili utili
var IDFormRicercaBrand = 'formCercaBrand';
var IDBoxNotificheRicercaBrand = 'boxNotificheRicercaBrand';
var IDBoxNotificheBrand = 'boxNotifiche';

var IDBoxErroreAssociazioneBrandAziende = 'boxErroriAssociazioneBA';
var IDBoxInfoAssociazioneBrandAziende = 'boxInfoAssociazioneBA';
var IDHeaderPannelloAziendePerBrand = 'headerPannelloAziende';
var IDPannelloBrandAziende = 'pannelloBrandAziende';
var IDModaleConfermaEliminazioneAssociazioneAziendaPerBrand = 'modaleConfermaEliminazioneAssociazioneAzienda';
var IDModaleAggiungiAziendaPerBrand = 'modaleAggiungiAzienda';

var chiaveStorageBrand = 'brand';
var chiaveStorageBrands = 'brands';

var chiaveStorageMostraAziendePerBrand = 'mostraAziendePerBrand';
var chiaveStorageCaricamentoAziendePerBrand = 'aziendeCaricatePerBrand';
var chiaveStorageAziendePerBrand = 'brandAziende';

var pathSchedaBrand = '/schedaBrand';

/**
 * Classe di oggetti che rappresenta un brand.
 */
function Brand(nome) {
	this.nome = nome
}

ltcApp.controller('nuovoBrandController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/nuovoBrand');
	
	$scope.salva = function() {
		//Creo l'oggetto da passare per l'inserimento.
		var brand = new Brand($scope.nome);
		//Imposto i parametri della chiamata
		var funzioneOk = function(data) {
			$scope.visualizzaDettaglio(data, chiaveStorageBrand, pathSchedaBrand);
		};
		var params = new ParametriChiamata(contextPath + wsBrand, brand, funzioneOk);
		params.statusCodeSuccesso = 201;
		//Eseguo la richiesta di inserimento
		$scope.chiamataPost(params);
	}
	
});

ltcApp.controller('cercaBrandController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/cercabrand');
		
	mostraElemento(IDFormRicercaBrand);
	
	//Controllo se ho già in memoria una ricerca precedente.
	var brands = sessionStorage.getItem(chiaveStorageBrands);
	if (brands == "undefined" || brands == undefined || brands == null) {
		$scope.brands = [];
	} else {
		$scope.brands = JSON.parse(brands);
	}
	
	$scope.cerca = function() {
		//Condizioni di ricerca
		var filtro = { testo : $scope.testo };
		//Imposto i parametri della chiamata
		var funzioneOk = function(data) {
			$scope.brands = data;
			sessionStorage.setItem(chiaveStorageBrands, JSON.stringify(data));
			//Se non sono state trovate aziende mostro il messaggio di consiglio.
			if (data.length == 0)
				mostraMessaggio(messaggioNessunRisultato, IDBoxNotificheRicercaBrand);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaBrand, filtro, funzioneOk);
		params.IDInfo = IDBoxNotificheRicercaBrand;
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	}
	
});

ltcApp.controller('schedaBrandController', function($scope, $http, $location, $filter) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/schedaBrand');

	//Recupero i dati
	$scope.brand = JSON.parse(sessionStorage.getItem(chiaveStorageBrand));
	
	$scope.salva = function() {
		//Creo l'oggetto da passare per l'inserimento e ne valorizzo l'ID.
		var brand = new Brand($scope.brand.nome);
		brand.id = $scope.brand.id;
		var funzioneOk = function(data) {
			//Salvo la risposta in locale come azienda selezionata 
			sessionStorage.setItem(chiaveStorageBrand, JSON.stringify(data));
			//Notifico che la modifica è avvenuta con successo.
			mostraMessaggio(messaggioSalvataggioOk, IDBoxNotificheBrand);
		};
		var params = new ParametriChiamata(contextPath + wsBrand, brand, funzioneOk);
		//Eseguo la richiesta di aggiornamento
		$scope.chiamataPut(params);
	}
	
});

ltcApp.controller('pannelloBrandAziendeController', function($scope, $http, $location, $filter) {
	
	$scope.brand = JSON.parse(sessionStorage.getItem(chiaveStorageBrand));
	$scope.aziendaSelezionata = undefined;
	
	//Funzioni per il recupero delle informazioni addizionali sui contatti.
	sessionStorage.setItem(chiaveStorageMostraAziendePerBrand, 'false');
	sessionStorage.setItem(chiaveStorageCaricamentoAziendePerBrand, 'false');
	$scope.brandAziende = [];
	
	$scope.caricaAziende = function() {
		//Se non ho ancora caricato i contatti li carico
		var url = contextPath + wsAzienda + '/brand/' + $scope.brand.id;
		var funzioneOk = function(data) {
			$scope.brandAziende = data;
			sessionStorage.setItem(chiaveStorageAziendePerBrand, JSON.stringify(data));
			sessionStorage.setItem(chiaveStorageCaricamentoAziendePerBrand, 'true');
		};
		var params = new ParametriChiamata(url, undefined, funzioneOk);
		params.IDLoading = IDHeaderPannelloAziendePerBrand;
		$scope.chiamataGet(params);
		//Mostro o nascondo il pannello
		if (sessionStorage.getItem(chiaveStorageMostraAziendePerBrand) == 'true') {
			sessionStorage.setItem(chiaveStorageMostraAziendePerBrand, 'false');
			$("#" + IDPannelloBrandAziende).collapse('hide');
		} else {
			sessionStorage.setItem(chiaveStorageMostraAziendePerBrand, 'true');
			$("#" + IDPannelloBrandAziende).collapse('show');
		}
	}
	
	$scope.mostraConfermaEliminazione = function(azienda) {
		//Memorizzo la selezione.
		$scope.aziendaSelezionata = azienda;
		//Mostro un messaggio di conferma, se Ok procedo con l'eliminazione.
		$("#" + IDModaleConfermaEliminazioneAssociazioneAziendaPerBrand).modal("show");
	}
	
	$scope.eliminaAssociazione = function() {
		var associazioneAziendaBrand = {
			azienda : $scope.aziendaSelezionata.id,
			brand : $scope.brand.id
		};
		var funzioneOk = function() {
			//Indico che i contatti debbano essere ricaricati
			sessionStorage.setItem(chiaveStorageCaricamentoAziendePerBrand, 'false');
			sessionStorage.setItem(chiaveStorageMostraAziendePerBrand, 'false');
			$("#" + IDPannelloBrandAziende).collapse('hide');
			//Notifico che l'eliminazione è avvenuta con successo.
			mostraMessaggio(messaggioEliminazioneOk, IDBoxInfoAssociazioneBrandAziende);
		};
		var params = new ParametriChiamata(contextPath + wsAssociazioneAziendaBrand, associazioneAziendaBrand, funzioneOk);
		params.IDError = IDBoxErroreAssociazioneBrandAziende;
		params.IDInfo = IDBoxInfoAssociazioneBrandAziende;
		$scope.chiamataDelete(params);
	}
	
	$scope.associa = function(azienda) {
		var associazioneAziendaBrand = {
			azienda : azienda.id,
			brand : $scope.brand.id
		};
		var funzioneOk = function() {
			$("#" + IDModaleAggiungiAziendaPerBrand).modal("hide");
			//Indico che i contatti debbano essere ricaricati
			sessionStorage.setItem(chiaveStorageCaricamentoAziendePerBrand, 'false');
			sessionStorage.setItem(chiaveStorageMostraAziendePerBrand, 'false');
			$("#" + IDPannelloBrandAziende).collapse('hide');
			mostraMessaggio(messaggioSalvataggioOk, IDBoxInfoAssociazioneBrandAziende);
		};
		var params = new ParametriChiamata(contextPath + wsAssociazioneAziendaBrand, associazioneAziendaBrand, funzioneOk);
		params.statusCodeSuccesso = 201;
		params.IDError = IDBoxErroreAssociazioneBrandAziende;
		params.IDInfo = IDBoxInfoAssociazioneBrandAziende;
		$scope.chiamataPost(params);
	}
	
	$scope.aziende = [];
	
	$scope.cerca = function() {
		var filtro = {
			testo : $scope.testo
		};
		var funzioneOk = function(data) { 
			$scope.aziende = data;
			sessionStorage.setItem('associazioneBrandAziende', JSON.stringify(data));
			sessionStorage.setItem('ricercaAssociazioneBrandAziende', 'false');
			//Se non sono state trovate aziende mostro il messaggio di consiglio.
			if (data.length == 0)
				mostraMessaggio(messaggioNessunRisultato, IDBoxErroreAssociazioneBrandAziende);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaAzienda, filtro, funzioneOk);
		params.IDError = IDBoxErroreAssociazioneBrandAziende;
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	}
});