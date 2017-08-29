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
  maxWidth: 'none',
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
      receivedMessage:'receivedMessage',
      //for popUp window
      open: false,
      isPaired: false,
      curProjectId: null,
      curProjectProperty: null,
    }
    this.expandCard = () => {
      this.setState({ expanded: true });
    }

    socket.on('chat message', (msg) => this.renderMessages(msg));
    //receive messages
    this.addPair = this.addPair.bind(this);
    this.togglePair = this.togglePair.bind(this);
    this.pairButton = this.pairButton.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveProjectId = this.retrieveProjectId.bind(this);

    this.initialize();

    this.setMessageText = (_, text) => this.setState({ message: text });
    this.sendMessage = () => {
      axios.post('/API/messages', {
        text: this.state.message,
        recipient: this.props.user.id,
      })
        .then(() => {
          this.props.dispatchMessage(this.props.user.id, {
            text: this.state.message,
            sender: true,
          });
        });
    };
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.retrieveProjectId();
      resolve();
    })
    .then(() => {
      this.checkIfPaired();
    })
  }

  checkIfPaired() {
    axios.get('/API/pairedProjects', {
      params: {
        userId: this.props.loggedInUserGhId,
        partnerId: this.props.user.ghId
      }
    })
    .then((pairProjects) => {
      if (pairProjects.data.length > 0) {
        this.setState({
          buttonClicked: true
        })
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }


  addPair() {
    axios.post('/API/pair', {
      partnered: this.props.user.id,
      project: this.state.curProjectId,  //this is undefined
    })
      .then((response) => {
        this.props.createPairing(response.data);
        this.setState({buttonClicked: !this.state.buttonClicked});
        //window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });

      axios.get('/')
  }
  togglePair() {
    axios.post('/API/pair', {
      partnered: this.props.user.id,
      project: this.state.curProjectId,
    })
      .then((response) => {
        //this.props.dispatchPairing(this.props.user.id, this.state.curProjectId);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  /* dialog  handler*/
  handleOpen() {
    //console.log("clicked")
    this.setState({open: true});
  };
  handleClose() {
    this.setState({open: false});
  };
  /* dialog  handler end*/
  pairButton() {
    if (this.state.buttonClicked) {
      console.log('these are the props for UserDetails', this);
      return <div>
      <RaisedButton
      label='Partnered'
      labelColor={ fullWhite }
      backgroundColor='#a4c639'
      fullWidth={true}
      icon={ <ActionDone
        color={ fullWhite } /> }
        onClick={ this.addPair } />
      <RaisedButton
        label="Let's Work!"
        fullWidth={true}
        icon={ <ActionBuild /> }
        href="/my-projects"
        primary={ true } />
          </div>
    } else if (!this.state.buttonClicked) {
      return <RaisedButton
        label='Work With Me'
        fullWidth={true}
        icon={ <ActionAdd /> }
        onClick={ this.addPair }
        primary={ true } />
    }
  };

  handleSubmit(event) {
    event.preventDefault();
    // socket.emit('chat message', );
    var newMessage = {
      message: this._message.value,
      username: this.props.loggedInUser
    }

    var myMessage = {
      username: "me: ",
      message: this._message.value
    }

    var updatedChatBox = this.state.chatBox
    updatedChatBox.push(myMessage)

    this.setState({
      chatBox: updatedChatBox
    });

    socket.emit('chat message', newMessage); //send msg
    console.log(newMessage);
  };

  getMessages() {
    axios.get('API/messages')
      .then((res) => {
        this.props.loadMessages(res.data)
      })
      .catch(console.error);
  }


  renderMessages(msg) {
    console.log("asdadadadasd", this.state.chatBox)
    var updatedChatBox= this.state.chatBox;
    updatedChatBox.push(msg);
    this.setState({
      chatBox: updatedChatBox
    });
  };

  retrieveProjectId() {
    const userId = this.props.user.ghId;
    axios.get('/API/project', {
      params: {
        id: userId
      }
    })
      .then((project) => {
        this.state.curProjectId = project.data.id;
        this.state.curProjectProperty = project.data;
      })
      .catch(console.error);
  };

  render() {
    console.log('USER DETAILS props', this.props);
     const actions = [
      <div>
       <form onSubmit={this.handleSubmit}>
        <input ref={(message) => this._message = message} id="newMessage" type="text"/>
        <FlatButton primary={true} type="submit">Send</FlatButton>
      </form>
      </div>,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />
    ];
    return (
      <Paper style={{ width: '95%', margin: 'auto', marginTop: 12, padding: 12 }}>
        <Card expanded={this.state.expanded} style={{ width: '40%', marginLeft: 'auto', marginRight: 'auto', marginBottom: 12 }}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="User Profile" />
            </ToolbarGroup>
          </Toolbar>
          <CardMedia>
            <div className="img-container">
              <img className="img-circle" src={this.props.user.avatarUrl} alt="" />
            </div>
          </CardMedia>
          <CardTitle title={ this.props.user.name } subtitle={'Experience: ' + this.props.user.experience} />
          <CardTitle title="Description" subtitle={this.props.user.description} />
          <CardTitle title="Language" subtitle={this.props.user.language}/>
          <CardTitle title="Projects" subtitle={this.props.projects.map(project => project.project).join(' ')}/>
          <div>
            { this.pairButton() }
            <RaisedButton label='Message Me' fullWidth={true} icon={<ActionFace />} onClick={this.expandCard} secondary={true} />
          </div>
        {/*dialog for message*/}
          <div>
          <Dialog
            title="Send a message"
            actions={actions}
            modal={true}
            contentStyle={customContentStyle}
            open={this.state.open}
            autoScrollBodyContent={true}
          >
            <ul id="messages"></ul>
              {this.state.chatBox.map((chat, index) => {
                return(
                  <div>
                    <strong>{chat.username}</strong>
                    <p>{chat.message}</p>

                  </div>
                )}
              )}
          </Dialog>
        </div>
        {/*dialog for message end*/}
          {/* should be deleted */}

            <div expandable={true}>
            <TextField
              floatingLabelText="Ask user to pair up"
              hintText="Enter your message"
              style={{ padding: 20 }}
              onChange={ this.setMessageText }
            />
          </div>
          <div expandable={true}>
            <RaisedButton label="Send" onClick={ this.sendMessage } fullWidth={true} icon={<ContentSend />} secondary={true}/>
            { this.props.messages.map((message, index) =>
              <Card key={ index }>
                <CardTitle>{ message.sender ? 'You' : this.props.user.name }</CardTitle>
                <CardText>{ message.text }</CardText>
              </Card>
            )}
          </div>
          {/* should be deleted end*/}


        </Card>
      </Paper>
    );
  }
}
const mapStateToProps = (state, props) => {
  console.log("line 267", props)
  const userId = Number(props.match.params.id);
  const user = state.users.filter(user => user.id === userId)[0];
  const projects = state.projects.filter(project => user.projects.indexOf(project.id) > -1)
  const loggedInUser = state.loggedInUser.username;
  const loggedInUserGhId = state.loggedInUser.ghId;
  return {
    user,
    projects,
    messages: state.messages[userId] || [],
    loggedInUser,
    loggedInUserGhId,
  };
};
const mapDispatchToProps = dispatch =>
  ({
    loadMessages: messages => dispatch({
      type: 'MESSAGES_LOAD',
      messages,
    }),
    createPairing: (pairs) => dispatch({ type: 'ADD_PAIRING', pairs }),
    dispatchPairing: (userId, projectId) => dispatch({ type: 'CHANGE_USER_PAIRING', userId, projectId }),
    dispatchMessage: (userId, message) => dispatch({ type: 'MESSAGE_SEND', userId, message }),
  });
export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
    
/* <CardMedia overlay={ <CardTitle title={ this.props.user.name } subtitle='Experience: n00b'/> }>
  <img src={ this.props.user.avatarUrl } />
</CardMedia> */
