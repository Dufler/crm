/**
 * In Questo file JavaScript sono contenuti tutti i controller base.
 */

var chiaveStorageRicercaGenerica = 'risultatiRicerca';
var IDBoxNotificheRicerca = 'boxNotificheRicercaTutto';

// Controller principale e inject Angular's $scope
ltcApp.controller('mainController', function($scope, $http, $location) {

	// Variabili condivise in tutta la app
	$scope.username = undefined;
	$scope.password = undefined;
	//$scope.loginRiuscito = sessionStorage.getItem("nome") != undefined;

});

ltcApp.controller('loginController', function($scope, $http, $location) {

	$scope.message = '';

	// Funzione di login, se va a buon fine setta le variabili di sessione.
	$scope.login = function() {
		//Le imposto la prima volta, saranno usate per tutte le chiamate
		sessionStorage.username = $scope.username;
		sessionStorage.password = $scope.password;
		//Eseguo la chiamata di login per autenticarmi
		$http.get(contextPath + wsLogin, getHTTPHeaderConfig()).then(
			function(response) {
				if (response.status == 200) {
					//TODO - Inserire controllo sui permessi!
					sessionStorage.nome = response.data.nome;
					sessionStorage.cognome = response.data.cognome;
					sessionStorage.setItem("permessi", JSON.stringify(response.data.permessi));
					sessionStorage.setItem("sedi", JSON.stringify(response.data.sedi));
					sessionStorage.setItem("commesse", JSON.stringify(response.data.commesse));
					sessionStorage.ricerca = 'true';
					sessionStorage.ricercaArchiviati = 'true';
					$scope.setLogin(true);
					//$scope.$parent.loginRiuscito = true;
					$location.path('/index');
					$location.replace();
				} else {
					$scope.message = "Ci sono stati problemi con il login.";
				}
			}, function(response) {
				//Errore
				if (response.status == 401 || response.status == 403) {
					$scope.message = "Nome utente o password non corretti."
				} else {
					$scope.message = "Ci sono stati problemi con il login.";
				}
			});
	};
});

ltcApp.controller('indexController', function($scope) {
	
	$scope.controllaCredenziali();
	
	setCurrentPage('/index');
	
	$scope.configurazioneTabellaAziende = { itemsPerPage: 10, fillLastPage: false, maxPages : 10 };
	$scope.configurazioneTabellaContatti = { itemsPerPage: 10, fillLastPage: false, maxPages : 10 };
	$scope.configurazioneTabellaNote = { itemsPerPage: 10, fillLastPage: false, maxPages : 10 };
	$scope.configurazioneTabellaBrand = { itemsPerPage: 10, fillLastPage: false, maxPages : 10 };
	
	$scope.message = 'Ciao ' + sessionStorage.nome + " " + sessionStorage.cognome + "!";
	$scope.aziende = [];
	$scope.note = [];
	$scope.contatti = [];
	$scope.mostraAziende = false;
	$scope.mostraNote = false;
	$scope.mostraContatti = false;
	$scope.mostraBrand = false;
	
	//Carico alcuni dati statici.
	$scope.getProvince();
	$scope.getNazioni();
	
	$scope.cerca = function() {
		//Condizioni di ricerca
		var filtro = { testo : $scope.testo };
		//Imposto i parametri della chiamata
		var funzioneOk = function(data) {
			$scope.aziende = data.aziende;
			$scope.note = data.note;
			$scope.contatti = data.contatti;
			$scope.brands = data.brands;
			sessionStorage.setItem(chiaveStorageRicercaGenerica, JSON.stringify(data));
			//Mostro solo le parti che hanno risultati
			if ($scope.aziende.length > 0) {
				$scope.mostraAziende = true;
			} else {
				$scope.mostraAziende = false;
			}
			if ($scope.note.length > 0) {
				$scope.mostraNote = true;
			} else {
				$scope.mostraNote = false;
			}
			if ($scope.contatti.length > 0) {
				$scope.mostraContatti = true;
			} else {
				$scope.mostraContatti = false;
			}
			if ($scope.brands.length > 0) {
				$scope.mostraBrand = true;
			} else {
				$scope.mostraBrand = false;
			}
			//Se non sono state trovate aziende mostro il messaggio di consiglio.
			if (!$scope.mostraAziende && !$scope.mostraNote && !$scope.mostraContatti)
				mostraMessaggio(messaggioNessunRisultato, IDBoxNotificheRicerca);
		};
		var params = new ParametriChiamata(contextPath + wsRicercaGenerica, filtro, funzioneOk);
		params.IDInfo = IDBoxNotificheRicerca;
		//Eseguo la ricerca
		$scope.chiamataPost(params);
	};
	
});

ltcApp.controller('preferencesController', function($scope, $http) {
	
	if (sessionStorage.username == null || sessionStorage.username == undefined) {
		$location.path('/login');
		$location.replace();
	}
	
	$scope.message = '';
	
	$scope.cambia = function() {
		var cambioPassword = {
				username : sessionStorage.username,
				password : sessionStorage.password,
				nuovaPassword : $scope.password
		}
		//TODO - Rivedere questa parte!
		$http.post(contextPath + wsUpdate + getAntiCacheSuffix(), cambioPassword, getHTTPHeaderConfig()).then(
				function(response) {
					if (response.status == 200) {
						sessionStorage.password = $scope.password;
						$scope.message = "Password modificata con successo";
					} else if (response.status == 401) {
						sessionStorage.clear();
						$location.path('/login');
						$location.replace();
					} else {
						$scope.message = messaggioErroreGenerico;
						sessionStorage.dettaglioOrdine = undefined;
					}
				}, function(response) {
					//Errore
					$scope.message = messaggioErroreConnessione;
					sessionStorage.dettaglioOrdine = undefined;
				});
	};
});

ltcApp.controller('errorController', function($scope) {
	$scope.message = '';
});

/*Controller del menù laterale*/
ltcApp.controller('menuController', function($scope, $location, $http) {
	
	//TODO - Metterci quello che serve (es. visibilità delle voci di menù in base all'utente.)
	
});