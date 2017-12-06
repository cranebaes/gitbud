/* eslint no-console:0 */
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import ProjectDetails from './ProjectDetails';
import ProjectStatus from './ProjectStatus';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.POSTprogress = this.POSTprogress.bind(this);

    if (
      this.props.project.paired.length > 0 &&
      this.props.progress.length < 1
    ) {
      this.GETprogress();
    }
  }

  // post user's progress
  POSTprogress() {
    axios
      .post('/API/progress', {
        projectId: this.props.project.id
      })
      .catch(console.error);
  }

  // gets user's progress
  GETprogress() {
    axios
      .get('/API/progress')
      .then(res => this.props.loadProgress(res.data))
      .catch(console.error);
  }

  render() {
    if (this.props.project.paired.length > 0) {
      return (
        <ProjectStatus
          project={this.props.project}
          progress={this.props.progress}
          dispatchProgress={this.props.dispatchProgress}
          submitProgress={this.POSTprogress}
        />
      );
    }
    return <ProjectDetails routedProjectId={this.props.match.params.id} />;
  }
}

/*
  Allows Project component to have project and projectID state
*/
const mapStateToProps = (state, props) => {
  const projectId = Number(props.match.params.id);
  const project = state.projects.filter(project => project.id === projectId)[0];
  console.log('Project.jsx line61 props.project', project);
  return {
    project,
    progress: state.projectProgress[projectId] || []
  };
};

/*
  Map our dispatch to Project component as props
  Dispatch can be found in store/reducers.js
*/
const mapDispatchToProps = (dispatch, props) => ({
  dispatchProgress: (projectId, itemIndex) =>
    dispatch({
      type: 'PROGRESS_CHANGE_ITEM',
      projectId,
      itemIndex
    }),
  loadProgress: progress =>
    dispatch({
      type: 'PROGRESS_LOAD_ITEMS',
      progress
    })
});

// connects the Store to Project component
export default connect(mapStateToProps, mapDispatchToProps)(Project);
