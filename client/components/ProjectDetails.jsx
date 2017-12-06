/* eslint no-console:0 */
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import UserList from './UserList';

class ProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interest: false,
      open: false,
      disableUsers: true,
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
          projectId: this.props.project.id,
        },
      })
      .then(users => {
        this.props.addUsers(users.data);
      })
      .catch(console.error);
  }

  /* dialog  handler */
  handleOpen() {
    console.log('clicked');
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }
  /* dialog  handler end */

  toggleInterest() {
    axios
      .post('/API/projects', {
        projectId: this.props.project.id,
      })
      .then(response => {
        this.props.dispatchInterest(
          this.props.project.id,
          this.props.project.interested,
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleInterest() {
    this.props.project.interested = !this.props.project.interested;
    this.toggleInterest();
  }

  clickHandler() {
    this.setState({
      disableUsers: false,
    });
    this.handleInterest();
    this.handleOpen();
  }

  render() {
    const actions = [
      <FlatButton label="Sure thing!" primary onClick={this.handleClose} />,
      <FlatButton label="Cancel" primary onClick={this.handleClose} />,
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
              ? 'Choose a partner!'
              : 'Are you sure?'}
          </Dialog>
          <UserList
            users={this.props.users}
            projectId={this.props.project.id}
            isClickable={this.state.disableUsers}
          />
        </Paper>
      </Paper>
    );
  }
}

const mapStateToProps = (state, props) => {
  const projectId = Number(props.routedProjectId);
  return {
    users: state.users,
    project: state.projects.filter(project => project.id === projectId)[0],
  };
};

const mapDispatchToProps = dispatch => ({
  addUsers: users =>
    dispatch({
      type: 'USERS_ADD',
      users,
    }),
  dispatchInterest: (projectId, value) =>
    dispatch({
      type: 'CHANGE_PROJECT_INTEREST',
      projectId,
      value,
    }),
});

// connects the Store to ProjectDetails component
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
