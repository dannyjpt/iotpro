const socket = io();


if (annyang) {

  var commands = {
    'Apagar' : Apagar,
    'Encender' : Encender,
  };

  function Apagar(){
  	//socket.emit('apagar', 1);
      alert("apagar");
  }

  function Encender(){
  	//socket.emit('encender', 0);
      alert('encender');
  }

  annyang.addCommands(commands);
  annyang.setLanguage("es-CO");

  annyang.start();
}

socket.on('ultrasonico', function (data) {
  
  //alert('Ventilador encendido');
  //document.getElementById('imgi').src = "ab.gif";
  var ult = parseInt(data);
  ultrasonico.innerHTML = `${ult}`;
});
socket.on('photo', function (data) {
  
  //alert('Ventilador encendido');
  //document.getElementById('imgi').src = "ab.gif";
  photo.innerHTML = `${data}`;
});

socket.on('TitAdress', function (data) {
  
  
  tittleAdress.innerHTML = ` ${data}:3000`;
    
});

socket.on('equis', function (data) {
  
  equis.innerHTML = `${data}`;

});

socket.on('ye', function (data) {
  
  ye.innerHTML = `${data}`;

});

socket.on('apagado', function (data) {
  
  //alert('Ventilador apagado');
  $("#ledd").val(`encender`);

});

socket.on('encendido', function (data) {
  
  //alert('Ventilador apagado');
  $("#ledd").val(`apagar`);

});

$( "#ledd" ).click(function() {
  var ledv = $("#ledd").val();
    
  if(ledv == "encender"){
    socket.emit('encender', 0);
  }else{
    socket.emit('apagar', 1);
  }
});