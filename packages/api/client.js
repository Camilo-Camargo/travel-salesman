const io = require('socket.io-client');
const socket = io('http://localhost:3000');

// Escuchar eventos del servidor
socket.on('connect', () => {
  console.log('Connected to server');

  // Enviar datos para crear un viaje
  socket.emit('travelCreated', {
    from: 'CityA',
    to: 'CityB',
    fuelCost: 100,
  });

  // Enviar datos para crear una ruta
  socket.emit('foundRouteCreated', [
    {
      from: { name: 'CityA', lat: 34.05, lng: -118.25 },
      to: { name: 'CityB', lat: 36.16, lng: -115.15 },
      distance: 270,
      price: 200,
    },
    {
      from: { name: 'CityB', lat: 34.05, lng: -118.25 },
      to: { name: 'CityC', lat: 36.16, lng: -115.15 },
      distance: 280,
      price: 300,
    },
  ]);

});

// Manejar las respuestas del servidor
socket.on('travelCreated', (data) => {
  console.log('Travel Created:', data);
});

socket.on('foundRouteCreated', (data) => {
  console.log('Found Route Created:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});