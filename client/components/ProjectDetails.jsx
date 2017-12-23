/* eslint no-console:0 */
import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import axios from 'axios';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import UserList from './UserList';

const socket = io();

class ProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interest: this.props.project.interested,
      open: false,
      disableUsers: !this.props.project.interested
    };
    this.toggleInterest = this.toggleInterest.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.handleInterest = this.handleInterest.bind(this);

    this.getUsers();
  }

  getUsers() {
    axios
      .get('/API/users', {
        params: {
          projectId: this.props.project.id
        }
      })
      .then(users => {
        this.props.addUsers(users.data);
      })
      .catch(console.error);
  }

  /* dialog  handler */
  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
    this.handleInterest();
  }
  /* dialog  handler end */

  toggleInterest() {
    // if wasnt interested, sent request for adding interests
    if (!this.props.project.interested) {
      // adding interest;
      axios
        .post('/API/projects', {
          projectId: this.props.project.id
        })
        .then(() => {
          this.props.project.interested = !this.props.project.interested;
          this.props.dispatchInterest(
            this.props.project.id,
            this.props.project.interested
          );
          socket.emit('updateInterestList'); // REACT needs this after a POST
        })
        .catch(error => {
          console.log(error);
        });
    } else if (this.props.project.interested) {
      // deleting interest;
      axios
        .post('/API/deleteInterest', {
          projectId: this.props.project.id
        })
        .then(() => {
          this.props.project.interested = !this.props.project.interested;
          this.props.dispatchInterest(
            this.props.project.id,
            this.props.project.interested
          );
          socket.emit('updateInterestList'); // REACT needs this after a POST
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  handleInterest() {
    this.toggleInterest();
  }

  clickHandler() {
    this.handleOpen();
  }

  render() {
    socket.on('updateInterestList', () => this.getUsers());

    const actions = [
      <FlatButton label="Sure thing!" primary onClick={this.handleClose} />,
      <FlatButton label="Cancel" primary onClick={this.handleClose} />
    ];

    return (
      <Paper
        style={{ width: '95%', margin: 'auto', marginTop: 12, padding: 12 }}
      >
        <Card style={{ marginBottom: 12 }}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={this.props.project.project} />
            </ToolbarGroup>
            <ToolbarGroup lastChild>
              <RaisedButton
                secondary
                label="See on GitHub"
                href={this.props.project.link}
                target="_blank"
              />
            </ToolbarGroup>
          </Toolbar>
          <CardText>
            {this.props.project.description ||
              'This project has no description.'}
          </CardText>
        </Card>
        <Paper>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle
                text={`Find a partner for ${this.props.project.project}`}
              />
            </ToolbarGroup>
            <ToolbarGroup lastChild>
              <RaisedButton
                primary
                onClick={this.clickHandler}
                label={
                  this.props.project.interested
                    ? 'No longer interested'
                    : "I'm Interested!"
                }
              />
            </ToolbarGroup>
          </Toolbar>
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            {this.props.project.interested
              ? 'Are you sure?'
              : 'Choose a partner!'}
          </Dialog>
          <UserList
            users={this.props.users}
            projectId={this.props.project.id}
            isClickable={this.props.disableUsers}
            // paringWithCur={this.props.paringWithCur}
          />
        </Paper>
      </Paper>
    );
  }
}

const mapStateToProps = (state, props) => {
  const projectId = Number(props.routedProjectId);
  const project = state.projects.filter(cur => cur.id === projectId)[0];
  const disableUsers = !project.interested;
  const paringWithCur = state.pairedUsers;
  console.log(paringWithCur);
  return {
    users: state.users,
    project,
    disableUsers
  };
};

const mapDispatchToProps = dispatch => ({
  addUsers: users =>
    dispatch({
      type: 'USERS_ADD',
      users
    }),
  dispatchInterest: (projectId, value) =>
    dispatch({
      type: 'CHANGE_PROJECT_INTEREST',
      projectId,
      value
    })
});

// connects the Store to ProjectDetails component
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
