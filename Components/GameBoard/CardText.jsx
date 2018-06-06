import React from 'react';
import PropTypes from 'prop-types';

class CardText extends React.Component {
    render() {
        let icons = [];

        for(let [icon, present] of Object.entries(this.props.card.icons)) {
            if(present) {
                icons.push(<div className={ `card-icon ${icon}` } />);
            } else {
                icons.push(<div className='card-icon' />);
            }
        }

        return (
            <div className='card-alt'>
                <div className='card-cost'>
                    <span className='card-cost-number'>{ this.props.card.cost }</span>
                    <div className='card-type'>{ this.props.card.type }</div>
                </div>
                <div className='card-icons'>
                    { icons }
                </div>
                <div className='card-name-row'>
                    <div className='card-strength'>{ this.props.card.strength }</div>
                    <div className='card-name'>{ this.props.card.unique ? <span className='card-unique' /> : null } { this.props.card.name }</div>
                    <div className='card-faction'>{ this.props.card.faction }</div>
                </div>
                <div className='card-text'>
                    <span dangerouslySetInnerHTML={ {__html: this.props.card.text.replace('\n', '<br />') } }/> { /* eslint-disable-line */ }
                </div>
            </div>
        );
    }
}

CardText.displayName = 'CardText';
CardText.propTypes = {
    card: PropTypes.object
};

export default CardText;
