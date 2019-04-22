import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import Input from './Input';
import Checkbox from './Checkbox';
import TextArea from './TextArea';

import formFields from './formFields.json';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onSubmit = this.onSubmit.bind(this);

        for(let field of formFields[props.name]) {
            this.state[field.name] = '';
        }
    }

    componentDidMount() {
        $.validator.unobtrusive.parse('form');

        this.validator = $('form').validate();
    }

    componentWillUnmount() {
        this.validator.destroy();
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onCheckboxChange(field, event) {
        var newState = {};

        newState[field] = event.target.checked;
        this.setState(newState);
    }

    onSubmit(event) {
        event.preventDefault();

        if(!$('form').valid()) {
            return;
        }

        if(this.props.onSubmit) {
            this.props.onSubmit(this.state);
        }
    }

    render() {
        const fieldsToRender = formFields[this.props.name].map(field => {
            switch(field.inputType) {
                case 'checkbox':
                    return (<Checkbox key={ field.name } name={ field.name } label={ field.label } fieldClass={ field.fieldClass }
                        onChange={ this.onCheckboxChange.bind(this, field.name) } checked={ this.state[field.name] } />);
                case 'textarea':
                    return (<TextArea key={ field.name } name={ field.name } label={ field.label } placeholder={ field.placeholder }
                        fieldClass={ field.fieldClass } labelClass={ field.labelClass } onChange={ this.onChange.bind(this, field.name) }
                        value={ this.state[field.name] } validationAttributes={ field.validationProperties } />);
                default:
                    return (<Input key={ field.name } name={ field.name } label={ field.label } placeholder={ field.placeholder }
                        validationAttributes={ field.validationProperties } fieldClass={ field.fieldClass } labelClass={ field.labelClass }
                        type={ field.inputType } onChange={ this.onChange.bind(this, field.name) } value={ this.state[field.name] } />);
            }
        });

        return (<form className='form form-horizontal' onSubmit={ this.onSubmit }>
            { fieldsToRender }
            { this.props.children }
            <div className='form-group'>
                <div className={ this.props.buttonClass }>
                    <button ref='submit' type='submit' className='btn btn-primary' disabled={ this.props.apiLoading }>
                        { this.props.buttonText || 'Submit' } { this.props.apiLoading ? <span className='spinner button-spinner' /> : null }
                    </button>
                </div>
            </div>
        </form>);
    }
}

Form.displayName = 'Form';
Form.propTypes = {
    apiLoading: PropTypes.bool,
    buttonClass: PropTypes.string,
    buttonText: PropTypes.string,
    children: PropTypes.node,
    name: PropTypes.string.isRequired,
    onSubmit: PropTypes.func
};

export default Form;
