import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from 'react';

import { emailLoginLinkApiMethod } from '../../lib/api/public';
import notify from '../../lib/notify';
import { styleLoginButton } from '../../lib/sharedStyles';
import { makeQueryString } from '../../lib/api/makeQueryString';


class LoginButton extends React.PureComponent <{ invitationToken?: string }, { email: string }> {

  public state = { email: '' };

  public render() {
    const { invitationToken } = this.props;

    let url = `${process.env.URL_API}/auth/google`;
    const qs = makeQueryString({ invitationToken });

    if (qs) {
      url += `?${qs}`;
    }

    // console.log(url);

    return (
      <React.Fragment>
        <Button variant="contained" style={styleLoginButton} href={url}>
          <img
            src="https://storage.googleapis.com/async-await-all/G.svg"
            alt="Log in with Google"
          />
          &nbsp;&nbsp;&nbsp; Log in with Google
        </Button>
        <p />
        <br />
        <hr style={{ width: '60px' }} /> <h4>OR</h4> <hr style={{ width: '60px' }} />
        <p />
        <br />
        <div>
          <form autoComplete="off" onSubmit={this.onSubmit}>
            <TextField
              required
              type="email"
              label="Email address"
              value={this.state.email}
              onChange={(event) => {
                this.setState({ email: event.target.value });
              }}
              style={{ width: '300px' }}
            />
            <p />
            <Button variant="contained" color="primary" type="submit">
              Log in with email
            </Button>
          </form>
          <p />
          <br />
        </div>
      </React.Fragment>
    );
  }

  private onSubmit = async (event) => {
    event.preventDefault();
    const { email } = this.state;
    const { invitationToken } = this.props;

    if (!email) {
      notify('Email is required');
    }

    try {
      await emailLoginLinkApiMethod({ email, invitationToken });
      this.setState({ email: '' });
      notify('SaaS boilerplate emailed you a login link.');
    } catch (error) {
      notify(error);
    }
  };
}

export default LoginButton;
