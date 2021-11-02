import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import DeckSummary from './DeckSummary';
import DeckEditor from './DeckEditor';
import Panel from '../Site/Panel';

const AddDeck = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    return (
        <Row>
            <Col sm={6} className='profile full-height'>
                <Panel title='Deck Editor'>
                    <DeckEditor
                    // onDeckSave={this.onAddDeck}
                    // onDeckUpdated={this.onDeckUpdated}
                    // deck={this.state.deck}
                    />
                </Panel>
            </Col>
            <Col sm={6}>
                <Panel title={/*this.state.deck ? this.state.deck.name : */ 'New Deck'}>
                    {/* <DeckSummary cards={this.props.cards} deck={this.state.deck} /> */}
                </Panel>
            </Col>
        </Row>
    );
};

// export class AddDeck extends React.Component {
//     constructor() {
//         super();

//         this.state = {
//             error: '',
//             faction: {},
//             deck: undefined
//         };

//         this.onAddDeck = this.onAddDeck.bind(this);
//         this.onDeckUpdated = this.onDeckUpdated.bind(this);
//     }

//     componentWillMount() {
//         this.props.addDeck();
//     }

//     componentWillUpdate(props) {
//         if(props.deckSaved) {
//             this.props.navigate('/decks');

//             return;
//         }
//     }

//     onAddDeck(deck) {
//         this.props.saveDeck(deck);
//     }

//     onDeckUpdated(deck) {
//         this.setState({ deck: deck });
//     }

//     render() {
//         let content;

//         if(this.props.loading) {
//             content = <div>Loading decks from the server...</div>;
//         } else if(this.props.apiError) {
//             content = <AlertPanel type='error' message={ this.props.apiError } />;
//         } else {
//             content = (
//                 <div>
//                     <div className='col-sm-6'>
//                         <Panel title='Deck Editor'>
//                             <DeckEditor onDeckSave={ this.onAddDeck } onDeckUpdated={ this.onDeckUpdated } deck={ this.state.deck } />
//                         </Panel>
//                     </div>
//                     <div className='col-sm-6'>
//                         <Panel title={ this.state.deck ? this.state.deck.name : 'New Deck' }>
//                             <DeckSummary cards={ this.props.cards } deck={ this.state.deck } />
//                         </Panel>
//                     </div>
//                 </div>);
//         }

//         return content;
//     }
// }

AddDeck.displayName = 'AddDeck';

export default AddDeck;
