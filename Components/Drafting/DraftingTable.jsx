import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions';
import GameChat from '../GameBoard/GameChat';
import Panel from '../Site/Panel';

class DraftingTable extends React.Component {
    render() {
        const activePlayer = this.props.currentGame.draftingTable.activePlayer;
        const { chosenCards, hand, starterCards } = activePlayer;

        return (<div className='full-height'>
            <div className='col-xs-9 full-height'>
                <div className='draft-current-cards'>
                    <Panel title='Current Hand'>
                        { hand.map(card => (
                            <img style={ { width: '150px' } } src={ `/img/cards/${card}.png` } onClick={ () => this.props.sendGameMessage('chooseCard', card) } />
                        )) }
                    </Panel>
                </div>
                <div className='draft-deck'>
                    <div className='col-xs-6'>
                        <Panel title='Chosen Cards'>
                            { chosenCards.map(cardQuantity => <div>{ cardQuantity.count }x { this.props.cards[cardQuantity.code].label }</div>) }
                        </Panel>
                    </div>
                    <div className='col-xs-6'>
                        <Panel title='Starter Cards'>
                            { starterCards.map(cardQuantity => <div>{ cardQuantity.count }x { this.props.cards[cardQuantity.code].label }</div>) }
                        </Panel>
                    </div>
                </div>
            </div>
            <div className='col-xs-3 full-height'>
                <GameChat key='gamechat'
                    messages={ this.props.currentGame.messages }
                    onCardMouseOut={ this.onMouseOut }
                    onCardMouseOver={ this.onMouseOver }
                    onSendChat={ this.sendChatMessage }
                    muted={ this.props.currentGame.muteSpectators } />
            </div>
        </div>);
    }
}

DraftingTable.displayName = 'DraftingTable';
DraftingTable.propTypes = {
    cards: PropTypes.object,
    currentGame: PropTypes.object,
    sendGameMessage: PropTypes.func
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
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

