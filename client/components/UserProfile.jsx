/* eslint no-console:0 */
import React from 'react';
import { connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';

function UserProfile(props) {
  return (
    <Paper style={{ width: '95%', margin: 'auto', marginTop: 12, padding: 12 }}>
      <Card
        style={{
          width: '40%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: 12
        }}
      >
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text="User Profile" />
          </ToolbarGroup>
        </Toolbar>
        <CardMedia>
          <div className="img-container">
            <img className="img-circle" src={props.user.avatarUrl} alt="" />
          </div>
        </CardMedia>
        <CardTitle
          title={props.user.name}
          subtitle={`Experience: ${props.user.experience}`}
        />
        <CardTitle title="Description" subtitle={props.user.description} />
        <CardTitle title="Language" subtitle={props.user.language} />
        <CardTitle
          title="Projects"
          subtitle={props.projects.map(project => project.project).join(' ')}
        />
      </Card>
    </Paper>
  );
}

const mapStateToProps = (state, props) => ({
  projects: state.projects.filter(
    project => props.user.projects.indexOf(project.id) > -1
  )
});

export default connect(mapStateToProps)(UserProfile);
