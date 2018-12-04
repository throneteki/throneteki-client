import React from 'react';
import PropTypes from 'prop-types';

import Typeahead from '../Form/Typeahead';

class TraitNameLookup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            traits: this.calculateTraits(props.cards),
            traitName: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDoneClick = this.handleDoneClick.bind(this);
    }

    calculateTraits(cardLookup) {
        let cards = Object.values(cardLookup);
        let allTraits = cards.reduce((traits, card) => traits.concat(card.traits || []), []);
        let uniqueTraits = [...new Set(allTraits)];

        uniqueTraits.sort();

        return uniqueTraits;
    }

    handleChange(trait) {
        this.setState({ traitName: trait[0] });
    }

    handleDoneClick() {
        if(this.props.onTraitSelected) {
            this.props.onTraitSelected(this.state.traitName);
        }
    }

    render() {
        return (
            <div>
                <Typeahead labelKey={ 'label' } options={ this.state.traits } dropup onChange={ this.handleChange } />
                <button type='button' onClick={ this.handleDoneClick } className='btn btn-primary'>Done</button>
            </div>);
    }
}

TraitNameLookup.displayName = 'TraitNameLookup';
TraitNameLookup.propTypes = {
    cards: PropTypes.object,
    onTraitSelected: PropTypes.func
};

export default TraitNameLookup;
