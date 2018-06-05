import React from 'react';
import PropTypes from 'prop-types';

class CardText extends React.Component {
    render() {
        let icons = [];

        for(let [icon, present] of Object.entries(this.props.card.icons)) {
            if(present) {
                icons.push(<div className={ `card-icon ${icon}` } />);
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
                <div className='card-text'>
                    <span dangerouslySetInnerHTML={ {__html: this.props.card.text.replace('\n', '<br />') } }/>
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
