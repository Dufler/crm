/**
 * Script principale
 */

/* Costanti */


var contextPath = "http://ws.services.ltc-logistics.it/logica/rest";
var wsLogin = "/utente/login";
var wsUpdate = "/utente/update";

var wsProvince = "/provincia";
var wsNazioni = "/nazione";

var wsRicercaGenerica = "/crm/cerca";

var wsAzienda = "/crm/azienda";
var wsAziendePerContatto = "/crm/azienda/contatto/";
var wsAziendePerBrand = "/crm/azienda/brand/";
var wsAziendaIndirizzo = "/crm/azienda/indirizzo/";
var wsRicercaAzienda = "/crm/azienda/cerca";

var wsContatto = "/crm/contatto";
var wsContattiPerAzienda = "/crm/contatto/azienda/";
var wsContattoIndirizzo = "/crm/contatto/indirizzo/";
var wsRicercaContatto = "/crm/contatto/cerca";

var wsRecapito = "/crm/recapito";

var wsBrand = "/crm/brand";
var wsBrandPerAzienda = "/crm/brand/azienda/";
var wsRicercaBrand = "/crm/brand/cerca";

var wsNote = "/crm/note";
var wsNotePerAzienda = "/crm/note/azienda/";
var wsRicercaNote = "/crm/note/cerca";

var wsGadget = "/crm/gadget";
var wsRicercaGadget = "/crm/gadget/cerca";

var wsGadgetInviati = "/crm/gadgetinviati";
var wsGadgetInviatiPerAzienda = "/crm/gadgetinviati/azienda/";
var wsGadgetInviatiPerGadget = "/crm/gadgetinviati/gadget/";

var wsAssociazioneAziendaContatto = "/crm/associazioneaziendacontatto";
var wsAssociazioneAziendaBrand = "/crm/associazioneaziendabrand";

var wsTagServizi = "/crm/tagservizi";
var wsTagCategorie = "/crm/tagcategorie";

//Messaggi per l'utente

var messaggioErroreGenerico = "La richiesta non e' andata a buon fine, contattare il reparto IT.";
var messaggioSalvataggioOk = "Modifiche salvate correttamente!";
var messaggioEliminazioneOk = "Eliminazione effettuata!";
var messaggioNessunRisultato = "Nessun risultato! Prova ad effettuare la ricerca con criteri diversi...";
var messaggioErroreConnessione = "Ci sono stati problemi di comunicazione con il server, prova di nuovo.";
var messaggioPermessiInsufficienti = "Non si dispone dei permessi necessari per poter eseguire questa azione.";

//ID Elementi HTML ricorrenti

var IDBoxErrori = "boxErrori";
var IDBoxNotifiche = "boxNotifiche";

var IDBottoneCaricamento = "bottoneCaricamento";

/* Funzioni */

// Creazione del modulo Angular, app principale.
var ltcApp = angular.module('ltcApp', [ 'ngRoute', 'angular-table', 'angular-tabs' ]);

// Configurazione delle rotte
ltcApp.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'resources/html/pages/login.html',
		controller : 'loginController'
	})
	.when('/login', {
		templateUrl : 'resources/html/pages/login.html',
		controller : 'loginController'
	})
	.when('/reimposta', {
		templateUrl : 'resources/html/pages/resetPassword.html',
		controller : 'errorController'
	})
	.when('/index', {
		templateUrl : 'resources/html/pages/choose.html',
		controller : 'indexController'
	})
	.when('/nuovaAzienda', {
		templateUrl : 'resources/html/pages/nuovaAzienda.html',
		controller : 'nuovaAziendaController'
	})
	.when('/schedaAzienda', {
		templateUrl : 'resources/html/pages/schedaAzienda.html',
		controller : 'schedaAziendaController'
	})
	.when('/cercaAzienda', {
		templateUrl : 'resources/html/pages/cercaAzienda.html',
		controller : 'cercaAziendaController'
	})
	.when('/nuovoContatto', {
		templateUrl : 'resources/html/pages/nuovoContatto.html',
		controller : 'nuovoContattoController'
	})
	.when('/schedaContatto', {
		templateUrl : 'resources/html/pages/schedaContatto.html',
		controller : 'schedaContattoController'
	})
	.when('/cercaContatto', {
		templateUrl : 'resources/html/pages/cercaContatto.html',
		controller : 'cercaContattoController'
	})
	.when('/nuovoBrand', {
		templateUrl : 'resources/html/pages/nuovoBrand.html',
		controller : 'nuovoBrandController'
	})
	.when('/schedaBrand', {
		templateUrl : 'resources/html/pages/schedaBrand.html',
		controller : 'schedaBrandController'
	})
	.when('/cercaBrand', {
		templateUrl : 'resources/html/pages/cercaBrand.html',
		controller : 'cercaBrandController'
	})
	.when('/nuovoGadget', {
		templateUrl : 'resources/html/pages/nuovoGadget.html',
		controller : 'nuovoGadgetController'
	})
	.when('/schedaGadget', {
		templateUrl : 'resources/html/pages/schedaGadget.html',
		controller : 'schedaGadgetController'
	})
	.when('/cercaGadget', {
		templateUrl : 'resources/html/pages/cercaGadget.html',
		controller : 'cercaGadgetController'
	})
	.when('/preferenze', {
		templateUrl : 'resources/html/pages/preferences.html',
		controller : 'preferencesController'
	})
	.when('/errore', {
		templateUrl : 'resources/html/pages/error.html',
		controller : 'errorController'
	})
	.otherwise({redirectTo:'/errore'});
});

//ltcApp.factory('myService', function($location) {
//    return {
//        foo: function() {
//    		var paginaPrecedente = sessionStorage.paginaPrecedente;
//    		console.log("SuperMissile a: " + paginaPrecedente);
//    		$location.path(paginaPrecedente);
//    		$location.replace();
//        }
//    };
//});


/**
 * Oggetto attualmente non utilizzato
 */
function ParametriChiamata(url, object, funzioneOk) {
	//Parametri per la chiamata
	this.url = url;
	this.object = object;
	
	//ID elementi HTML
	this.IDError = IDBoxErrori;
	this.IDInfo = IDBoxNotifiche;
	this.IDLoading = IDBottoneCaricamento;
	
	//Codici di stato
	this.statusCodeSuccesso = 200;
	this.statusCodeErrore = 400;
	this.statusCodeNonAutenticato = 401;
	this.statusCodeNonAutorizzato = 403;
	this.statusCodeErroreGenerico = 500;
	
	//Funzioni
	this.ottieniUrl = function() { return this.url + getAntiCacheSuffix(); };
	this.nascondiElementi = function() { nascondiElemento(this.IDError); nascondiElemento(this.IDInfo); };
	this.mostraCaricamento = function(show) { mostraCaricamento(show, this.IDLoading); };
	this.successo = function(response) {
		if (response.status == this.statusCodeSuccesso) {
			this.ok(response.data);
		} else {
			this.okParziale(response.data);
		}
	};
	this.fallimento = function(response) {
		if (response.status == this.statusCodeErrore) {
			this.errore(response);
		} else if (response.status == this.statusCodeNonAutenticato) {
			this.nonAutenticato();
		} else if (response.status == this.statusCodeNonAutorizzato) {
			this.nonAutorizzato();
		} else {
			this.erroreGenerico(response);
		}
	};
	this.ok = funzioneOk; //function(data) { /*Deve essere riempito quando si creano i parametri di chiamata*/ };
	this.okParziale = function(data) { mostraMessaggio(messaggioErroreGenerico, this.IDError); };
	this.errore = function(response) { var messaggio = readErrorMessage(response); mostraMessaggio(messaggio, this.IDError); };
	this.erroreGenerico = function(response) { mostraMessaggio(messaggioErroreGenerico, this.IDError); };
	this.nonAutenticato = function() { /*Viene riempito successivamente con la funzione di deautenticazione*/ };
	this.nonAutorizzato = function() { mostraMessaggio(messaggioPermessiInsufficienti, this.IDError); };
};

ltcApp.run(function($rootScope, $location, $http) {
	
	$rootScope.configurazioneTabella = { itemsPerPage: 10, fillLastPage: false, maxPages : 10 };
	
	//Chiude l'alert bootstrap con l'ID html indicato.
	$rootScope.chiudiAlert = function(IDAlert) { console.log('Chiudi alert'); $("#" + IDAlert).alert("close"); };
	
	$rootScope.vaiA = function(path) {
		if (path != undefined) {
			$location.path(path);
			$location.replace();
		}
	};
	
	//Torna indietro di una pagina
	$rootScope.tornaIndietro = function() {
		var paginaPrecedente = sessionStorage.paginaPrecedente;
		$location.path(paginaPrecedente);
		$location.replace();
	};
	
	//Visualizza la pagina di dettaglio con le informazioni dell'oggetto passato come argomento.
	$rootScope.visualizzaDettaglio = function(item, key, path) {
		//console.log('Oggetto: ');
		//console.log(item);
		//console.log('Chiave: ' + key);
		//console.log('Percorso: ' + path);
		//Se mi è stata passata una chiave su cui andare a memorizzare l'oggetto lo metto nel sessionStorage.
		if (key != undefined) {
			sessionStorage.setItem(key, JSON.stringify(item));
		}
		//Se mi è stato passato un valore per il nuovo percorso mi ci sposto.
		$rootScope.vaiA(path);
//		if (path != undefined) {
//			$location.path(path);
//			$location.replace();
//		}
	}
	
	//Imposta lo stato del login.
	$rootScope.setLogin = function(login) {
		console.log('Cambio lo stato del login a: ' + login);
		sessionStorage.setItem('login', login);
	};
	
	//Controlla se è stato effettuato il login.
	$rootScope.loginEffettuato = function() {
		var login = sessionStorage.getItem('login');
		var b = login == 'true';
		return b;
	};
	
	//Controlla se le credenziali sono state inserite.
	$rootScope.controllaCredenziali = function() {
		if (!$rootScope.loginEffettuato()) {
			console.log('Login non effettuato. Procedo alla deAutenticazione.')
			$rootScope.deAutentica();
		}
	}
	
	//De autentica l'utente e lo riporta nella pagina di login.
	$rootScope.deAutentica = function() {
		$rootScope.setLogin(false);
		sessionStorage.clear();
		$location.path('/login');
		$location.replace();
	};
	
	$rootScope.chiamataGet = function(parametri) {
		//Imposto la funzione di deAutenticazione
		parametri.nonAutenticato = function() { $rootScope.deAutentica() };
		//nascondi elementi vari
		parametri.nascondiElementi();
		//mostra caricamento
		parametri.mostraCaricamento(true);
		//Esegui la chiamata e gestisci la risposta
		$http.get(parametri.ottieniUrl(), getHTTPHeaderConfig()).then(
			function(response) {
				parametri.successo(response);
				parametri.mostraCaricamento(false);
			}, function(response) {
				parametri.fallimento(response);
				parametri.mostraCaricamento(false);
			}
		);
	}
	
	$rootScope.chiamataPost = function(parametri) {
		//Imposto la funzione di deAutenticazione
		parametri.nonAutenticato = function() { $rootScope.deAutentica() };
		//nascondi elementi vari
		parametri.nascondiElementi();
		//mostra caricamento
		parametri.mostraCaricamento(true);
		//Esegui la chiamata e gestisci la risposta
		$http.post(parametri.ottieniUrl(), parametri.object, getHTTPHeaderConfig()).then(
			function(response) {
				parametri.successo(response);
				parametri.mostraCaricamento(false);
			}, function(response) {
				parametri.fallimento(response);
				parametri.mostraCaricamento(false);
			}
		);
	}
	
	$rootScope.chiamataPut = function(parametri) {
		//Imposto la funzione di deAutenticazione
		parametri.nonAutenticato = function() { $rootScope.deAutentica() };
		//nascondi elementi vari
		parametri.nascondiElementi();
		//mostra caricamento
		parametri.mostraCaricamento(true);
		//Esegui la chiamata e gestisci la risposta
		$http.put(parametri.ottieniUrl(), parametri.object, getHTTPHeaderConfig()).then(
			function(response) {
				parametri.successo(response);
				parametri.mostraCaricamento(false);
			}, function(response) {
				parametri.fallimento(response);
				parametri.mostraCaricamento(false);
			}
		);
	}
	
	$rootScope.chiamataDelete = function(parametri) {
		//Imposto la funzione di deAutenticazione
		parametri.nonAutenticato = function() { $rootScope.deAutentica() };
		//nascondi elementi vari
		parametri.nascondiElementi();
		//mostra caricamento
		parametri.mostraCaricamento(true);
		//Imposta la configurazione, esegui la chiamata e gestisci la risposta
		var config = getHTTPHeaderConfig();
		config.data = parametri.object;
		$http.delete(parametri.ottieniUrl(), config).then(
			function(response) {
				parametri.successo(response);
				parametri.mostraCaricamento(false);
			}, function(response) {
				parametri.fallimento(response);
				parametri.mostraCaricamento(false);
			}
		);
	}
	
	$rootScope.getProvince = function() {
		//Controllo se ho già in memoria una ricerca precedente.
		var province = sessionStorage.getItem('province');
		if (province == "undefined" || province == undefined || province == null) {
			var url = contextPath + wsProvince;
			var funzioneOk = function(data) {
				province = data;
				sessionStorage.setItem('province', JSON.stringify(data));
			};
			var params = new ParametriChiamata(url, undefined, funzioneOk);
			params.nascondiElementi = function() { /*Non fare nulla!*/ };
			params.mostraCaricamento = function(show) { /*Non fare nulla!*/ };
			$rootScope.chiamataGet(params);
		}
		province = JSON.parse(province);
		return province;
	}
	
	$rootScope.getNazioni = function() {
		//Controllo se ho già in memoria una ricerca precedente.
		var nazioni = sessionStorage.getItem('nazioni');
		if (nazioni == "undefined" || nazioni == undefined || nazioni == null) {
			var url = contextPath + wsNazioni;
			var funzioneOk = function(data) {
				sessionStorage.setItem('nazioni', JSON.stringify(data));
			};
			var params = new ParametriChiamata(url, undefined, funzioneOk);
			params.nascondiElementi = function() { /*Non fare nulla!*/ };
			params.mostraCaricamento = function(show) { /*Non fare nulla!*/ };
			$rootScope.chiamataGet(params);
		}
		nazioni = JSON.parse(nazioni);
		return nazioni;
	}
	
});
