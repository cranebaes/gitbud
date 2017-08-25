import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import {
  Toolbar,
  ToolbarGroup,
  ToolbarTitle
} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import {Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import UserList from './UserList';

class ProjectDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      interest: false,
    };
    this.toggleInterest = this.toggleInterest.bind(this);
    this.getUsers();
  }

  getUsers() {
    axios.get('/API/users', {
      params: {
        projectId: this.props.project.id
      }
    })
      .then((users) => {
        this.props.addUsers(users.data);
      })
      .catch(console.error);
  }

  toggleInterest() {
    axios.post('/API/projects', {
      projectId: this.props.project.id,
    })
      .then((response) => {
        this.props.dispatchInterest(this.props.project.id, !this.props.project.interested);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <Paper style={ {width: '95%', margin: 'auto', marginTop: 12, padding: 12 } }>
        <Card style={ { marginBottom: 12 } }>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={ this.props.project.project } />
            </ToolbarGroup>
            <ToolbarGroup lastChild={ true }>
              <RaisedButton secondary={ true } label="See on GitHub" href={this.props.project.link} target="_blank"/>
            </ToolbarGroup>
          </Toolbar>
          <CardText>
            { this.props.project.description || 'This project has no description.' }
          </CardText>
        </Card>
        <Paper>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={`Find a partner for ${ this.props.project.project }`} />
            </ToolbarGroup>
            <ToolbarGroup lastChild={ true }>
              <RaisedButton primary={ true } onClick={ this.toggleInterest } label={ this.props.project.interested ? 'Project selected' : 'I am interested in this project!'}/>
            </ToolbarGroup>
          </Toolbar>
          <UserList users={ this.props.users } projectId={ this.props.project.id } />
        </Paper>
      </Paper>
    )
  }
}

const mapStateToProps = (state, props) => {
  const projectId = Number(props.routedProjectId);
  return {
    users: state.users,
    project: state.projects.filter(project => project.id === projectId)[0],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUsers: users => dispatch({
      type: 'USERS_ADD',
      users: users
    }),
    dispatchInterest: (projectId, value) => dispatch({
      type: 'CHANGE_PROJECT_INTEREST',
      projectId,
      value,
    })
  };
};

//connects the Store to ProjectDetails component
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
