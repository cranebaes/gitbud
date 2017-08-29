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
    this.state = {
      isMounted: false,
      userLists: [],
    }
    console.log('My Partners props 1', props);
      // this.setState({
      //   userLists:this.props.pairedUsers
      // })
    // this.handleMounted = this.handleMounted.bind(this);
    // this.handlePatners = this.handlePatners.bind(this);
  }

  componentDidMount(){
    console.log('My Partners props 2', this.props);
    if(this.props.pairedUsers) {
      this.setState({
        userLists: this.props.pairedUsers
      })
    } else {
      this.setState({
        userLists:[]
      })
    }
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

render() {
  console.log('My Partners state 1', this.props);
  let tests = this.props.pairedUsers[0];
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



const mapStateToProps = (state, props) => {
  console.log('My Partners state 2', state);
  console.log('My partner mapStateToProps props', props);
  return {
     pairedUsers: state.pairedUsers
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPartners);
