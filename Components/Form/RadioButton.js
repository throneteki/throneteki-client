import React from 'react';
import PropTypes from 'prop-types';

class RadioButton extends React.Component {
    render() {
        return (<label className='radio-inline'>
            <input name={ this.props.name } type='radio' onChange={ this.props.onChange } checked={ this.props.checked } />
            { this.props.label }
        </label>);
    }
}

RadioButton.displayName = 'RadioButton';
RadioButton.propTypes = {
    checked: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func
};

export default RadioButton;
