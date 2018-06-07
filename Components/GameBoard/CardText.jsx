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

        let cardText = this.props.card.text.replace(/\n/g, '<br />');
        cardText = cardText.replace(/\[military\]/g, '<span class=\'icon-military\'/>');
        cardText = cardText.replace(/\[intrigue\]/g, '<span class=\'icon-intrigue\'/>');
        cardText = cardText.replace(/\[power\]/g, '<span class=\'icon-power\'/>');
        cardText = cardText.replace(/\[baratheon\]/g, '<span class=\'icon-baratheon\'/>');
        cardText = cardText.replace(/\[greyjoy\]/g, '<span class=\'icon-greyjoy\'/>');
        cardText = cardText.replace(/\[thenightswatch\]/g, '<span class=\'icon-thenightswatch\'/>');
        cardText = cardText.replace(/\[stark\]/g, '<span class=\'icon-stark\'/>');
        cardText = cardText.replace(/\[tyrell\]/g, '<span class=\'icon-tyrell\'/>');
        cardText = cardText.replace(/\[martell\]/g, '<span class=\'icon-martell\'/>');

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
                    <div className={ `card-faction ${this.props.card.faction}` } />
                </div>
                <div className='card-text'>
                    <div className='card-traits'>{ this.props.card.traits.join('. ') }.</div>
                    <span dangerouslySetInnerHTML={ {__html: cardText } }/> { /* eslint-disable-line */ }
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
