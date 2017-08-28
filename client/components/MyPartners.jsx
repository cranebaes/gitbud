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



class MyPartners extends React.Component {
  constructor(props) {
    super(props);
    console.log('props', Array.isArray(this.props.currentPartners))
    this.state = {
      isMounted: false,
      userLists: [],
    }

    // this.handleMounted = this.handleMounted.bind(this);
    // this.handlePatners = this.handlePatners.bind(this);
  }

  componentDidMount(){
    console.log('i mounted', this.props.pairedUsers)
    // this.handleMounted()
    let tests = this.props.pairedUsers;

    if(tests) {
      this.setState({
        userLists:this.props.pairedUsers
      })
    } else {
      this.setState({
        userLists:[]
      })
    }

  }

  handleMounted(){
    // this.setState({isMounted : true})
  }


  handlePatners(){
    // console.log('working');

    //   console.log("48", this.props.currentPartners)
    //   if (Aarray.isArray(this.props.currentPartners)) {
    //     console.log('am i running')
    //     (this.props.currentPartners[0] ? this.props.currentPartners[0] : []).map(user =>
    //     (<TableRow key={ user.id }>
    //       <TableRowColumn><Link to={`/user/${ user.id }`}>{ user.name }</Link></TableRowColumn>
    //       <TableRowColumn>{ user.language }</TableRowColumn>
    //       <TableRowColumn>{ user.experience }</TableRowColumn>
    //     </TableRow>)
    //     )
    //   }

  }

  // var test = Array.prototype.slice.call(props.currentPartners)
  // console.log('test', test)
render() {
  let tests = this.state.userLists
  console.log('hehehehhehe', Array.isArray(tests))
  console.log('hsdsdwe3e23234', tests)
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
          {
            tests.map(user =>
              (<TableRow key={ user.id }>
                <TableRowColumn><Link to={`/user/${ user.id }`}>{ user.name }</Link></TableRowColumn>
                <TableRowColumn>{ user.language }</TableRowColumn>
                <TableRowColumn>{ user.experience }</TableRowColumn>
              </TableRow>)
            )
          }

          </TableBody>
        </Table>
      </Card>
    </Paper>
  );
  }
}



const mapStateToProps = (state) => {
  console.log('state', state.pairedUsers)
  const pairedUsers = state.pairedUsers;
  return {
     pairedUsers: pairedUsers
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPartners);
