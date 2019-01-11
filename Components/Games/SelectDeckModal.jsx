import React from 'react';
import PropTypes from 'prop-types';

import AlertPanel from '../Site/AlertPanel';
import DeckList from '../Decks/DeckList';
import Modal from '../Site/Modal';

class SelectDeckModal extends React.Component {
    render() {
        let decks = null;

        if(this.props.apiLoading) {
            decks = <div>Loading decks from the server...</div>;
        } else if(!this.props.apiSuccess) {
            decks = <AlertPanel type='error' message={ this.props.apiMessage } />;
        } else {
            decks = (
                <div>
                    <DeckList className='deck-list-popup' decks={ this.props.decks } onSelectDeck={ this.props.onDeckSelected } />
                    { this.props.standaloneDecks && this.props.standaloneDecks.length !== 0 && (
                        <div>
                            <h3 className='deck-list-header'>Or choose a standalone deck:</h3>
                            <DeckList className='deck-list-popup' decks={ this.props.standaloneDecks } onSelectDeck={ this.props.onDeckSelected } />
                        </div>)
                    }
                </div>
            );
        }

        return (
            <Modal id={ this.props.id } className='deck-popup' title='Select Deck'>
                { decks }
            </Modal>);
    }
}

SelectDeckModal.displayName = 'SelectDeckModal';
SelectDeckModal.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    decks: PropTypes.array,
    id: PropTypes.string,
    onDeckSelected: PropTypes.func,
    standaloneDecks: PropTypes.array
};

export default SelectDeckModal;
