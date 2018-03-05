window.onload=function(){
    ciudad = document.getElementById("ciudad");
    buscar=document.getElementById("buscar");
    borrarFavoritas=document.getElementById("borrarFavoritas")
    guardarUbicacionActual=document.getElementById("guardarUbicacionActual");
    txtUbicacionesFavoritas=document.getElementById("txtUbicacionesFavoritas");
    ubicacionesFavoritas=document.getElementById("ubicacionesFavoritas");
    borrarFavoritaActual=document.getElementById("borrarFavoritaActual");
    miUbicacion=document.getElementById("miUbicacion");
    informacion=document.getElementById("informacion");
    resultados=document.getElementById("resultados");
    clave=0;
    paises = document.getElementById("paises");
   contenedor=document.getElementById("contenedor");

    map=0;
    longitud=0;
    latitud=0;
    marker=new google.maps.Marker();
    geocoder = new google.maps.Geocoder();
    json=0;
    objetoJson=0;
    query=0;
    unicaCiudad=0;
    imagenes = new Array();
    textosPrevisiones=new Array()
    condiciones = new Array("tornado","tormenta tropical","huracanes","tormentas severas","tormentas eléctricas","lluvia mixta y nieve","lluvia mixta y aguanieve","nieve mixta y aguanieve","llovizna helada","llovizna","lluvia helada","llovizna","llovizna","ráfagas de nieve","chubascos de nieve","ventisca","nieve","granizo","aguanieve","polvo","niebla","bruma","niebla","borrascoso","viento","frío","nublado","mayormente nublado (noche)","mayormente nublado (día)","parcialmente nublado (noche)","parcialmente nublado (día)","claro (noche)","soleado","soleado (noche)","soleado (día)","lluvia mixta y granizo","caliente","tormentas aisladas","tormentas dispersas","tormentas dispersas","lluvias dispersas","nieve pesada","copos de nieve dispersos","nieve pesada","parcialmente nublado","tormenta de truenos","nevadas","tormentas de truenos aisladas","no disponible(3200)"); 
    imagenActual=document.createElement("img");
    textosPrevisionActual=document.createElement("p");
    existe=false;
    codigoActual="ES";
    paisActual="Spain";
    pais="Espa\u00f1a";
    ciudadActual="madrid";
      if(ciudad.value.length>0){
        buscar.disabled=false;
        buscar.className="button";
  
      }else{
        buscar.disabled=true;
        buscar.className="buttonDesactivated";

  
      }
    

    mostrarMapaBusqueda(ciudadActual+","+pais);
    mostrarTiempoBusqueda();
    anadirPaises();
    for(var i =0; i < localStorage.length;i++){
      var identificador=localStorage.key(i);
      var valores=this.localStorage.getItem(identificador);
      anadirUbicacion(ubicacionesFavoritas,valores,identificador);
    }
    document.onkeydown=function(elEvento){
      var evento = window.event||elEvento;
      if(evento.keyCode==13){
        
          ciudadActual=ciudad.value;
          unicaCiudad=ciudadActual.split(",");
          ciudadActual=unicaCiudad[0];
          mostrarMapaBusqueda(ciudadActual+" "+pais);
          mostrarTiempoBusqueda();
          ciudad.value="";
        


      }
     
    
    }
    document.onkeyup=function(elEvento){
      var evento = window.event||elEvento;

      if(evento.keyCode>=65||evento.keyCode<=90||evento.keyCode==8){
        if(ciudad.value.length>0){
          buscar.disabled=false;
          buscar.className="button";
    
        }else{
          buscar.disabled=true;
          buscar.className="buttonDesactivated";

    
        }
      }
    }
    buscar.onclick=function(){
      
        ciudadActual=ciudad.value;
        unicaCiudad=ciudadActual.split(",");
          ciudadActual=unicaCiudad[0];
        mostrarMapaBusqueda(ciudad.value+" "+pais);
        mostrarTiempoBusqueda();
        ciudad.value="";
    
      
    }
    paises.size=5;

    paises.onchange=function(){
      var indice = this.selectedIndex;
      var opcionSeleccionada = this.options[indice];
      codigoActual=opcionSeleccionada.id;
      pais=opcionSeleccionada.text;
      if(existe){
        for(var i=0; i < imagenes.length;i++){
          resultados.removeChild(imagenes[i]);
          resultados.removeChild(textosPrevisiones[i]);

          
        }
        resultados.removeChild(imagenActual);
        textosPrevisionActual.innerHTML="";
        existe=false;
      }
      resultados.style.overflowY="hidden";
      resultados.style.overflowX="hidden";
      informacion.innerHTML=pais;
      guardarUbicacionActual.disabled=true;
      guardarUbicacionActual.className="buttonDesactivated";
      mostrarMapaBusqueda(pais);
      
      

    }
    guardarUbicacionActual.onclick=function(){
        localStorage.setItem(codigoActual+ciudadActual,ciudadActual+","+pais);
        anadirUbicacion(ubicacionesFavoritas,ciudadActual+","+pais,codigoActual+ciudadActual);
        
    }
    ubicacionesFavoritas.onchange=function(){

      var indice = this.selectedIndex;
      var opcionSeleccionada = this.options[indice];
      codigoActual=opcionSeleccionada.id;
      codigoActual=codigoActual.substring(0,2);
      valores=opcionSeleccionada.text;
      valores=valores.split(",");
      ciudadActual=valores[0];
      pais=valores[1];
      mostrarMapaBusqueda(ciudadActual+" "+pais);
      mostrarTiempoBusqueda();

    }
      borrarFavoritas.onclick=function(){
        if(localStorage.length>0){
          localStorage.clear();
          while (ubicacionesFavoritas.length > 0) {
            ubicacionesFavoritas.remove(ubicacionesFavoritas.length-1);
          }
        }else{
          alert("No tienes ubicaciones favoritas")

        }
      
    }
    borrarFavoritaActual.onclick=function(){
      if(ubicacionesFavoritas.length>0){
        var indice = ubicacionesFavoritas.selectedIndex;
        if(indice==null||indice == undefined||indice!=0){
          alert("No has seleccionado ninguna ubicacion favorita")
        }else{
          var opcionSeleccionada = ubicacionesFavoritas.options[indice];
          idActual=opcionSeleccionada.id;
          localStorage.removeItem(idActual);
          ubicacionesFavoritas.remove(indice);
        }
       
      }else{
        alert("No tienes ubicaciones favoritas")
      }

      
    }
    miUbicacion.onclick=function(){
      getMiLocalizacion();
    }

  function mostrarTiempoBusqueda() {
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
          /*console.log(codigoActual);
          console.log(ciudadActual);
          console.log(paisActual);*/

          //Creamos el objeto de tipo JSON
          json = peticionHttp.responseText;
          objetoJson=eval("("+json+")"); //Con esto queremos que javascript lo entienda como un array
          //Obtenemos la raíz del JSON
          query=objetoJson.query;
          
          if(query.count==0||query.results.channel.location.country!=paisActual&&codigoActual!="EA"){
            informacion.innerHTML = "Ubicación no disponible";
            if(existe){
              for(var i=0; i < imagenes.length;i++){
                resultados.removeChild(imagenes[i]);
                resultados.removeChild(textosPrevisiones[i]);

                
              }
              resultados.removeChild(imagenActual);
              textosPrevisionActual.innerHTML="";
              existe=false;
              resultados.style.overflowY="hidden";
              resultados.style.overflowX="hidden";
              guardarUbicacionActual.disabled=true;
              guardarUbicacionActual.className="buttonDesactivated";

            }

        
          }else{
            guardarUbicacionActual.disabled=false;
            guardarUbicacionActual.className="button";

              pais=buscarPais(query.results.channel.location.country);
              if(pais==undefined){
                pais=query.results.channel.location.country;
              }
              ciudadActual=query.results.channel.location.city;
          
            

              informacion.innerHTML = primeraLetraMayuscula(ciudadActual)+",<br>"+pais;
            
            //query.results.channel.item.condition.temp;
         
            imagenActual.src="img/icons/"+query.results.channel.item.condition.code+".png";
            imagenActual.style.width="90px";
            imagenActual.style.height="90px";
            imagenActual.style.position="absolute";
            imagenActual.style.top="0px";
            textosPrevisionActual.style.position="absolute";
            textosPrevisionActual.style.top=parseInt(imagenActual.style.top)+parseInt(imagenActual.style.height)-10+"px";
            textosPrevisionActual.style.width="500px";
            textosPrevisionActual.style.height="10px";
            textosPrevisionActual.style.padding="10px";
            textosPrevisionActual.style.color="white";

            textosPrevisionActual.innerHTML="Temperatura actual : "+query.results.channel.item.condition.temp+"<br>"+"Humedad: "+query.results.channel.atmosphere.humidity+"<br> Viento: "+query.results.channel.wind.speed+"<br>"+primeraLetraMayuscula(condiciones[query.results.channel.item.condition.code]);
            textosPrevisionActual.style.fontSize="14px";

            resultados.appendChild(imagenActual);
            resultados.appendChild(textosPrevisionActual);

          
            dias=query;
            dias=query.results.channel.item.forecast;
          // alert(dias.length);
              if(!existe){
                for(var i=0; i < dias.length;i++){

                  imagenes[i]=document.createElement("img");
                  imagenes[i].style.position="absolute";

                  imagenes[i].src="img/icons/"+dias[i].code+".png";
                  imagenes[i].style.width="75px";
                  imagenes[i].style.height="75px";
                  imagenes[i].style.top="30px";
                  
      
                  if(i==0){
                    imagenes[i].style.left="160px";
      
                  }else{
                    imagenes[i].style.left=parseInt(imagenes[i-1].style.left)+parseInt(imagenes[i-1].style.width)+20+"px";
      
                  }
               
                  textosPrevisiones[i]=document.createElement("p");
                  textosPrevisiones[i].style.position="absolute";
                  textosPrevisiones[i].style.top=parseInt(imagenes[i].style.height)+parseInt(imagenes[i].style.top)+10+"px";
                  textosPrevisiones[i].style.width="80px";
                  textosPrevisiones[i].style.height="20px";
                  textosPrevisiones[i].style.fontSize="14px";
                  textosPrevisiones[i].style.color="white";
                  textosPrevisiones[i].style.left=parseInt(imagenes[i].style.left)+10+"px";
                  textosPrevisiones[i].innerHTML=diaInglesAEspanol(dias[i].day)+"&nbsp"+dias[i].date.substring(0,2)+"<br> "+dias[i].high+"°"+"&nbsp "+dias[i].low+"°";
                  resultados.appendChild(imagenes[i]);
                  resultados.appendChild(textosPrevisiones[i]);
                  resultados.style.overflowY="hidden";
                  resultados.style.overflowX="scroll";


              }
              existe=true;

            }else{
              for(var i=0; i < dias.length;i++){
                imagenes[i].src="img/icons/"+dias[i].code+".png";
                textosPrevisiones[i].innerHTML=diaInglesAEspanol(dias[i].day)+"&nbsp"+dias[i].date.substring(0,2)+"<br> "+dias[i].high+"°"+"&nbsp "+dias[i].low+"°";
              }


            }

          }
        }
      }
      buscar.disabled=true;
      buscar.className="buttonDesactivated";


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

          //Creamos el objeto de tipo JSON
          json = peticionHttp.responseText;
          objetoJson=eval("("+json+")"); //Con esto queremos que javascript lo entienda como un array
          //Obtenemos la raíz del JSON
          query=objetoJson.query;
          
          if(query.count==0){
            informacion.innerHTML = "Ubicación no disponible";
            if(existe){
              for(var i=0; i < imagenes.length;i++){
                resultados.removeChild(imagenes[i]);
                resultados.removeChild(textosPrevisiones[i]);

                
              }
              resultados.removeChild(imagenActual);
              textosPrevisionActual.innerHTML="";
              existe=false;
              resultados.style.overflowY="hidden";
              resultados.style.overflowX="hidden";
              guardarUbicacionActual.disabled=true;
              guardarUbicacionActual.className="buttonDesactivated";

            }

        
          }else{
              pais=buscarPais(query.results.channel.location.country);
              if(pais==undefined){
                pais=query.results.channel.location.country;
              }
              ciudadActual=query.results.channel.location.city;
              guardarUbicacionActual.disabled=false;
              guardarUbicacionActual.className="button";
  

            informacion.innerHTML = primeraLetraMayuscula(ciudadActual)+",<br>"+pais;
            
            //query.results.channel.item.condition.temp;
         
            imagenActual.src="img/icons/"+query.results.channel.item.condition.code+".png";
            imagenActual.style.width="90px";
            imagenActual.style.height="90px";
            imagenActual.style.position="absolute";
            imagenActual.style.top="0px";
            textosPrevisionActual.style.position="absolute";
            textosPrevisionActual.style.top=parseInt(imagenActual.style.top)+parseInt(imagenActual.style.height)-10+"px";
            textosPrevisionActual.style.width="500px";
            textosPrevisionActual.style.height="10px";
            textosPrevisionActual.style.padding="10px";

            textosPrevisionActual.innerHTML="Temperatura actual : "+query.results.channel.item.condition.temp+"<br>"+"Humedad: "+query.results.channel.atmosphere.humidity+"<br> Viento: "+query.results.channel.wind.speed+"<br>"+primeraLetraMayuscula(condiciones[query.results.channel.item.condition.code]);
            textosPrevisionActual.style.fontSize="14px";
            textosPrevisionActual.style.color="white";

            resultados.appendChild(imagenActual);
            resultados.appendChild(textosPrevisionActual);
            resultados.style.overflowY="hidden";
            resultados.style.overflowX="scroll";
          
            dias=query;
            dias=query.results.channel.item.forecast;
          // alert(dias.length);
              if(!existe){
                for(var i=0; i < dias.length;i++){

                  imagenes[i]=document.createElement("img");
                  imagenes[i].style.position="absolute";

                  imagenes[i].src="img/icons/"+dias[i].code+".png";
                  imagenes[i].style.width="75px";
                  imagenes[i].style.height="75px";
                  imagenes[i].style.top="30px";
                  
      
                  if(i==0){
                    imagenes[i].style.left="160px";
      
                  }else{
                    imagenes[i].style.left=parseInt(imagenes[i-1].style.left)+parseInt(imagenes[i-1].style.width)+10+"px";
      
                  }
                
                  textosPrevisiones[i]=document.createElement("p");
                  textosPrevisiones[i].style.position="absolute";
                  textosPrevisiones[i].style.top=parseInt(imagenes[i].style.height)+parseInt(imagenes[i].style.top)+10+"px";
                  textosPrevisiones[i].style.width="75px";
                  textosPrevisiones[i].style.height="20px";
                  textosPrevisiones[i].style.left=parseInt(imagenes[i].style.left)+10+"px";
                  textosPrevisiones[i].style.fontSize="14px";
                  textosPrevisiones[i].style.color="white";

                  textosPrevisiones[i].innerHTML=diaInglesAEspanol(dias[i].day)+"&nbsp"+dias[i].date.substring(0,2)+"<br> "+dias[i].high+"°"+"&nbsp "+dias[i].low+"°";
                 // alert(diaInglesAEspanol(dias[i].day));
                  resultados.appendChild(imagenes[i]);
                  resultados.appendChild(textosPrevisiones[i]);
                    //
              }
              existe=true;

            }else{
              for(var i=0; i < dias.length;i++){
                imagenes[i].src="img/icons/"+dias[i].code+".png";
                textosPrevisiones[i].innerHTML=diaInglesAEspanol(dias[i].day)+"&nbsp"+dias[i].date.substring(0,2)+"<br> "+dias[i].high+"°"+"&nbsp "+dias[i].low+"°";
             
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
  function anadirUbicacion(padre,valor,identificador){
    opcion = document.createElement("option");
    opcion.setAttribute("value",valor);
    textoLista = document.createTextNode(valor);
    opcion.appendChild(textoLista);
    opcion.id=identificador;
    padre.appendChild(opcion);
  }


  function anadirPaises() {
    for(var clave in valoresEnEspanol){
      nombre=valoresEnEspanol[clave];
      crearLista(paises,nombre,clave);

    }  
  }

  function buscarCodigo() {
      //Recorremos el array
      for(var clave in valoresEnIngles){
        nombre=valoresEnIngles[clave];
        if(codigoActual==clave){
          paisActual=nombre;
          //alert(paisActual);
        }
    
      }
  }


  function primeraLetraMayuscula(palabra){
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);

  }
 
/*
  function mostrarMapa(marker,map) {
    google.maps.event.addListener(map, 'click', function(event) {
      placeMarker(map, event.latLng,mapOptions,marker);
    });
    var mapElemento = document.getElementById("map");
    mapElemento.style.position="relative";
    mapElemento.style.top="290px";
    mapElemento.style.width="98%";
    mapElemento.style.height="400px";


    var myCenter=new google.maps.LatLng(51.508742,-0.120850);
    var opcionesMapa = {center: myCenter, zoom: 5 ,    scrollwheel:true};
    map = new google.maps.Map(mapElemento, opcionesMapa);
    
  }*/

  function placeMarker(map, location,opcionesMapa,marker) {
    markerActual=marker;
    marker.setPosition(location);
    marker.setMap(map);
    longitud=location.lng();
    latitud=location.lat();

    map.setCenter(marker.getPosition());
    mostrarTiempoPincharMapa();

  }
  function mostrarMapaBusqueda(direccionActual) {
    var direccion=direccionActual;
    geocoder.geocode({ 'address': direccion}, geocodeResult);
  }
  function geocodeResult(results, status) {
    if (status == 'OK') {
      var mapElemento = document.getElementById("map");
    
        var opcionesMapa = {
            center: results[0].geometry.location,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom:10,
            scrollwheel:true
                      
        };
        map = new google.maps.Map(mapElemento, opcionesMapa);
        // fitBounds acercará el mapa con el zoom adecuado de acuerdo a lo buscado
        map.fitBounds(results[0].geometry.viewport);
        // Dibujamos un marcador con la ubicación del primer resultado obtenido
        var markerOptions = { position: results[0].geometry.location }
        marker.setOptions(markerOptions);
        marker.setMap(map);
       // console.log(results[0].address_components);
        for(var i =0; i < results[0].address_components.length;i++){
          var types=results[0].address_components[i].types;
          for(var j =0; j < types.length;j++){
            if(types[0]=="country"){
              results[0].address_components[i].short_name;
              pais=results[0].address_components[i].long_name;
              codigoActual=results[0].address_components[i].short_name;
              paisActual=buscarPaisEnIngles(codigoActual);

              paises.value=pais;

            }
          }
        }
        google.maps.event.addListener(map, 'click', function(event) {
          placeMarker(map, event.latLng,opcionesMapa,marker);
        });

      
    } else {
        // En caso de no haber resultados o que haya ocurrido un error
        // lanzamos un mensaje con el error
        console.log("Geocoding no tuvo éxito debido a: " + status);
    }
  }

  function buscarPais(paisABuscar){
    var nombreEnIngles;
    var nombreEnEspanol;
    for(var clave in valoresEnIngles){
      nombreEnIngles=valoresEnIngles[clave];
      nombreEnEspanol=valoresEnEspanol[clave];
      if(nombreEnIngles==paisABuscar){
        paisActual=nombreEnIngles;
        codigoActual=clave;
        paises.value=nombreEnEspanol;
          return nombreEnEspanol;
        //alert(paisActual);
      }
    
    }
  }
  function buscarPaisEnIngles(codigoABuscar){
    var nombreEnIngles;
    for(var clave in valoresEnIngles){
      nombreEnIngles=valoresEnIngles[clave];
      if(clave==codigoABuscar){
      
          return nombreEnIngles;
        //alert(paisActual);
      }
    
    }
  }
  function getMiLocalizacion() {
    if (navigator.geolocation) {
      
        navigator.geolocation.getCurrentPosition(function(objPosition)
		{
      mostrarPosicionActual(objPosition)
		}, function(objPositionError)
		{
			switch (objPositionError.code)
			{
        case objPositionError.PERMISSION_DENIED:
        alert( "No se ha permitido el acceso a la posición del usuario.");
      break;
      case objPositionError.POSITION_UNAVAILABLE:
        alert( "No se ha podido acceder a la información de su posición.");
      break;
      case objPositionError.TIMEOUT:
        alert( "El servicio ha tardado demasiado tiempo en responder.");
      break;
      default:
      alert("Error desconocido.");
    
			}
		}, {
			maximumAge: 75000,
			timeout: 15000
		});
    } else {
      console.log( "Geolocation is not supported by this browser.");
    }
  }
  function mostrarPosicionActual(position) {
    latitud=position.coords.latitude;
    longitud= position.coords.longitude;
    mostrarMapaBusqueda(latitud+","+longitud);
    mostrarTiempoPincharMapa();
  }
}
/*https://github.com/umpirsky/country-list para los paises */

/*api key para la api del google maps AIzaSyAJYBfdVFUaj7KVFsJ317ckoFQNJEpsVk0 */ 