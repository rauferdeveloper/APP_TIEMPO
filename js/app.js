window.onload=function(){
  buscar = document.getElementById("buscar");
  document.onkeydown=function(elEvento){
    var evento = window.event||elEvento;
    if(evento.keyCode==13){
      mostrarTiempo();

    }
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
  peticionHttp.open('GET', "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+buscar.value+"') and u='c'&format=json", true);
  peticionHttp.send(null);
  function muestraContenido() {
    if(peticionHttp.readyState == 4) {
      if(peticionHttp.status == 200) {
        //Creamos el objeto de tipo JSON
        var json = peticionHttp.responseText;
        var objetoJson=eval("("+json+")"); //Con esto queremos que javascript lo entienda como un array
        //Obtenemos la raíz del JSON
        var wind = objetoJson.query.results.channel.item.condition.temp;
        alert(wind);
       
      }
    }
  }
}
