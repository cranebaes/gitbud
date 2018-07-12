import React from 'react';

import { Card, CardMedia } from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
// makes the theme available via a higher-0rder component
import muiThemeable from 'material-ui/styles/muiThemeable';
import octocat from '../assets/octocat.bmp';

const style = {
  textAlign: 'center'
};

function Landing() {
  return (
    <Card
      style={{
        maxWidth: '300px',
        width: '75%',
        margin: 'auto',
        paddingBottom: 12,
        marginTop: 12
      }}
    >
      <AppBar
        title="Welcome to GitPal!"
        style={style}
        showMenuIconButton={false}
      />
      <CardMedia>
        <img src={octocat} alt="icon" />
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
