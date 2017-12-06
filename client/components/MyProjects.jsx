import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { Card, CardText } from 'material-ui/Card';

class MyProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectList: [],
    };

    console.log('this.props.projectsIDs', this.props.projectsIDs);
    console.log('this.props.projects', this.props.projects);
    this.handleMap = this.handleMap.bind(this);
  }

  componentWillMount() {
    this.handleMap();
  }

  handleMap() {
    const projectList = [];
    const idList = this.props.projectsIDs;
    const projects = this.props.projects;

    idList.forEach(element => {
      projects.forEach(cur => {
        if (cur.id === element) {
          projectList.push(cur);
        }
      });
    });

    console.log('line545454', projectList);
    this.setState({ projectList });
    return projectList;
  }

  render() {
    const ctrl = this.state.projectList;
    return (
      <Paper
        style={{ width: '95%', margin: 'auto', marginTop: 12, padding: 12 }}
      >
        <Card>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="My Projects" />
            </ToolbarGroup>
          </Toolbar>
          <Subheader>Projects you have a partner with</Subheader>
          <Table
            style={{ width: '95%', margin: 'auto', marginTop: 12, padding: 12 }}
          >
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Language</TableHeaderColumn>
                <TableHeaderColumn>Experience</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody stripedRows displayRowCheckbox={false}>
              {this.state.projectList.map(project => (
                <TableRow key={project.id}>
                  <TableRowColumn>
                    <Link to={`/projects/${project.id}`}>
                      {project.project}
                    </Link>
                  </TableRowColumn>
                  <TableRowColumn>{project.language}</TableRowColumn>
                  <TableRowColumn>{project.experience}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Paper>
    );
  }
}

const mapStateToProps = (state, props) => {
  console.log('56565656565', state.loggedInUser.projects);
  const userId = state.loggedInUser.id;
  const user = state.loggedInUser.name;
  const projectsIDs = state.loggedInUser.projects;
  const projects = state.projects;
  return {
    userId,
    user,
    projects,
    projectsIDs,
  };
};

// connects the Store to MyProjects component
export default connect(mapStateToProps)(MyProjects);
