/**
 * Qui sono contenute tutte le funzioni comuni ai vari controller. 
 */
//Genera un suffisso da appendere alle chiamate POST per evitare che alcuni browser facciano caching
var getAntiCacheSuffix = function() {
	return '?v=' + Date.now();
};

//Codifica in Base64
var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

var encodeBase64 = function (input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
};

var decodeBase64 = function (input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        window.alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return output;
};

var setCurrentPage = function(currentPage) {
	var paginaPrecedente = sessionStorage.paginaCorrente;
	sessionStorage.paginaPrecedente = paginaPrecedente;
	sessionStorage.paginaCorrente = currentPage;
}

//Legge l'oggetto JSON risposta che contiene informazioni sull'errore e restituisce codice HTML con la descrizione dello stesso.
var readErrorMessage = function(response) {
	var messaggio;
	if (response.data != undefined) {
		messaggio = response.data.message;
		if (response.data.errors != undefined) {
			messaggio += ": <br>";
			var errorLenght = response.data.errors.length;
			for (var index = 0; index < errorLenght; index++) {
				var error = response.data.errors[index];
				messaggio += "- " + error.cause + " <br>";
			}
		}
	} else {
		messaggio = "Errore " + response.status;
	}
	return messaggio;
}

//metodo per aprire/chiudere i dropdown
var apriChiudiDropdown = function(IDDropdown) {
	console.log("toggle dropdown " + IDDropdown);
	$("#" + IDDropdown).dropdown("toggle");
}

//Metodo essenziale quando tenti di chiudere una pagina con tanti modali, evidentemente c'è qualche bug.
//vedi: https://stackoverflow.com/questions/11519660/twitter-bootstrap-modal-backdrop-doesnt-disappear
var chiudiModale = function(IDModale) {
	$("#" + IDModale).modal("hide");
	$('.modal-backdrop').fadeOut(150); //Molto importante, non fare .remove();
};

var apriModale = function(IDModale) {
	$("#" + IDModale).modal("show");
}

//Inserisce il messaggio di errore nell'alert bootstrap per gli errori.
var mostraMessaggio = function(message, boxID) {
	if (boxID != undefined) {
		var htmlElement = document.getElementById(boxID);
		if (htmlElement != null && htmlElement != undefined) {
			htmlElement.innerHTML = message + '<span class="close" data-dismiss="alert" aria-label="close" >&times;</span>';
			$('#' + boxID).show();
		} else {
			console.log('Warning: elemento HTML non trovato tramite ID: ' + boxID);
		}
	}
}

var mostraElemento = function(boxID) {
	if (boxID != undefined)
		$('#' + boxID).show();
}

var nascondiElemento = function(boxID) {
	if (boxID != undefined)
		$('#' + boxID).hide();
}

//Imposta gli header per le richieste HTTP (attualmente solo la basic auth)
//In teoria si potrebbe impostare in maniera globale così:
//$http.defaults.headers.common.Authorization = 'Basic ...';
var getHTTPHeaderConfig = function() {
	var authString = sessionStorage.username + ':' + sessionStorage.password;
	var encodedAuthString = 'Basic ' + encodeBase64(authString);
	var config = {
			headers : {Authorization : encodedAuthString, 'Content-Type' : 'application/json;charset=UTF-8'}
	}
	return config;
};

//Funzione utile a cambiare elementi nello schermo per mostrare il caricamento
//E' importante valorizzare la proprietà name dell'oggetto.
var mostraCaricamento = function(isLoading, IDHtml) {
	var testo = document.getElementById(IDHtml).title;
	if (isLoading) {
		document.getElementById(IDHtml).innerHTML = '<i class="fa fa-refresh fa-spin" aria-hidden="true"></i> ' + testo;
		document.getElementById("main").style.cursor = "progress";
	} else {
		document.getElementById("main").style.cursor = "auto";
		document.getElementById(IDHtml).innerHTML = testo;
	}
};