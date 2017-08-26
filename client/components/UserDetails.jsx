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
    this.state = {
      expanded: false,
      partnerName: '',
      message: 'placeholder',
      chatBox: [],
      myMessage: 'myMessage',
      receivedMessage:'receivedMessage',
      //for popUp window
      open: false,
    }
    this.paired = false;
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

  addPair() {
    axios.post('/API/pair', {
      partnered: this.props.user.id,
      project: this.props.match.params.projectId,
    })
      .then((response) => {
        console.log('this is props from clicking', this.props);
        this.props.createPairing(this.props.user.name, this.props.user.language, this.props.user.experience);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  togglePair() {
    axios.post('/API/pair', {
      partnered: this.props.user.id,
      project: this.props.match.params.projectId,
    })
      .then((response) => {
        this.props.dispatchPairing(this.props.user.id, Number(this.props.match.params.projectId));
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* dialog  handler*/
  handleOpen() {
    console.log("clicked")
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };
  /* dialog  handler end*/

  pairButton() {
    if (this.props.user.paired.length > 0) {
      return <RaisedButton
        label='Partnered'
        labelColor={ fullWhite }
        backgroundColor='#a4c639'
        fullWidth={true}
        icon={ <ActionDone
          color={ fullWhite } /> }
          onClick={ this.togglePair } />
    } else if (this.props.match.params.projectId) {
      return <RaisedButton
        label='Work With Me'
        fullWidth={true}
        icon={ <ActionBuild /> }
        onClick={ this.addPair }
        primary={ true } />
    }
  };

  handleSubmit(event) {
    event.preventDefault();
    // socket.emit('chat message', );
    var newMessage = {
      message: this._message.value,
      username: this.props.user.name
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


  renderMessages(msg) {
    console.log("asdadadadasd", this.state.chatBox)
    var updatedChatBox= this.state.chatBox;
    updatedChatBox.push(msg);
    this.setState({
      chatBox: updatedChatBox
    });
  };

  render() {
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
            <RaisedButton label='Message Me' fullWidth={true} icon={<ActionFace />} onClick={this.handleOpen} secondary={true} />
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
          {
          //   <div expandable={true}>
          //   <TextField
          //     floatingLabelText="Ask user to pair up"
          //     hintText="Enter your message"
          //     style={{ padding: 20 }}
          //     onChange={ this.setMessageText }
          //   />
          // </div>
          // <div expandable={true}>
          //   <RaisedButton label="Send" onClick={ this.sendMessage } fullWidth={true} icon={<ContentSend />} secondary={true}/>
          //   { this.props.messages.map((message, index) =>
          //     <Card key={ index }>
          //       <CardTitle>{ message.sender ? 'You' : this.props.user.name }</CardTitle>
          //       <CardText>{ message.text }</CardText>
          //     </Card>
          //   )}
          // </div>
          // {/* should be deleted end*/}
          }

        </Card>
      </Paper>
    );
  }
}

const mapStateToProps = (state, props) => {
  const userId = Number(props.match.params.id);
  const user = state.users.filter(user => user.id === userId)[0];
  const projects = state.projects.filter(project => user.projects.indexOf(project.id) > -1)
  return {
    user,
    projects,
    messages: state.messages[userId] || [],
  };
};

const mapDispatchToProps = dispatch =>
  ({
    createPairing: (name, language, experience) => dispatch({ type: 'ADD_PAIRING', name, language, experience }),
    dispatchPairing: (userId, projectId) => dispatch({ type: 'CHANGE_USER_PAIRING', userId, projectId }),
    dispatchMessage: (userId, message) => dispatch({ type: 'MESSAGE_SEND', userId, message }),
  });

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);



/* <CardMedia overlay={ <CardTitle title={ this.props.user.name } subtitle='Experience: n00b'/> }>
  <img src={ this.props.user.avatarUrl } />
</CardMedia> */
