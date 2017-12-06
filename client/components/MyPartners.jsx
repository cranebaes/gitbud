/* eslint no-console:0 */
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
import { Card, CardText } from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';

class MyPartners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      userLists: []
    };
  }

  componentDidMount() {
    if (this.props.pairedUsers) {
      this.setState({
        userLists: this.props.pairedUsers
      });
    } else {
      this.setState({
        userLists: []
      });
    }
  }

  render() {
    const tests = this.props.pairedUsers[0] || [];
    return (
      <Paper
        style={{ width: '95%', margin: 'auto', marginTop: 12, padding: 12 }}
      >
        <Card>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="My Partners" />
            </ToolbarGroup>
          </Toolbar>
          <Subheader>Click on a user to chat and start working!</Subheader>
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
              {tests.map(user => (
                <TableRow key={user.id}>
                  <TableRowColumn>
                    <Link to={`/user/${user.id}`}>{user.name}</Link>
                  </TableRowColumn>
                  <TableRowColumn>{user.language}</TableRowColumn>
                  <TableRowColumn>{user.experience}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Paper>
    );
  }
}

const mapStateToProps = (state, props) => ({
  pairedUsers: state.pairedUsers
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MyPartners);
