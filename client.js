
/**
 * Classe que representa um token de autorização.
 *
 * @constructor
 *
 * @param {string} token - A sequência de caracteres que representa o Token.
 * @param {number} expirationTime - Número de segundos que o token durará.
 * @param {string} scope - A lista de escopos (separados por espaço) que foi autorizado pelo usuário.
 */
var Token = function(value, expirationTimeInSeconds, scope) {
  
  /* Atributos */

  var value = value;
  var startTime = new Date().getTime(); // O valor em milissegundos.
  var finishTime = new Date(startTime + expirationTimeInSeconds * 1000); // O objeto Date.
  var scope = scope;
  
  // Cria os cookies para o token, seu momento da expiração e seus escopos.
  
  if (!Cookies.get('suapToken')) {
    Cookies.set('suapToken', value, { expires: finishTime});
  } else {
    value = Cookies.get('suapToken');
  }

  if (!Cookies.get('suapTokenExpirationTime')) {
    Cookies.set('suapTokenExpirationTime', finishTime, { expires: finishTime});
  } else {
    finishTime = Cookies.get('suapTokenExpirationTime');
  }

  if (!Cookies.get('suapScope')) {
    Cookies.set('suapScope', scope, { expires: finishTime});
  } else {
    scope = Cookies.get('suapScope');
  }

  this.getValue = function() {
    return value;
  };

  this.getExpirationTime = function() {
    return finishTime;
  };

  this.getScope = function() {
    return scope;
  };

  this.isValid = function() {
    if (Cookies.get('suapToken') && value != null) {
      return true;
    }
    return false;
  };

  this.revoke = function() {

    value = null;
    startTime = null;
    finishTime = null;

    if (Cookies.get('suapToken')){
      Cookies.remove('suapToken');
    }

    if (Cookies.get('suapTokenExpirationTime')){
      Cookies.remove('suapTokenExpirationTime');
    }

    if (Cookies.get('suapScope')){
      Cookies.remove('suapScope');
    }

  };

};


/**
 * Classe principal do SDK e seu construtor, que inicializa os principais atributos.
 *
 * @constructor
 *
 * @param {string} authHost - URI do host de autenticação.
 * @param {string} clientID - ID da aplicação registrado no SuapClient.
 * @param {string} redirectURI - URI de redirecionamento da aplicação cadastrada no SuapClient.
 *
 */
 var SuapClient = function(authHost, clientID, redirectURI, scope) {

  /* Atributos privados */

  var authHost = authHost;
  var clientID = clientID;
  var redirectURI = redirectURI;
  var scope = scope;

  var resourceURL = authHost + '/api/eu/';
  var authorizationURL = authHost + '/o/authorize/';
  var logoutURL = authHost + '/o/revoke_token/';

  var responseType = 'token';
  var grantType = 'implict'; // Necessário para utilizar Oauth2 com Javascript

  // Remove a '/' caso ela já esteja inserida no auth_host.
  if (authHost.charAt(authHost.length - 1) == '/') {
    authHost = authHost.substr(0, authHost.length - 1);
  }

  var dataJSON;
  var token;

  /* Métodos privados */

  /**
   * Extrai o token da URL e retorna-o.
   *
   * @return {string} O token de autorização presente na URL de retorno.
   */
  var extractToken = function() {
    var match = document.location.hash.match(/access_token=(\w+)/);
    if (match != null) {
      return !!match && match[1];
    }
    return null;
  };


  /**
   * Extrai os escopos autorizados da URL e retorna-os caso o usuário já esteja autenticado.
   * @return {string} Escopos autorizados pelo usuário (separados por espaço).
   */
  var extractScope = function() {
    var match = document.location.hash.match(/scope=(.*)/);
    if (match != null) {
      return match[1].split('+').join(' ');
    }
    return null;
  };

  /**
   * Extrai o tempo de duração do token (em segundos) da URL.
   * @return {number} Tempo de duração do token.
   */
  var extractDuration = function() {

    var match = document.location.hash.match(/expires_in=(\d+)/);

    if (match != null) {
      return Number(!!match && match[1]);
    }

    return 0;
  };

  var getCookie = function (name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  };


  /* Métodos públicos */

  /**
   * Inicializa os objetos token e o dataJSON.
   *
   */
  this.init = function() {
    token = new Token(extractToken(), extractDuration(), extractScope());
    dataJSON = {};
  };

  /**
   * Retorna o objeto token.
   *
   * @return {string} token se o usuário estiver autenticado; null caso contrário.
   */
  this.getToken = function() {
    return token;
  };


  /**
   * Retorna o objeto dataJSON, que contém os dados retornados após a requisição Ajax.
   *
   * @return {Object} O objeto JSON com os dados requisitados.
   */
  this.getDataJSON = function() {
    return dataJSON;
  };


  /**
   * Retorna a URI de redirecionamento.
   *
   * @return {string} URI de redirecionamento.
   */
  this.getRedirectURI = function() {
    return redirectURI;
  };

  /**
   * Retorna se o usuário está autenticado ou não com base no estado do token.
   * @return {Boolean} true se o usuário estiver autenticado; false caso contrário.
   */
  this.isAuthenticated = function() {
    return token.isValid();
  };


  /**
   * Cria a URL de login com todos os parâmetros da aplicação.
   * @return {string} A URL de login do SuapClient.
   */
  this.getLoginURL = function() {
    var loginUrl = authorizationURL +
      "?response_type=" + responseType +
      "&grant_type="    + grantType +
      "&client_id="     + clientID +
      "&scope="  + scope;
      "&redirect_uri="  + redirectURI;
    return loginUrl;
  };


  /**
   * Cria a URL de cadastro com retorno.
   * @return {string} A URL de cadastro do SuapClient.
   */
  this.getRegistrationURL = function() {
    var registrationUrl = authHost +
      "/register/" +
      "?redirect_uri="  + redirectURI;
    return registrationUrl;
  };

  this.getResource = function(scope, callback) {
  	$.ajax({
		url: resourceURL,
        data: {'scope': scope},
        headers: {"Authorization": "Bearer " + token.getValue(),
                  "Accept": "application/json"},
		type: 'GET',
		success: function(response) {
			console.log(response);
			callback(response);
		},
		error: function(response) {
			alert('Falha na comunicação com o SUAP');
            console.log(response);
		}
    });
  };

  this.login = function() {
    window.location = this.getLoginURL();
  };
	
  this.logout = function() {
  	$.ajax({
		url: logoutURL,
        data: {'token': token.getValue(), 'client_id': clientID},
		type: 'POST',
		success: function(response) {
			token.revoke();
			window.location = redirectURI;
		},
		error: function(response) {
			alert('Falha na comunicação com o SUAP');
            console.log(response);
		}
    });
  };
  
};