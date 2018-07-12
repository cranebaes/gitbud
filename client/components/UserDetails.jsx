/* eslint no-console:0 */
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import chatBox from './MyPartners';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { Card, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import { fullWhite } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import ActionFace from 'material-ui/svg-icons/action/face';
import ActionBuild from 'material-ui/svg-icons/action/build';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionAdd from 'material-ui/svg-icons/social/person';
import ContentSend from 'material-ui/svg-icons/content/send';
import TextField from 'material-ui/TextField';
/* for Dialog  */
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const customContentStyle = {
  width: '80%',
  height: '100%',
  maxWidth: 'none'
};
/* for Dialog  */

import io from 'socket.io-client';

const socket = io();

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log('this is props of UserDetails', props);
    this.state = {
      buttonClicked: false,
      expanded: false,
      partnerName: '',
      message: 'placeholder',
      chatBox: [],
      myMessage: 'myMessage',
      receivedMessage: 'receivedMessage',
      // for popUp window
      open: false,
      isPaired: false,
      curProjectId: null,
      curProjectProperty: null
    };
    this.expandCard = () => {
      this.setState({ expanded: true });
    };

    socket.on('chat message', msg => this.renderMessages(msg));
    // receive messages
    this.addPair = this.addPair.bind(this);
    this.unPair = this.unPair.bind(this);
    this.getPairs = this.getPairs.bind(this);
    this.pairButton = this.pairButton.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveProjectId = this.retrieveProjectId.bind(this);
    // this.sendinvitations = this.sendinvitations.bind(this);
    this.initialize();

    this.setMessageText = (_, text) => this.setState({ message: text });
    this.sendMessage = () => {
      axios
        .post('/API/messages', {
          text: this.state.message,
          recipient: this.props.user.id
        })
        .then(() => {
          this.props.dispatchMessage(this.props.user.id, {
            text: this.state.message,
            sender: true
          });
        });
    };
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.retrieveProjectId();
      resolve();
    }).then(() => {
      this.checkIfPaired();
    });
  }
  getPairs() {
    console.log('get pairs runninnnngnggngg');
    axios
      .get('/API/pairs')
      .then(pairs => {
        this.props.loadPairedUsers(pairs.data);
        console.log('get pairs runnin', pairs.data);
      })
      .catch(console.error);
  }

  checkIfPaired() {
    axios
      .get('/API/pairedProjects', {
        params: {
          userId: this.props.loggedInUserGhId,
          partnerId: this.props.user.ghId
        }
      })
      .then(pairProjects => {
        if (pairProjects.data.length > 0) {
          this.setState({
            buttonClicked: true
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  addPair() {
    axios
      .post('/API/pair', {
        partnered: this.props.user.id,
        project: this.state.curProjectId
      })
      .then(response => {
        console.log('addPair!!!!!!!', response.data);
        this.props.createPairing(response.data);
        this.setState({ buttonClicked: !this.state.buttonClicked });
        // window.location.reload(); // REACT needs this after a POST
        socket.emit('pairInfo');
        this.getPairs();
      })
      .catch(error => {
        console.log(error);
      });

    axios.get('/');
  }

  unPair() {
    axios
      .post('/API/unpair', {
        partnered: this.props.user.id,
        project: this.state.curProjectId
      })
      .then(() => {
        console.log('testGHid', this.props.user.id);
        const partneredId = this.props.user.id;
        this.props.removingPairing(partneredId);
        this.setState({ buttonClicked: !this.state.buttonClicked });
        // window.location.reload(); // REACT needs this after a POST
        socket.emit('pairInfo');
        this.getPairs();
      })
      .catch(error => {
        console.log(error);
      });

    axios.get('/');
  }

  // sendinvitations() {
  //   // socketIO send invitation
  //   // change work with me to invitation pending
  //   console.log(this.props.user.id);
  //   console.log('userDetails', socket.id);
  //   let userInfo = {
  //     inviteeGithubId: this.props.user.id,
  //     inviterGithubId: this.props.loggedInUserGhId
  //   };
  //   socket.emit('pendingInvitation', userInfo);
  //   // waiting for comfirmation from another user
  //   // change it here
  // }

  /* dialog  handler */
  handleOpen() {
    // console.log("clicked")
    this.setState({ open: true });
  }
  handleClose() {
    this.setState({ open: false });
  }
  /* dialog  handler end */
  pairButton() {
    if (this.state.buttonClicked) {
      console.log('these are the props for UserDetails', this);
      return (
        <div>
          <RaisedButton
            label="unPartner"
            labelColor={fullWhite}
            backgroundColor="#a4c639"
            fullWidth
            icon={<ActionFace color={fullWhite} />}
            onClick={this.unPair}
          />
          <RaisedButton
            label="Let's Work!"
            fullWidth
            icon={<ActionBuild />}
            href="/my-projects"
            primary
          />
        </div>
      );
    } else if (!this.state.buttonClicked) {
      return (
        <RaisedButton
          label="Work With Me"
          fullWidth
          icon={<ActionAdd />}
          onClick={this.addPair}
          primary
        />
      );
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const newMessage = {
      message: this._message.value,
      username: this.props.loggedInUser
    };

    const myMessage = {
      username: 'me: ',
      message: this._message.value
    };

    const updatedChatBox = this.state.chatBox;
    updatedChatBox.push(myMessage);

    this.setState({
      chatBox: updatedChatBox
    });

    socket.emit('chat message', newMessage); // send msg
  }

  getMessages() {
    axios
      .get('API/messages')
      .then(res => {
        this.props.loadMessages(res.data);
      })
      .catch(console.error);
  }

  renderMessages(msg) {
    const updatedChatBox = this.state.chatBox;
    updatedChatBox.push(msg);
    this.setState({
      chatBox: updatedChatBox
    });
  }

  retrieveProjectId() {
    const userId = this.props.user.ghId;
    axios
      .get('/API/project', {
        params: {
          id: userId
        }
      })
      .then(project => {
        this.state.curProjectId = project.data.id;
        this.state.curProjectProperty = project.data;
      })
      .catch(console.error);
  }

  render() {
    socket.on('pairInfo', () => {
      this.checkIfPaired();
      // this.getPairs();
    });
    const userInfo = {
      userId: this.props.loggedInUserGhId,
      socketId: socket.id
    };
    // socket.emit('id myself', userInfo);
    const actions = [
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            ref={message => (this._message = message)}
            id="newMessage"
            type="text"
          />
          <FlatButton primary type="submit">
            Send
          </FlatButton>
        </form>
      </div>,
      <FlatButton label="Cancel" primary onClick={this.handleClose} />
    ];
    return (
      <Paper
        style={{ width: '95%', margin: 'auto', marginTop: 12, padding: 12 }}
      >
        <Card
          expanded={this.state.expanded}
          style={{
            width: '40%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 12
          }}
        >
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="User Profile" />
            </ToolbarGroup>
          </Toolbar>
          <CardMedia>
            <div className="img-container">
              <img
                className="img-circle"
                src={this.props.user.avatarUrl}
                alt=""
              />
            </div>
          </CardMedia>
          <CardTitle
            title={this.props.user.name}
            subtitle={`Experience: ${this.props.user.experience}`}
          />
          <CardTitle
            title="Description"
            subtitle={this.props.user.description}
          />
          <CardTitle title="Language" subtitle={this.props.user.language} />
          <CardTitle
            title="Projects"
            subtitle={this.props.projects
              .map(project => project.project)
              .join(' ')}
          />
          <div>
            {this.pairButton()}
            <RaisedButton
              label="Message Me"
              fullWidth
              icon={<ActionFace />}
              onClick={this.expandCard}
              secondary
            />
          </div>
          {/* dialog for message */}
          <div>
            <Dialog
              title="Send a message"
              actions={actions}
              modal
              contentStyle={customContentStyle}
              open={this.state.open}
              autoScrollBodyContent
            >
              <ul id="messages" />
              {this.state.chatBox.map((chat, index) => (
                <div>
                  <strong>{chat.username}</strong>
                  <p>{chat.message}</p>
                </div>
              ))}
            </Dialog>
          </div>
          {/* dialog for message end */}
          {/* should be deleted */}

          <div expandable>
            <TextField
              floatingLabelText="Ask user to pair up"
              hintText="Enter your message"
              style={{ padding: 20 }}
              onChange={this.setMessageText}
            />
          </div>
          <div expandable>
            <RaisedButton
              label="Send"
              onClick={this.sendMessage}
              fullWidth
              icon={<ContentSend />}
              secondary
            />
            {this.props.messages.map((message, index) => (
              <Card key={index}>
                <CardTitle>
                  {message.sender ? 'You' : this.props.user.name}
                </CardTitle>
                <CardText>{message.text}</CardText>
              </Card>
            ))}
          </div>
          {/* should be deleted end */}
        </Card>
      </Paper>
    );
  }
}
const mapStateToProps = (state, props) => {
  const userId = Number(props.match.params.id);
  const user = state.allUsers.filter(user => user.id === userId)[0];
  const projects = state.projects.filter(
    project => user.projects.indexOf(project.id) > -1
  );
  const loggedInUser = state.loggedInUser.username;
  const loggedInUserGhId = state.loggedInUser.ghId;
  return {
    user,
    projects,
    messages: state.messages[userId] || [],
    loggedInUser,
    loggedInUserGhId
  };
};
const mapDispatchToProps = dispatch => ({
  loadMessages: messages =>
    dispatch({
      type: 'MESSAGES_LOAD',
      messages
    }),
  createPairing: pairs =>
    dispatch({
      type: 'ADD_PAIRING',
      pairs
    }),
  removingPairing: ghId =>
    dispatch({
      type: 'DEL_PAIRING',
      ghId
    }),
  loadPairedUsers: pairedUsers =>
    dispatch({
      type: 'LOAD_PAIRING',
      pairedUsers
    }),
  dispatchPairing: (userId, projectId) =>
    dispatch({
      type: 'CHANGE_USER_PAIRING',
      userId,
      projectId
    }),
  dispatchMessage: (userId, message) =>
    dispatch({
      type: 'MESSAGE_SEND',
      userId,
      message
    })
});
export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
