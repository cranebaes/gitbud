import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarTitle
} from 'material-ui/Toolbar';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import SocialPartyMode from 'material-ui/svg-icons/social/party-mode';

import io from 'socket.io-client';
const socket = io();


const style = {
  margin: 12,
};

const customContentStyle = {
  width: '80%',
  height: '100%',
  maxWidth: 'none',
};
// renders a progress item component inside ProjectStatus
const ProgressItem = (props) => {
  const check = () => props.dispatchProgress(props.projectId, props.index);
  return (
    <div>
      <Checkbox checked={props.complete} label={props.text} onCheck={check} />
      <CardText>
        { props.hint }
      </CardText>
    </div>
  )
};

class ProjectStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      dialogOpen: false,
      chatBox: [],

    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDiaLogOpen = this.handleDiaLogOpen.bind(this);
    this.handleDiaLogClose = this.handleDiaLogClose.bind(this);
    this.handleMessegeSubmit = this.handleMessegeSubmit.bind(this);

    socket.on('chat message', (msg) => this.renderMessages(msg));
  }

  /* dialog  handler*/
  handleDiaLogOpen() {
    console.log("clicked")
    this.setState({dialogOpen: true});
  };

  handleDiaLogClose() {
    console.log('clicked')
    this.setState({dialogOpen: false});
  };
  /* dialog  handler end*/

  //handles opening the dialog alert and submits the project's progress
  handleSubmit() {
    this.setState({
      open: true
    });
    this.props.submitProgress()
  }

  //handles the closing of dialog alert
  handleClose() {
    this.setState({
      open: false
    });
  }


  handleMessegeSubmit(event) {
    event.preventDefault();

    var newMessage = {
      message: this._message.value,
      username: this.props.loggedInUser
    }

    var myMessage = {
      username: "me: ",
      message: this._message.value
    }


    var updatedChatBox = this.state.chatBox
    updatedChatBox.push(myMessage);

    this.setState({
      chatBox: updatedChatBox
    });

    socket.emit('chat message', newMessage); //send msg
  };


  renderMessages(msg) {
    var updatedChatBox= this.state.chatBox;
    console.log("line 119", msg)
    updatedChatBox.push(msg);
    this.setState({
      chatBox: updatedChatBox
    });
  };

  render() {
    const actions = [
      <div>
       <form onSubmit={this.handleMessegeSubmit}>
        <input ref={(message) => this._message = message} id="newMessage" type="text"/>
        <FlatButton primary={true} type="submit">Send</FlatButton>
      </form>
      </div>,
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleDiaLogClose}
      />
    ];
    return (
      <div>
      <Paper style={ {width: '95%', margin: 'auto', marginTop: 12, padding: 12 } }>
        <Card style={ { marginBottom: 12 } }>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="Project Name" />
            </ToolbarGroup>
            <ToolbarGroup lastChild={ true }>
              <RaisedButton secondary={ true } label="See on GitHub" href={this.props.project.link} target="_blank"/>
            </ToolbarGroup>
          </Toolbar>
          <CardHeader
            title={this.props.project.project}
          />
          <CardText>
            {this.props.project.description || 'This project has no description.' }
          </CardText>
           <div style={style}>
            {
              this.props.progress.map((item, index) =>
                (
                  <ProgressItem
                    dispatchProgress={this.props.dispatchProgress}
                    complete={item.complete}
                    text={item.text}
                    key={index}
                    index={index}
                    hint={item.hint}
                    projectId={this.props.project.id}
                  />
                )
              )
            }
          </div>
          <RaisedButton label="Submit Progress" onClick={this.handleSubmit} primary={true} style={style} />
          <Dialog
            actions={
              <FlatButton
              label="Close"
              primary={true}
              onClick={this.handleClose}
              />
            }
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            >
              Congrats on your progress!
          </Dialog>
        </Card>
      </Paper>
       <FloatingActionButton secondary={ true } style={ { position: "absolute", bottom: 20, left: 20 } } onClick={this.handleDiaLogOpen} >
       <SocialPartyMode />
       </FloatingActionButton >
        <Dialog
            title="Send a message"
            actions={actions}
            modal={true}
            contentStyle={customContentStyle}
            open={this.state.dialogOpen}
            autoScrollBodyContent={true}
          >
           <ul id="messages"></ul>
              {
                this.state.chatBox.map((chat, index) => {
                return(
                  <div key={index}>
                    <strong>{chat.username}</strong>
                    <p>{chat.message}</p>
                  </div>
                )}
              )
            }
          </Dialog>
      </div>

    )
  }
}



const mapStateToProps = (state, props) => {
  const loggedInUser = state.loggedInUser.username;
  const loggedInUserGhId = state.loggedInUser.ghId;
  return {
    loggedInUser,
    loggedInUserGhId,
  };
};

const mapDispatchToProps = dispatch =>
  ({

  });

export default connect(mapStateToProps, mapDispatchToProps)(ProjectStatus);
