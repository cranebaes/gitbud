import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { Card } from 'material-ui/Card';

const ProjectList = props => (
  <Paper style={{ width: '95%', margin: 'auto', marginTop: 12, padding: 12 }}>
    <Card>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text="Projects" />
        </ToolbarGroup>
      </Toolbar>
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
          {props.projects.map(project => (
            <TableRow key={project.id}>
              <TableRowColumn>
                <Link to={`/projects/${project.id}`}>{project.project}</Link>
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

const mapStateToProps = state => ({
  projects: state.projects
});

// connects the Store to ProjectList
export default connect(mapStateToProps)(ProjectList);
