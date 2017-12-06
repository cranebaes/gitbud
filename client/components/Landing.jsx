/* eslint no-console:0 */
import React from 'react';

import { Link } from 'react-router-dom';
import { Card, CardMedia } from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
// makes the theme available via a higher-0rder component
import muiThemeable from 'material-ui/styles/muiThemeable';

const style = {
  textAlign: 'center',
};

function Landing(props) {
  return (
    <Card
      style={{
        maxWidth: '300px',
        width: '75%',
        margin: 'auto',
        paddingBottom: 12,
        marginTop: 12,
      }}
    >
      <AppBar
        title="Welcome to GitPal!"
        style={style}
        showMenuIconButton={false}
      />
      <CardMedia>
        <img src="https://assets-cdn.github.com/images/modules/logos_page/Octocat.png" />
      </CardMedia>
      <div style={{ width: '90%', margin: 'auto' }}>
        <a href="/auth/github">
          <RaisedButton label="Sign in with GitHub" secondary fullWidth />
        </a>
      </div>
    </Card>
  );
}

export default muiThemeable()(Landing);
