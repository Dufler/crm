/**
 * In Questo file JavaScript sono contenuti tutti i controller base.
 */

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
	
	$scope.message = 'Ciao ' + sessionStorage.nome + " " + sessionStorage.cognome + "!";
	
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