import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions';
import GameChat from '../GameBoard/GameChat';
import CardTypeGroups from '../Decks/CardTypeGroups';
import CardZoom from '../GameBoard/CardZoom';
import DraftCard from './DraftCard';
import Panel from '../Site/Panel';

class DraftingTable extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        //this.onCardClick = this.onCardClick.bind(this);
        //this.onCommand = this.onCommand.bind(this);
        //this.onLeaveClick = this.onLeaveClick.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);

        this.state = {
            selectedGroupBy: 'type'
        };
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    handleChangeGroupBy(value) {
        this.setState({ selectedGroupBy: value });
    }

    sendChatMessage(message) {
        this.props.sendGameMessage('chat', message);
    }

    renderHand(hand) {
        if(hand) {
            return hand.map(card => (
                <DraftCard key={ card.uuid }
                    card={ this.props.cards[card] }
                    onClick={ () => this.props.sendGameMessage('chooseCard', card) }
                    onMouseOut={ this.onMouseOut }
                    onMouseOver={ this.onMouseOver }
                    size={ this.props.user.settings.cardSize } />)
            );
        }
    }

    render() {
        const activePlayer = this.props.currentGame.draftingTable.activePlayer;
        const { deck, hand } = activePlayer;

        const deckWithCards = deck.map(cardQuantity => ({
            count: cardQuantity.count,
            code: cardQuantity.code,
            card: this.props.cards[cardQuantity.code]
        }));

        return (<div className='game-board'>
            <div className='main-window'>
                <CardZoom imageUrl={ this.props.cardToZoom ? '/img/cards/' + this.props.cardToZoom.code + '.png' : '' }
                    orientation={ this.props.cardToZoom ? this.props.cardToZoom.type === 'plot' ? 'horizontal' : 'vertical' : 'vertical' }
                    show={ !!this.props.cardToZoom } cardName={ this.props.cardToZoom ? this.props.cardToZoom.name : null }
                    card={ this.props.cardToZoom ? this.props.cards[this.props.cardToZoom.code] : null } />
                <div className='board-middle'>
                    <div className='draft-current-cards'>
                        <Panel title='Current Hand'>
                            { this.renderHand(hand) }
                        </Panel>
                    </div>
                    <div className='draft-deck'>
                        <Panel title='Drafted Cards'>
                            <div style={ { textAlign: 'right' } }>
                                <label>
                                    Group by:
                                    <select value={ this.state.selectedGroupBy } onChange={ event => this.handleChangeGroupBy(event.target.value) }>
                                        <option value='type'>Type</option>
                                        <option value='cost'>Cost</option>
                                    </select>
                                </label>
                            </div>
                            <CardTypeGroups
                                cards={ deckWithCards }
                                displayFactionIcons
                                groupBy={ this.state.selectedGroupBy }
                                onCardMouseOut={ this.onMouseOut }
                                onCardMouseOver={ this.onMouseOver }
                                sortCardsBy='faction' />
                        </Panel>
                    </div>
                </div>
                <div className='right-side'>
                    <div className='gamechat'>
                        <GameChat key='gamechat'
                            messages={ this.props.currentGame.messages }
                            onCardMouseOut={ this.onMouseOut }
                            onCardMouseOver={ this.onMouseOver }
                            onSendChat={ this.sendChatMessage }
                            muted={ this.props.currentGame.muteSpectators } />
                    </div>
                </div>
            </div>
        </div>);
    }
}

DraftingTable.displayName = 'DraftingTable';
DraftingTable.propTypes = {
    cardToZoom: PropTypes.object,
    cards: PropTypes.object,
    clearZoom: PropTypes.func,
    currentGame: PropTypes.object,
    sendGameMessage: PropTypes.func,
    user: PropTypes.object,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        cardToZoom: state.cards.zoomCard,
        cards: state.cards.cards,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DraftingTable);

