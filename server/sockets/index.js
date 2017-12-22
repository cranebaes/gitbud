module.exports = io => {
  io.on('connection', socket => {
    console.log('a user connected');
    console.log('this user socket.id', socket.id);
    // // when the client emits 'new message', this listens and executes
    // socket.on('new message', function (data) {
    //   // we tell the client to execute 'new message'
    //   socket.broadcast.emit('new message', {
    //     username: socket.username,
    //     message: data
    //   });
    // });

    socket.on('chat message', msg => {
      console.log(msg);
      socket.broadcast.emit('chat message', msg);
    });
    socket.on('pendInvitation', msg => {
      console.log(msg);
      socket.broadcast.emit('chat message', msg);
    });

    socket.on('updateInterestList', () => {
      socket.broadcast.emit('updateInterestList');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
