module.exports = io => {
  let userGroup = {};
  io.on('connection', socket => {
    // // when the client emits 'new message', this listens and executes
    // socket.on('new message', function (data) {
    //   // we tell the client to execute 'new message'
    //   socket.broadcast.emit('new message', {
    //     username: socket.username,
    //     message: data
    //   });
    // });
    console.log('connect to user:', socket.id);
    socket.on('id myself', obj => {
      console.log('id', obj);
    });

    socket.on('pairInfo', obj => {
      socket.emit('pairInfo');
    });

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
