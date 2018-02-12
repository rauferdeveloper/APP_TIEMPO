window.onload=function(){
  cuerpo=document.body;
  ciudad = document.getElementById("ciudad");
  buscar=document.getElementById("buscar");
  paises = document.getElementById("paises");
  temperatura=document.getElementById("temperatura");

  imagenes = new Array();
  textosPrevisiones=new Array()

  imagenes[0]=document.createElement("img");
  textosPrevisiones[0]=document.createElement("p");
  existe=false;
  codigoActual="AF";
  paisActual="Afghanistan";
  pais="Afganist\u00e1n";
  ciudadActual="";

  anadirPaises();
  document.onkeydown=function(elEvento){
    var evento = window.event||elEvento;
    if(evento.keyCode==13){
      ciudadActual=ciudad.value;

      mostrarTiempo();
      ciudad.value="";


    }
  }
  buscar.onclick=function(){
    ciudadActual=ciudad.value;

    mostrarTiempo();
      ciudad.value="";
  }
  
  paises.onchange=function(){
    var indice = this.selectedIndex;

    var opcionSeleccionada = this.options[indice];
    codigoActual=opcionSeleccionada.id;
     pais=opcionSeleccionada.text;
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
        
        if(query.count==0||query.results.channel.location.country!=paisActual&&codigoActual!="EA"){
          temperatura.innerHTML = "No existe la ciudad";
          if(existe){
            for(var i=1; i < imagenes.length;i++){
              cuerpo.removeChild(imagenes[i]);
              
            }
            for(var i=1; i < textosPrevisiones.length;i++){
              cuerpo.removeChild(textosPrevisiones[i]);
              
            }
            cuerpo.removeChild(textosPrevisiones[0]);
            cuerpo.removeChild(textosPrevisiones[0]);

            existe=false;
          }

       
        }else{
          temperatura.innerHTML = primeraLetraMayuscula(ciudadActual)+","+pais;
          //query.results.channel.item.condition.temp;
          temperatura.style.top="100px";
          imagenes[0].src="img/icons/"+query.results.channel.item.condition.code+".png";
          imagenes[0].style.width="100px";
          imagenes[0].style.height="100px";
          imagenes[0].style.position="absolute";
          textosPrevisiones[0].style.position="absolute";
          textosPrevisiones[0].style.top="200px";
          textosPrevisiones[0].style.width="50%";
          textosPrevisiones[0].style.height="70px";
          textosPrevisiones[0].innerHTML="Temperatura actual : "+query.results.channel.item.condition.temp+"<br>"+"Humedad: "+query.results.channel.atmosphere.humidity;

          cuerpo.appendChild(imagenes[0]);
          cuerpo.appendChild(textosPrevisiones[0]);

         
          dias=query;
          dias=query.results.channel.item.forecast;
          alert(dias.length);
            if(!existe){
              for(var i=1; i < dias.length;i++){

                imagenes[i]=document.createElement("img");
                imagenes[i].style.position="absolute";

                imagenes[i].src="img/icons/"+dias[i].code+".png";
                imagenes[i].style.width="80px";
                imagenes[i].style.height="80px";
                imagenes[i].style.top=parseInt(textosPrevisiones[0].style.height)+parseInt(textosPrevisiones[0].style.top)+5+"px";
                
    
                if(i==1){
                  imagenes[i].style.left="0px";
    
                }else{
                  imagenes[i].style.left=parseInt(imagenes[i-1].style.left)+parseInt(imagenes[i-1].style.width)+50+"px";
    
                }
                textosPrevisiones[i]=document.createElement("p");
                textosPrevisiones[i].style.position="absolute";
                textosPrevisiones[i].style.top=parseInt(imagenes[i].style.height)+parseInt(imagenes[i].style.top)+5+"px";
                textosPrevisiones[i].style.width="10%";
                textosPrevisiones[i].style.height="70px";
                textosPrevisiones[i].style.left=imagenes[i].style.left;
                textosPrevisiones[i].innerHTML=dias[i].date+"<br> max "+dias[i].high+"°"+"&nbspmin "+dias[i].low+"°";
                cuerpo.appendChild(imagenes[i]);
                cuerpo.appendChild(textosPrevisiones[i]);

            }
            existe=true;

          }else{
            for(var i=1; i < dias.length;i++){
              imagenes[i].src="img/icons/"+dias[i].code+".png";
              textosPrevisiones[i].innerHTML=dias[i].date+"<br> max "+dias[i].high+"°"+"&nbspmin "+dias[i].low+"°";

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
            alert(paisActual);
          }
        }
      }
    }
  }
}
function primeraLetraMayuscula(palabra){
  return palabra.charAt(0).toUpperCase() + palabra.slice(1);

}
/*https://github.com/umpirsky/country-list para los paises */
