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
  TableRowColumn,
} from 'material-ui/Table';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarTitle
} from 'material-ui/Toolbar';
import {Card, CardText } from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';



const MyPartners = (props) => {
  return (
    <Paper style={ {width: '95%', margin: 'auto', marginTop: 12, padding: 12 } }>
      <Card>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text="My Partners"/>
          </ToolbarGroup>
        </Toolbar>
        <Subheader>Click on a user to chat and start working!</Subheader>
        <Table style={{ width: '95%', margin: 'auto', marginTop: 12, padding: 12 }}>
          <TableHeader displaySelectAll={ false }>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Language</TableHeaderColumn>
              <TableHeaderColumn>Experience</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody stripedRows={ true } displayRowCheckbox={ false }>
            {(props.currentPartners[0] ? props.currentPartners[0] : []).map(user =>
              (<TableRow key={ user.id }>
                <TableRowColumn><Link to={`/user/${ user.id }`}>{ user.name }</Link></TableRowColumn>
                <TableRowColumn>{ user.language }</TableRowColumn>
                <TableRowColumn>{ user.experience }</TableRowColumn>
              </TableRow>)
            )}
          </TableBody>
        </Table>
      </Card>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  return {
    // pairedUsers: state.pairedUsers
  };
};


export default connect(mapStateToProps)(MyPartners);
