import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarTitle
} from 'material-ui/Toolbar';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import SocialPartyMode from 'material-ui/svg-icons/social/party-mode';

const style = {
  margin: 12,
};

// renders a progress item component inside ProjectStatus
const ProgressItem = (props) => {
  const check = () => props.dispatchProgress(props.projectId, props.index);
  return (
    <div>
      <Checkbox checked={props.complete} label={props.text} onCheck={check} />
      <CardText>
        { props.hint }
      </CardText>
    </div>
  )
};

class ProjectStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  //handles opening the dialog alert and submits the project's progress
  handleSubmit() {
    this.setState({
      open: true
    });
    this.props.submitProgress()
  }

  //handles the closing of dialog alert
  handleClose() {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div>
      <Paper style={ {width: '95%', margin: 'auto', marginTop: 12, padding: 12 } }>
        <Card style={ { marginBottom: 12 } }>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="Project Name" />
            </ToolbarGroup>
            <ToolbarGroup lastChild={ true }>
              <RaisedButton secondary={ true } label="See on GitHub" href={this.props.project.link} target="_blank"/>
            </ToolbarGroup>
          </Toolbar>
          <CardHeader
            title={this.props.project.project}
          />
          <CardText>
            {this.props.project.description || 'This project has no description.' }
          </CardText>
           <div style={style}>
            {
              this.props.progress.map((item, index) =>
                (
                  <ProgressItem
                    dispatchProgress={this.props.dispatchProgress}
                    complete={item.complete}
                    text={item.text}
                    key={index}
                    index={index}
                    hint={item.hint}
                    projectId={this.props.project.id}
                  />
                )
              )
            }
          </div>
          <RaisedButton label="Submit Progress" onClick={this.handleSubmit} primary={true} style={style} />
          <Dialog
            actions={
              <FlatButton
              label="Close"
              primary={true}
              onClick={this.handleClose}
              />
            }
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            >
              Congrats on your progress!
          </Dialog>
        </Card>
      </Paper>
       <FloatingActionButton secondary={ true } style={ { position: "absolute", bottom: 20, left: 20 } }  >
       <SocialPartyMode />

            </FloatingActionButton >
      </div>

    )
  }
}

export default ProjectStatus;
