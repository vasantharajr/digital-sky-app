import React from 'react';

import FormErrors from '../components/FormErrors';

import FieldError from '../components/FieldError';

import { validateField, validateForm, decorateInputClass } from '../helpers/formValidationHelpers';

import { Link } from 'react-router-dom'

import DatePicker from 'react-datepicker';

import moment from 'moment';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

class IndividualOperatorProfile extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateObjProp = this.updateObjProp.bind(this);
        this.handleChangeDateOfBirth = this.handleChangeDateOfBirth.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.selectRegion = this.selectRegion.bind(this);
        this.state = {
            submitted: false,
            formErrors:[],
            fieldErrors: {},
            profile: {
                mobileNumber: '',
                addressList:[
                    {
                        lineOne: '',
                        lineTwo: '',
                        city: '',
                        state: '',
                        country: '',
                        pinCode: ''
                    }
                ]
            }
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({formErrors: []});
        if(!nextProps.profile.empty){
            this.setState({profile: nextProps.profile});
            if(!this.state.dateOfBirth && nextProps.profile.dateOfBirth){
                this.setState({dateOfBirth: moment(nextProps.profile.dateOfBirth, 'DD-MM-YYYY')})
            }
        }
    }

    handleChangeDateOfBirth(dateOfBirth){
        this.setState({dateOfBirth: dateOfBirth});
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { profile } = this.state;
        this.updateObjProp(profile, value, name);
        this.setState({profile: profile});
    }

    updateObjProp(obj, value, propPath) {
        const [head, ...rest] = propPath.split('.');

        !rest.length
            ? obj[head] = value
            : this.updateObjProp(obj[head], value, rest.join("."));
    }

    selectCountry(event,name){
        const { profile } = this.state;
        this.updateObjProp(profile, event, name.target.name);
        this.setState({profile:profile})
    }

    selectRegion(event){
        const { profile } = this.state;
        this.updateObjProp(profile, event, "addressList.0.state");
        this.setState({profile:profile})
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
        const formErrors = [];

        if(!this.state.dateOfBirth){
            formErrors.push("Please select date of birth");
        }

        if(formErrors.length > 0){
            this.setState({formErrors});
            return;
        }

        this.setState({submitted: true});
        const {profile} = this.state;
        profile.dateOfBirth = this.state.dateOfBirth.format('DD-MM-YYYY');
        if(this.props.operatorProfileSaved){
            this.props.updateOperatorProfile(profile);
        } else{
            this.props.setupOperatorProfile(profile);
        }
    }


    render() {
        const { savingOperatorProfile, operatorProfileSaved, errors} = this.props;
        const { formErrors, submitted, profile } = this.state;
        return (
            <div>
                <div className="page-header">
                  <div className="grid-container">
                    <div className="grid-x grid-padding-x">
                      <div className="large-12 cell">
                        <h2>Basic Operator Profile</h2>
                        { submitted && ( !errors || errors.length === 0)  &&  operatorProfileSaved && <p> Successfully Saved Operator Profile <br/></p>}
                        <p><Link to="/profile">Back to Main Profile</Link></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="page-form">
                    <FormErrors errors = {errors}/>
                    <FormErrors errors = {formErrors}/>
                    <form name="individualOperatorProfileForm" onSubmit={this.handleSubmit}>
                        <div className="grid-container">
                            <div className="grid-x grid-padding-x">
                                {  profile &&  profile.id &&
                                    <div className="large-12 cell">
                                        <label>Id
                                            <p>{profile.id}</p>
                                        </label>
                                    </div>
                                }
                                {  profile &&  profile.businessIdentifier &&
                                    <div className="large-12 cell">
                                        <label>Business Identifier
                                            <p>{profile.businessIdentifier}</p>
                                        </label>
                                    </div>
                                }
                                <div className="large-12 cell">
                                    <label>Mobile Number
                                        <input type="text" placeholder="Mobile Number" name="mobileNumber" onChange={this.handleChange} value={profile.mobileNumber} maxLength="13" className={decorateInputClass(this.state.fieldErrors['mobileNumber'],[])} validate="required" onBlur={(e) => this.setState({fieldErrors: validateField(this.state.fieldErrors, e.target)})}/>
                                        <FieldError fieldErrors={this.state.fieldErrors} field='mobileNumber'/>
                                    </label>
                                </div>
                                <div className="large-3 cell">
                                    <label>Date of Birth</label>
                                </div>
                                <div className="large-8 cell-fix dob">
                                    <DatePicker
                                        selected={this.state.dateOfBirth}
                                        onChange={this.handleChangeDateOfBirth}
                                        dateFormat="DD-MM-YYYY"
                                        maxDate={moment().add(-10,"years")}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                    />
                                    <br/>
                                </div>
                                <div className="large-12 cell">
                                    <label>Country (Nationality)
                                        <CountryDropdown type="text" placeholder="Applicant Nationality" name="country" onChange={this.selectCountry} value={profile.country} className={decorateInputClass(this.state.fieldErrors['country'],[])} validate="required,alphabetsOnly" onBlur={(e) => this.setState({fieldErrors: validateField(this.state.fieldErrors, e.target)})}/>
                                        <FieldError fieldErrors={this.state.fieldErrors} field='country'/>
                                    </label>
                                </div>
                                <div className="large-12 cell">
                                    <label>Address
                                        <input type="text" placeholder="Line One" name="addressList.0.lineOne" onChange={this.handleChange} value={ profile.addressList && profile.addressList[0].lineOne} className={decorateInputClass(this.state.fieldErrors['addressList.0.lineOne'],[])} validate="required" onBlur={(e) => this.setState({fieldErrors: validateField(this.state.fieldErrors, e.target)})}/>
                                        <FieldError fieldErrors={this.state.fieldErrors} field='addressList.0.lineOne'/>

                                        <input type="text" placeholder="Line Two" name="addressList.0.lineTwo" onChange={this.handleChange} value={profile.addressList && profile.addressList[0].lineTwo}/>

                                        <input type="text" placeholder="City Or Town" name="addressList.0.city" onChange={this.handleChange} value={profile.addressList && profile.addressList[0].city} className={decorateInputClass(this.state.fieldErrors['addressList.0.city'],[])} validate="required,alphabetsOnly" onBlur={(e) => this.setState({fieldErrors: validateField(this.state.fieldErrors, e.target)})}/>
                                        <FieldError fieldErrors={this.state.fieldErrors} field='addressList.0.city'/>

                                        <RegionDropdown type="text" placeholder="State" name="addressList.0.state" onChange={this.selectRegion} value={profile.addressList && profile.addressList[0].state} className={decorateInputClass(this.state.fieldErrors['addressList.0.state'],[])} validate="required,alphabetsOnly" onBlur={(e) => this.setState({fieldErrors: validateField(this.state.fieldErrors, e.target)})} country={profile.addressList && profile.addressList[0].country}/>
                                        <FieldError fieldErrors={this.state.fieldErrors} field='addressList.0.state'/>

                                        <CountryDropdown type="text" placeholder="Country" name="addressList.0.country" onChange={this.selectCountry} value={profile.addressList && profile.addressList[0].country} className={decorateInputClass(this.state.fieldErrors['addressList.0.country'],[])} validate="required,alphabetsOnly" onBlur={(e) => this.setState({fieldErrors: validateField(this.state.fieldErrors, e.target)})}/>
                                        <FieldError fieldErrors={this.state.fieldErrors} field='addressList.0.country'/>

                                        <input type="text" placeholder="Pin Code" name="addressList.0.pinCode" maxLength="8"  onChange={this.handleChange} value={profile.addressList && profile.addressList[0].pinCode} className={decorateInputClass(this.state.fieldErrors['addressList.0.pinCode'],[])} validate="required" onBlur={(e) => this.setState({fieldErrors: validateField(this.state.fieldErrors, e.target)})}/>
                                        <FieldError fieldErrors={this.state.fieldErrors} field='addressList.0.pinCode'/>
                                    </label>
                                </div>
                               <div className="large-12 cell">
                                    { submitted && ( !errors || errors.length === 0)  &&  operatorProfileSaved && <p> Successfully Saved Operator Profile <br/></p>}
                                    <button type="submit" className="button" name="button">{operatorProfileSaved ? 'Update' : 'Submit' }</button>
                                    {
                                       savingOperatorProfile && <img alt="Loading..." src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
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

export default IndividualOperatorProfile;