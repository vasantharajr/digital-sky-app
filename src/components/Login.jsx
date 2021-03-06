import React from 'react';
import { Link } from 'react-router-dom'

import FormErrors from '../components/FormErrors';
import FieldError from '../components/FieldError';

import { validateField, validateForm, decorateInputClass } from '../helpers/formValidationHelpers';

import email from '../img/email.svg';
import password from '../img/password.svg';


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            submitted: false,
            formErrors: [],
            fieldErrors: {}
        };
    }

    handleSubmit(event) {
        event.preventDefault();
        const fieldErrors = validateForm(event.target)
        for (const key of Object.keys(fieldErrors)) {
            if(!fieldErrors[key].valid){
                this.setState({fieldErrors});
                return;
            }
        }
        this.setState({fieldErrors:{}});
        const credentials = {
                    email: this.refs.email.value,
                    password: this.refs.password.value
        };
        this.setState({submitted: true});
        this.props.loginUser(credentials);
    }

    render() {
        const { loggingIn, errors} = this.props;
        const { submitted, formErrors } = this.state;
        return (
            <div>
                <div className="page-header">
                  <div className="grid-container">
                    <div className="grid-x grid-padding-x">
                      <div className="large-12 cell">
                        <h2>Welcome back!</h2>
                        <p>Sign in below to continue<br/><Link to="/register">I’m not registered, sign up here</Link><br/><Link to="/resetPasswordLink">I forgot my password</Link></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="page-form">
                    <FormErrors errors = {errors}/>
                    <FormErrors errors = {formErrors}/>
                    <form name="loginForm" onSubmit={this.handleSubmit}>
                        <div className="grid-container">
                            <div className="grid-x grid-padding-x">
                                <div className="large-12 cell">
                                    <label>Email
                                        <div className="special-feild-wrap">
                                            <span className="special-icon"><img src={email} alt="email"/></span>
                                            <input type="text" name="email" ref="email" className={decorateInputClass(this.state.fieldErrors['email'],['special-email'])} placeholder="Email" validate="required,email" onBlur={(e) => this.setState({fieldErrors: validateField(this.state.fieldErrors, e.target)})}/>
                                            <FieldError fieldErrors={this.state.fieldErrors} field='email'/>
                                        </div>
                                    </label>
                                </div>

                                <div className="large-12 cell">
                                    <label>Password
                                        <div className="special-feild-wrap">
                                            <span className="special-icon"><img src={password} alt="password"/></span>
                                            <input type="password" name="password" ref="password" className={decorateInputClass(this.state.fieldErrors['password'],['special-password'])} placeholder="Password" validate="required" onBlur={(e) => this.setState({fieldErrors: validateField(this.state.fieldErrors, e.target)})}/>
                                            <FieldError fieldErrors={this.state.fieldErrors} field='password'/>
                                        </div>

                                    </label>
                                </div>
                                <div className="large-6 cell">
                                    <button type="submit" className="button" name="button">Sign In</button>
                                    {
                                       loggingIn && <img alt="Loading..." src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;