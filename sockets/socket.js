const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');
const bands = new Bands();

console.log("init server");

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del Silencio'));
bands.addBand(new Band('Metallica'));

// Mensajes de Sockets
io.on('connection', client => {
    
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());  // Solo se emite al cliente que se conecte

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje',(payload) => {
        console.log('Mensaje!!!',payload.nombre);

        io.emit('mensaje',{admin: 'Nuevo mensaje'});
    });

    //client.on('emitir-mensaje',(payload) => {
        /* io.emit('nuevo-mensaje',payload); // emite a todos! */
    //    client.broadcast.emit('nuevo-mensaje',payload); // emite a todos menos el que lo emitio!
    //    console.log('Flutter: ', payload, "| LIMIT");
    //});

    client.on('vote-band',(payload) => {
        console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
    client.on('add-band',(payload) => {
        console.log('add-band');
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band',(payload) => {
        console.log('delete-band');
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands()); 
    });
});