import React from 'react';

import DeckSummary from './DeckSummary';
import DeckEditor from './DeckEditor';
import Panel from '../Site/Panel';

const EditDeck = () => {
    return (
        <div>
            <div className='col-sm-6'>
                <Panel title='Deck Editor'>
                    <DeckEditor
                        onDeckSave={this.onEditDeck}
                        deck={this.state.deck}
                        onDeckUpdated={this.onDeckUpdated}
                    />
                </Panel>
            </div>
            <div className='col-sm-6'>
                <Panel title={this.props.deck.name}>
                    <DeckSummary
                        cards={this.props.cards}
                        deck={this.state.deck}
                        currentRestrictedList={this.props.currentRestrictedList}
                    />
                </Panel>
            </div>
        </div>
    );
};
//     constructor(props) {
//         super(props);

//         this.state = {
//         };

//         this.onEditDeck = this.onEditDeck.bind(this);
//         this.onDeckUpdated = this.onDeckUpdated.bind(this);

//         if(props.deck) {
//             this.state.deck = props.deck;
//         }
//     }

//     componentDidMount() {
//         if(this.props.deckId) {
//             return this.props.loadDeck(this.props.deckId);
//         }
//     }

//     componentWillReceiveProps(props) {
//         this.setState({ deck: props.deck });
//     }

//     componentWillUpdate(props) {
//         if(props.deckSaved) {
//             this.props.navigate('/decks');

//             return;
//         }
//     }

//     onEditDeck(deck) {
//         this.props.saveDeck(deck);
//     }

//     onDeckUpdated(deck) {
//         this.setState({ deck: deck });
//     }

//     render() {
//         let content;

//         if(this.props.apiLoading || !this.props.cards) {
//             content = <div>Loading deck from the server...</div>;
//         } else if(this.props.apiSuccess === false) {
//             content = <AlertPanel type='error' message={ this.props.apiMessage } />;
//         } else if(!this.props.deck) {
//             content = <AlertPanel message='The specified deck was not found' type='error' />;
//         } else {
//             content = (
//                 <div>
//                     <div className='col-sm-6'>
//                         <Panel title='Deck Editor'>
//                             <DeckEditor onDeckSave={ this.onEditDeck } deck={ this.state.deck } onDeckUpdated={ this.onDeckUpdated } />
//                         </Panel>
//                     </div>
//                     <div className='col-sm-6'>
//                         <Panel title={ this.props.deck.name }>
//                             <DeckSummary cards={ this.props.cards } deck={ this.state.deck } currentRestrictedList={ this.props.currentRestrictedList } />
//                         </Panel>
//                     </div>
//                 </div>);
//         }

//         return content;
//     }
// }

EditDeck.displayName = 'EditDeck';

export default EditDeck;
