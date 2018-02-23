window.onload=function(){
    cuerpo=document.body;
    ciudad = document.getElementById("ciudad");
    buscar=document.getElementById("buscar");

    paises = document.getElementById("paises");
    informacion=document.getElementById("informacion");
    cuerpo =document.body;
    cuerpo.style.backgroundSize="100%";
    cuerpo.style.backgroundImage="url('img/fondoapp.jpg')";

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
    codigoActual="AF";
    paisActual="Afghanistan";
    pais="Afganist\u00e1n";
    ciudadActual="";
    getLocation();
    anadirPaises();
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
    buscar.onclick=function(){
      ciudadActual=ciudad.value;
      unicaCiudad=ciudadActual.split(",");
        ciudadActual=unicaCiudad[0];
      mostrarMapaBusqueda(ciudad.value+" "+pais);
      mostrarTiempoBusqueda();
      ciudad.value="";
    }
    
    paises.onchange=function(){
      var indice = this.selectedIndex;
      var opcionSeleccionada = this.options[indice];
      codigoActual=opcionSeleccionada.id;
      pais=opcionSeleccionada.text;
      if(existe){
        for(var i=0; i < imagenes.length;i++){
          cuerpo.removeChild(imagenes[i]);
          cuerpo.removeChild(textosPrevisiones[i]);

          
        }
        cuerpo.removeChild(imagenActual);
        textosPrevisionActual.innerHTML="";
        informacion.innerHTML="";
        existe=false;
      }
      mostrarMapaBusqueda(pais);
      
      

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
          console.log(codigoActual);
          console.log(ciudadActual);
          console.log(paisActual);

          //Creamos el objeto de tipo JSON
          json = peticionHttp.responseText;
          objetoJson=eval("("+json+")"); //Con esto queremos que javascript lo entienda como un array
          //Obtenemos la raíz del JSON
          query=objetoJson.query;
          
          if(query.count==0||query.results.channel.location.country!=paisActual&&codigoActual!="EA"){
            informacion.innerHTML = "La ubicación no corresponde con el país";
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
            
            informacion.innerHTML = primeraLetraMayuscula(ciudadActual)+","+pais;
            //query.results.channel.item.condition.temp;
            informacion.style.top="100px";
            imagenActual.src="img/icons/"+query.results.channel.item.condition.code+".png";
            imagenActual.style.width="100px";
            imagenActual.style.height="100px";
            imagenActual.style.position="absolute";
            imagenActual.style.top="100px";
            textosPrevisionActual.style.position="absolute";
            textosPrevisionActual.style.top=parseInt(imagenActual.style.top)+"px";
            textosPrevisionActual.style.width="50%";
            textosPrevisionActual.style.height="70px";
            textosPrevisionActual.style.left=parseInt(imagenActual.style.width)+20+"px";
            textosPrevisionActual.style.padding="20px";

            textosPrevisionActual.innerHTML="Temperatura actual : "+query.results.channel.item.condition.temp+"<br>"+"Humedad: "+query.results.channel.atmosphere.humidity+"<br>Viento: "+query.results.channel.wind.speed;

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
                  imagenes[i].style.top=parseInt(textosPrevisionActual.style.height)+parseInt(textosPrevisionActual.style.top)+75+"px";
                  
      
                  if(i==0){
                    imagenes[i].style.left="5px";
      
                  }else{
                    imagenes[i].style.left=parseInt(imagenes[i-1].style.left)+parseInt(imagenes[i-1].style.width)+55+"px";
      
                  }
                  textosPrevisiones[i]=document.createElement("p");
                  textosPrevisiones[i].style.position="absolute";
                  textosPrevisiones[i].style.top=parseInt(imagenes[i].style.height)+parseInt(imagenes[i].style.top)+10+"px";
                  textosPrevisiones[i].style.width="10%";
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

          //Creamos el objeto de tipo JSON
          json = peticionHttp.responseText;
          objetoJson=eval("("+json+")"); //Con esto queremos que javascript lo entienda como un array
          //Obtenemos la raíz del JSON
          query=objetoJson.query;
          
          if(query.count==0){
            informacion.innerHTML = "La ubicación no corresponde con el país";
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
              pais=buscarPais(query.results.channel.location.country);
              if(pais==undefined){
                pais=query.results.channel.location.country;
              }
              ciudadActual=query.results.channel.location.city;
          
            

              informacion.innerHTML = primeraLetraMayuscula(ciudadActual)+","+pais;
            //query.results.channel.item.condition.temp;
            informacion.style.top="100px";
            imagenActual.src="img/icons/"+query.results.channel.item.condition.code+".png";
            imagenActual.style.width="100px";
            imagenActual.style.height="100px";
            imagenActual.style.position="absolute";
            imagenActual.style.top="100px";
            textosPrevisionActual.style.position="absolute";
            textosPrevisionActual.style.top=parseInt(imagenActual.style.top)+"px";
            textosPrevisionActual.style.width="50%";
            textosPrevisionActual.style.height="70px";
            textosPrevisionActual.style.left=parseInt(imagenActual.style.width)+20+"px";
            textosPrevisionActual.style.padding="20px";

            textosPrevisionActual.innerHTML="Temperatura actual : "+query.results.channel.item.condition.temp+"<br>"+"Humedad: "+query.results.channel.atmosphere.humidity+"<br>Viento: "+query.results.channel.wind.speed;

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
                  imagenes[i].style.top=parseInt(textosPrevisionActual.style.height)+parseInt(textosPrevisionActual.style.top)+75+"px";
                  
      
                  if(i==0){
                    imagenes[i].style.left="5px";
      
                  }else{
                    imagenes[i].style.left=parseInt(imagenes[i-1].style.left)+parseInt(imagenes[i-1].style.width)+55+"px";
      
                  }
                  textosPrevisiones[i]=document.createElement("p");
                  textosPrevisiones[i].style.position="absolute";
                  textosPrevisiones[i].style.top=parseInt(imagenes[i].style.height)+parseInt(imagenes[i].style.top)+10+"px";
                  textosPrevisiones[i].style.width="10%";
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
    
  }

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
    // Verificamos el estatus
    if (status == 'OK') {
        // Si hay resultados encontrados, centramos y repintamos el mapa
        // esto para eliminar cualquier pin antes puesto
      var mapElemento = document.getElementById("map");
      mapElemento.style.position="relative";
      mapElemento.style.top="350px";
      mapElemento.style.width="99%";
      mapElemento.style.height="220px";
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
        console.log(results[0].address_components);
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
        alert("Geocoding no tuvo éxito debido a: " + status);
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
  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert( "Geolocation is not supported by this browser.");
    }
  }
  function showPosition(position) {
    latitud=position.coords.latitude;
    longitud= position.coords.longitude;
    mostrarMapaBusqueda(latitud+","+longitud);
    mostrarTiempoPincharMapa();
  }
}
/*https://github.com/umpirsky/country-list para los paises */

/*api key para la api del google maps AIzaSyAJYBfdVFUaj7KVFsJ317ckoFQNJEpsVk0 */ 