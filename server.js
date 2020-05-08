const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
var five = require("johnny-five");
var os = require('os');
var ifaces = os.networkInterfaces();

const board = new five.Board();

const app = express();
const server = http.createServer(app);
const io = SocketIO.listen(server);

app.use(express.static(__dirname + '/public'));
server.listen(3000, () => console.log('server on port 3000'));

board.on("ready", () => {
    var contador =0;
    t = 0;
  const proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  });
  photoresistor = new five.Sensor({
    pin: "A2",
    freq: 250
  });
  board.repl.inject({
    pot: photoresistor
  });
  const led = new five.Led(8);
  board.repl.inject({
    led
  });
    
  var imu = new five.IMU({
    controller: "MPU6050"
  });
  

  io.sockets.on('connection', function(socket){
      
   proximity.on("change", () => {
    const {centimeters} = proximity;
       if(centimeters<30){
           contador=contador+1;
          socket.emit('ultrasonico', contador); 
          //socket.emit('ultrasonico', centimeters); 
       }
    
    //console.log("Proximity: ");
    //console.log("  cm  : ", centimeters);
    //console.log("-----------------");
  });
  
  photoresistor.on("data", function() {
    socket.emit('photo', this.value);
      if(this.value > 800){
          led.on();
      }else{
          led.stop().off();
      }
  });
      
  socket.on('encender', function (data) {
  led.on();
      console.log('encendido');
  socket.emit('encendido', "Led encendido");
  });
      
  socket.on('apagar', function (data) {
  led.stop().off();
      console.log('apagado');
  socket.emit('apagado', "Led apagado");
  });
      
      
  imu.on("change", function() {

      if(this.accelerometer.x < 0){
          socket.emit('equis', "Derecha");
      }
      if(this.accelerometer.x > 0.105){
          socket.emit('equis', "izquierda");
      }
      if(this.accelerometer.y > 0){
          socket.emit('ye', "atras");
      }
      if(this.accelerometer.y < -0.002){
          socket.emit('ye', "adelante");
      }
    
    /*console.log("  x            : ", this.accelerometer.x);
    console.log("  y            : ", this.accelerometer.y);
    console.log("  z            : ", this.accelerometer.z);*/
  });
      
      
  Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
        socket.emit('TitAdress',iface.address);
    
    } else {
      // this interface has only one ipv4 adress
        socket.emit('TitAdress',iface.address);
    
    }
    ++alias;
  });
});

});
  
});



//<a href="#" id="btni"><img src="ab.jpg" id="imgi"></a>
//socket.emit('ultrasonico', centimeters);