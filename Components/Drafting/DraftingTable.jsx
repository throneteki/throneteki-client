import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions';
import GameChat from '../GameBoard/GameChat';
import CardTypeGroups from '../Decks/CardTypeGroups';
import CardZoom from '../GameBoard/CardZoom';
import DraftCard from './DraftCard';
import Panel from '../Site/Panel';
import DraftPlayerPrompt from './DraftPlayerPrompt';

class DraftingTable extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.onPromptButtonClick = this.onPromptButtonClick.bind(this);

        this.state = {
            selectedCard: undefined,
            selectedGroupBy: 'type'
        };
    }

    componentDidMount() {
        this.updateContextMenu(this.props);
        $('.modal-backdrop').remove();
    }

    componentWillReceiveProps(props) {
        this.updateContextMenu(props);

        if(!props.currentGame) {
            return;
        }

        let handChanged = this.props.currentGame.draftingTable.activePlayer.hand.length !== props.currentGame.draftingTable.activePlayer.hand.length;

        //reset the selectedCard when hand changes
        if(handChanged) {
            this.setState({ selectedCard: undefined });
        }
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

    selectCard(card) {
        if(!this.props.currentGame.draftingTable.activePlayer.hasChosen) {
            this.setState({ selectedCard: card });
        }        
    }

    onPromptButtonClick(button) {
        this.props.sendGameMessage(button.command, this.state.selectedCard);
    }

    updateContextMenu(props) {
        if(!props.currentGame || !props.user) {
            return;
        }

        let thisPlayer = props.currentGame.players[props.user.username];

        if(thisPlayer) {
            this.setState({ spectating: false });
        } else {
            this.setState({ spectating: true });
        }

        let menuOptions = [
            { text: 'Leave Game', onClick: this.onLeaveClick }
        ];

        if(props.currentGame && props.currentGame.started) {
            let spectators = props.currentGame.spectators.map(spectator => {
                return <li key={ spectator.id }>{ spectator.name }</li>;
            });

            let spectatorPopup = (
                <ul className='spectators-popup absolute-panel'>
                    { spectators }
                </ul>
            );

            menuOptions.unshift({ text: 'Spectators: ' + props.currentGame.spectators.length, popup: spectatorPopup });

            this.setContextMenu(menuOptions);
        } else {
            this.setContextMenu([]);
        }
    }

    setContextMenu(menu) {
        if(this.props.setContextMenu) {
            this.props.setContextMenu(menu);
        }
    }

    onLeaveClick() {
        if(!this.state.spectating && this.isDraftActive()) {
            toastr.confirm('Your draft is not finished, are you sure you want to leave?', {
                onOk: () => {
                    this.props.sendGameMessage('leavegame');
                    this.props.closeGameSocket();
                }
            });

            return;
        }

        this.props.sendGameMessage('leavegame');
        this.props.closeGameSocket();
    }

    isDraftActive() {
        if(!this.props.currentGame || !this.props.user) {
            return false;
        }

        if(this.props.currentGame.draftingTable.draftFinished) {
            return false;
        }

        let thisPlayer = this.props.currentGame.players[this.props.user.username];
        if(!thisPlayer) {
            thisPlayer = Object.values(this.props.currentGame.players)[0];
        }

        let otherPlayers = Object.values(this.props.currentGame.players).filter(player => {
            return player.name !== thisPlayer.name;
        });

        if(!otherPlayers) {
            return false;
        }

        if(otherPlayers.every(player => player.disconnected || player.left)) {
            return false;
        }

        return true;
    }

    renderHand(hand) {
        if(hand) {
            return hand.map(card => (
                <DraftCard key={ card.uuid }
                    card={ this.props.cards[card] }
                    onClick={ () => this.selectCard(card) }
                    onMouseOut={ this.onMouseOut }
                    onMouseOver={ this.onMouseOver }
                    selected={ this.state.selectedCard === card }
                    size={ this.props.user.settings.cardSize } />)
            );
        }
    }

    render() {
        if(!this.props.currentGame || !this.props.cards || !this.props.currentGame.started) {
            return <div>Waiting for server...</div>;
        }

        if(!this.props.user) {
            this.props.navigate('/');
            return <div>You are not logged in, redirecting...</div>;
        }

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
                    <div className='prompt-area'>
                        <div className='inset-pane'>
                            <DraftPlayerPrompt
                                cards={ this.props.cards }
                                buttons={ activePlayer.buttons }
                                promptText={ activePlayer.menuTitle }
                                promptTitle={ activePlayer.promptTitle }
                                onButtonClick={ this.onPromptButtonClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                user={ this.props.user } />
                        </div>
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
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
    navigate: PropTypes.func,
    sendGameMessage: PropTypes.func,
    setContextMenu: PropTypes.func,
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

