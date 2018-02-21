window.onload=function(){
  cuerpo=document.body;
  ciudad = document.getElementById("ciudad");
  buscar=document.getElementById("buscar");
  paises = document.getElementById("paises");
  temperatura=document.getElementById("temperatura");
  map=0;
  longitud=0;
  latitud=0;
  marker=new google.maps.Marker();
  geocoder = new google.maps.Geocoder();

  imagenes = new Array();
  textosPrevisiones=new Array()
  condiciones = new Array("tornado","tormenta tropical","huracanes","tormentas severas","tormentas eléctricas","lluvia mixta y nieve","lluvia mixta y aguanieve","nieve mixta y aguanieve","llovizna helada","llovizna","lluvia helada","llovizna","llovizna","ráfagas de nieve","chubascos de nieve","ventisca","nieve","granizo","aguanieve","polvo","niebla","bruma","niebla","borrascoso","viento","frío","nublado","mayormente nublado (noche)","mayormente nublado (día)","parcialmente nublado (noche)","parcialmente nublado (día)","claro (noche)","soleado","soleado (noche)","soleado (día)","lluvia mixta y granizo","caliente","tormentas aisladas","tormentas dispersas","tormentas dispersas","lluvias dispersas","nieve pesada","copos de nieve dispersos","nieve pesada","parcialmente nublado","tormenta de truenos","nevadas","tormentas de truenos aisladas","no disponible(3200)"); 
  imagenActual=document.createElement("img");
  textosPrevisionActual=document.createElement("p");
  existe=false;
  codigoActual="AF";
  paisActual="Afghanistan";
  pais="Afganist\u00e1n";
  ciudadActual="";
  anadirPaises();
  mostrarMapaBusqueda(pais);
  document.onkeydown=function(elEvento){
    var evento = window.event||elEvento;
    if(evento.keyCode==13){
      ciudadActual=ciudad.value;
      pincharEnMapa=false;
      mostrarTiempoBusqueda();
      mostrarMapaBusqueda(ciudad.value+" "+pais);

      ciudad.value="";


    }
  }
  buscar.onclick=function(){
    ciudadActual=ciudad.value;


    mostrarTiempoBusqueda();
    mostrarMapaBusqueda(ciudad.value+" "+pais);

      ciudad.value="";
  }
  
  paises.onchange=function(){
    var indice = this.selectedIndex;

    var opcionSeleccionada = this.options[indice];
    codigoActual=opcionSeleccionada.id;
     pais=opcionSeleccionada.text;
    buscarCodigo();
    mostrarMapaBusqueda(pais);

     

  }
}


function mostrarTiempoBusqueda() {
  parametroUno=0;
  parametro2=1;
  if(!pincharEnMapa){
    parametroUno=ciudad.value;
    parametro2=codigoActual;
  }else{
    parametroUno=latitud;
    parametro2=longitud;
  }
    
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
  peticionHttp.open('GET', "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='("+ciudadActual+","+codigoActual+")') and u='c'&format=json", true);
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
        
        if(query.count==0||query.results.channel.location.country!=paisActual&&codigoActual!="EA"){
          temperatura.innerHTML = "No existe la ciudad";
          if(existe){
            for(var i=0; i < imagenes.length;i++){
              cuerpo.removeChild(imagenes[i]);
              cuerpo.removeChild(textosPrevisiones[i]);

              
            }
            cuerpo.removeChild(imagenActual);
            textosPrevisionActual.innerHTML="";
            existe=false;
          }

       
        }else{
          
          temperatura.innerHTML = primeraLetraMayuscula(ciudadActual)+","+pais;
          //query.results.channel.item.condition.temp;
          temperatura.style.top="100px";
          imagenActual.src="img/icons/"+query.results.channel.item.condition.code+".png";
          imagenActual.style.width="100px";
          imagenActual.style.height="100px";
          imagenActual.style.position="absolute";
          imagenActual.style.top="90px";
          textosPrevisionActual.style.position="absolute";
          textosPrevisionActual.style.top=parseInt(imagenActual.style.top)+"px";
          textosPrevisionActual.style.width="50%";
          textosPrevisionActual.style.height="70px";
          textosPrevisionActual.style.left=parseInt(imagenActual.style.width)+5+"px";
          textosPrevisionActual.innerHTML="Temperatura actual : "+query.results.channel.item.condition.temp+"<br>"+"Humedad: "+query.results.channel.atmosphere.humidity;

          cuerpo.appendChild(imagenActual);
          cuerpo.appendChild(textosPrevisionActual);

         
          dias=query;
          dias=query.results.channel.item.forecast;
         // alert(dias.length);
            if(!existe){
              for(var i=0; i < dias.length;i++){

                imagenes[i]=document.createElement("img");
                imagenes[i].style.position="absolute";

                imagenes[i].src="img/icons/"+dias[i].code+".png";
                imagenes[i].style.width="80px";
                imagenes[i].style.height="80px";
                imagenes[i].style.top=parseInt(textosPrevisionActual.style.height)+parseInt(textosPrevisionActual.style.top)+25+"px";
                
    
                if(i==0){
                  imagenes[i].style.left="10px";
    
                }else{
                  imagenes[i].style.left=parseInt(imagenes[i-1].style.left)+parseInt(imagenes[i-1].style.width)+50+"px";
    
                }
                textosPrevisiones[i]=document.createElement("p");
                textosPrevisiones[i].style.position="absolute";
                textosPrevisiones[i].style.top=parseInt(imagenes[i].style.height)+parseInt(imagenes[i].style.top)+5+"px";
                textosPrevisiones[i].style.width="8%";
                textosPrevisiones[i].style.height="70px";
                textosPrevisiones[i].style.left=imagenes[i].style.left;
                textosPrevisiones[i].innerHTML=dias[i].date+"<br> max "+dias[i].high+"°"+"&nbspmin "+dias[i].low+"°"+"<br>"+primeraLetraMayuscula(condiciones[dias[i].code]);
                cuerpo.appendChild(imagenes[i]);
                cuerpo.appendChild(textosPrevisiones[i]);

            }
            existe=true;

          }else{
            for(var i=0; i < dias.length;i++){
              imagenes[i].src="img/icons/"+dias[i].code+".png";
              textosPrevisiones[i].innerHTML=dias[i].date+"<br> max "+dias[i].high+"°"+"&nbspmin "+dias[i].low+"°"+"<br>"+primeraLetraMayuscula(condiciones[dias[i].code]);

            }


          }

        }
       
      }
    }
  }
}

function mostrarTiempoPincharMapa() {
 
    
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
  peticionHttp.open('GET', "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='("+latitud+","+longitud+")') and u='c'&format=json", true);
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
        
        if(query.count==0){
          temperatura.innerHTML = "No existe la ciudad";
          if(existe){
            for(var i=0; i < imagenes.length;i++){
              cuerpo.removeChild(imagenes[i]);
              cuerpo.removeChild(textosPrevisiones[i]);

              
            }
            cuerpo.removeChild(imagenActual);
            textosPrevisionActual.innerHTML="";
            existe=false;
          }

       
        }else{
            buscarPais(query.results.channel.location.country);
            ciudadActual=query.results.channel.location.city;
          temperatura.innerHTML = primeraLetraMayuscula(ciudadActual)+","+pais;
          //query.results.channel.item.condition.temp;
          temperatura.style.top="100px";
          imagenActual.src="img/icons/"+query.results.channel.item.condition.code+".png";
          imagenActual.style.width="100px";
          imagenActual.style.height="100px";
          imagenActual.style.position="absolute";
          imagenActual.style.top="90px";
          textosPrevisionActual.style.position="absolute";
          textosPrevisionActual.style.top=parseInt(imagenActual.style.top)+"px";
          textosPrevisionActual.style.width="50%";
          textosPrevisionActual.style.height="70px";
          textosPrevisionActual.style.left=parseInt(imagenActual.style.width)+5+"px";
          textosPrevisionActual.innerHTML="Temperatura actual : "+query.results.channel.item.condition.temp+"<br>"+"Humedad: "+query.results.channel.atmosphere.humidity;

          cuerpo.appendChild(imagenActual);
          cuerpo.appendChild(textosPrevisionActual);

         
          dias=query;
          dias=query.results.channel.item.forecast;
         // alert(dias.length);
            if(!existe){
              for(var i=0; i < dias.length;i++){

                imagenes[i]=document.createElement("img");
                imagenes[i].style.position="absolute";

                imagenes[i].src="img/icons/"+dias[i].code+".png";
                imagenes[i].style.width="80px";
                imagenes[i].style.height="80px";
                imagenes[i].style.top=parseInt(textosPrevisionActual.style.height)+parseInt(textosPrevisionActual.style.top)+25+"px";
                
    
                if(i==0){
                  imagenes[i].style.left="10px";
    
                }else{
                  imagenes[i].style.left=parseInt(imagenes[i-1].style.left)+parseInt(imagenes[i-1].style.width)+50+"px";
    
                }
                textosPrevisiones[i]=document.createElement("p");
                textosPrevisiones[i].style.position="absolute";
                textosPrevisiones[i].style.top=parseInt(imagenes[i].style.height)+parseInt(imagenes[i].style.top)+5+"px";
                textosPrevisiones[i].style.width="8%";
                textosPrevisiones[i].style.height="70px";
                textosPrevisiones[i].style.left=imagenes[i].style.left;
                textosPrevisiones[i].innerHTML=dias[i].date+"<br> max "+dias[i].high+"°"+"&nbspmin "+dias[i].low+"°"+"<br>"+primeraLetraMayuscula(condiciones[dias[i].code]);
                cuerpo.appendChild(imagenes[i]);
                cuerpo.appendChild(textosPrevisiones[i]);

            }
            existe=true;

          }else{
            for(var i=0; i < dias.length;i++){
              imagenes[i].src="img/icons/"+dias[i].code+".png";
              textosPrevisiones[i].innerHTML=dias[i].date+"<br> max "+dias[i].high+"°"+"&nbspmin "+dias[i].low+"°"+"<br>"+primeraLetraMayuscula(condiciones[dias[i].code]);

            }


          }

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
            //alert(paisActual);
          }
        
        }
      }
    }
  }
}

function buscarPais(paisEnIngles) {

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
          if(paisEnIngles==nombre){
            paisActual=nombre;
            pais=paisActual;

            //alert(paisActual);
          }
        
        }
      }
    }
  }
}
function primeraLetraMayuscula(palabra){
  return palabra.charAt(0).toUpperCase() + palabra.slice(1);

}
/*function mostrarMapa() {
  var mapCanvas = document.getElementById("map");
  mapCanvas.style.position="relative";
  mapCanvas.style.top=parseInt(textosPrevisiones[textosPrevisiones.length-1].style.height)+parseInt(textosPrevisiones[textosPrevisiones.length-1].style.top)+25+"px";
  var mapOptions = {
    center: new google.maps.LatLng(51.508742, -0.120850),
    zoom: 6
  };
  map = new google.maps.Map(mapCanvas, mapOptions);
}*/

function mostrarMapa(marker,map) {
  var mapCanvas = document.getElementById("map");
  mapCanvas.style.position="relative";
  mapCanvas.style.top="290px";
  var myCenter=new google.maps.LatLng(51.508742,-0.120850);
  var mapOptions = {center: myCenter, zoom: 5 ,    scrollwheel:true};
   map = new google.maps.Map(mapCanvas, mapOptions);
  google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(map, event.latLng,mapOptions,marker);
  });
}

function placeMarker(map, location,mapOptions,marker) {
  markerActual=marker;
  marker.setPosition(location);
  marker.setMap(map);
  pincharEnMapa=true;
  longitud=location.lng();
  latitud=location.lat();
  map.setCenter(marker.getPosition());
  mostrarTiempoPincharMapa();
  mostrarMapaBusqueda(latitud+","+longitud);
}
function mostrarMapaBusqueda(direccionActual) {
  var direccion=direccionActual;
  geocoder.geocode({ 'address': direccion}, geocodeResult);
}
function geocodeResult(results, status) {
  // Verificamos el estatus
  if (status == 'OK') {
      // Si hay resultados encontrados, centramos y repintamos el mapa
      // esto para eliminar cualquier pin antes puesto
    var mapCanvas = document.getElementById("map");
  mapCanvas.style.position="relative";
  mapCanvas.style.top="290px";
      var mapOptions = {
          center: results[0].geometry.location,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoom:10,
          scrollwheel:true
                    
      };
      map = new google.maps.Map(mapCanvas, mapOptions);
      // fitBounds acercará el mapa con el zoom adecuado de acuerdo a lo buscado
      map.fitBounds(results[0].geometry.viewport);
      // Dibujamos un marcador con la ubicación del primer resultado obtenido
      var markerOptions = { position: results[0].geometry.location }
      marker.setOptions(markerOptions);
      marker.setMap(map);
      //console.log(results[0].address_components);
      
      google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(map, event.latLng,mapOptions,marker);
      });
  } else {
      // En caso de no haber resultados o que haya ocurrido un error
      // lanzamos un mensaje con el error
      alert("Geocoding no tuvo éxito debido a: " + status);
  }
}


/*https://github.com/umpirsky/country-list para los paises */

/*api key para la api del google maps AIzaSyAJYBfdVFUaj7KVFsJ317ckoFQNJEpsVk0 */ 
