window.onload=function(){
  ciudad = document.getElementById("ciudad");
  buscar=document.getElementById("buscar");
  paises = document.getElementById("paises");
  temperatura=document.getElementById("temperatura");
  codigoActual="AF";
  paisActual="Afghanistan";
  //listaCreada=false;
  anadirPaises();
  //listaCreada=true;
  document.onkeydown=function(elEvento){
    var evento = window.event||elEvento;
    if(evento.keyCode==13){
      mostrarTiempo();
      ciudad.value="";

    }
  }
  buscar.onclick=function(){
    mostrarTiempo();
      ciudad.value="";
  }
  
  paises.onchange=function(){
    var indice = this.selectedIndex;

    var opcionSeleccionada = this.options[indice];
    codigoActual=opcionSeleccionada.id;
    buscarCodigo();

     

  }
}


function mostrarTiempo() {  
  // Obtener la instancia del objeto XMLHttpRequest
  if(window.XMLHttpRequest) {
     peticionHttp = new XMLHttpRequest();
  }
  else if(window.ActiveXObject) {
    peticionHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  // Preparamos la funcion de respuesta
  peticionHttp.onreadystatechange = muestraContenido;
  // Realizamos peticion HTTP
  peticionHttp.open('GET', "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+ciudad.value+","+codigoActual+"') and u='c'&format=json", true);
  peticionHttp.send(null);
  function muestraContenido() {
    if(peticionHttp.readyState == 4) {
      if(peticionHttp.status == 200) {
        console.log(codigoActual);

        //Creamos el objeto de tipo JSON
        var json = peticionHttp.responseText;
        var objetoJson=eval("("+json+")"); //Con esto queremos que javascript lo entienda como un array
        //Obtenemos la raíz del JSON
        var query=objetoJson.query;
        
        if(query.count==0||query.results.channel.location.country!=paisActual){
          temperatura.innerHTML = "No existe la ciudad";

        }else{
          temperatura.innerHTML = query.results.channel.item.condition.temp;

        }
       
      }
    }
  }
}

function crearLista(padre,texto,codigo){
  opcion = document.createElement("option");
  opcion.setAttribute("value",texto);
  textoLista = document.createTextNode(texto);
  opcion.appendChild(textoLista);
  opcion.id=codigo;
  padre.appendChild(opcion);
}

function anadirPaises() {

  // Obtener la instancia del objeto XMLHttpRequest
  if(window.XMLHttpRequest) {
    peticionHttp = new XMLHttpRequest();
  }
  else if(window.ActiveXObject) {
    peticionHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  // Preparamos la funcion de respuesta
  peticionHttp.onreadystatechange = muestraContenido;
  // Realizamos peticion HTTP
  peticionHttp.open('GET', 'json/paises.json', true);
  peticionHttp.send(null);
  function muestraContenido() {
    if(peticionHttp.readyState == 4) {
      if(peticionHttp.status == 200) {
        //Creamos el objeto de tipo JSON
        var json = peticionHttp.responseText;
        var objetoJson=eval("("+json+")"); //Con esto queremos que javascript lo entienda como un array
        var valores=objetoJson; 
        //Recorremos el array
        for(var clave in valores){
          nombre=valores[clave];

        
          crearLista(paises,nombre,clave);

        }
      }
    }
  }
}

function buscarCodigo() {

  // Obtener la instancia del objeto XMLHttpRequest
  if(window.XMLHttpRequest) {
    peticionHttp = new XMLHttpRequest();
  }
  else if(window.ActiveXObject) {
    peticionHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  // Preparamos la funcion de respuesta
  peticionHttp.onreadystatechange = muestraContenido;
  // Realizamos peticion HTTP
  peticionHttp.open('GET', 'json/paisesen.json', true);
  peticionHttp.send(null);
  function muestraContenido() {
    if(peticionHttp.readyState == 4) {
      if(peticionHttp.status == 200) {
        //Creamos el objeto de tipo JSON
        var json = peticionHttp.responseText;
        var objetoJson=eval("("+json+")"); //Con esto queremos que javascript lo entienda como un array
        var valores=objetoJson; 
        //Recorremos el array
        for(var clave in valores){
          nombre=valores[clave];
          if(codigoActual==clave){
            paisActual=nombre;
            alert(paisActual);
          }
        }
      }
    }
  }
}


/*https://github.com/umpirsky/country-list para los paises */
