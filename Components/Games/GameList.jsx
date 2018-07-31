import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import moment from 'moment';

import Avatar from '../Site/Avatar';
import * as actions from '../../actions';

class GameList extends React.Component {
    constructor() {
        super();

        this.joinGame = this.joinGame.bind(this);
    }

    joinGame(event, game) {
        event.preventDefault();

        if(!this.props.user) {
            toastr.error('Please login before trying to join a game');
            return;
        }

        if(game.needsPassword) {
            this.props.joinPasswordGame(game, 'Join');
        } else {
            this.props.socket.emit('joingame', game.id);
        }
    }

    canWatch(game) {
        return !this.props.currentGame && game.allowSpectators;
    }

    watchGame(event, game) {
        event.preventDefault();

        if(!this.props.user) {
            toastr.error('Please login before trying to watch a game');
            return;
        }

        if(game.needsPassword) {
            this.props.joinPasswordGame(game, 'Watch');
        } else {
            this.props.socket.emit('watchgame', game.id);
        }
    }

    removeGame(event, game) {
        event.preventDefault();

        this.props.socket.emit('removegame', game.id);
    }

    canJoin(game) {
        if(this.props.currentGame || game.started || game.full) {
            return false;
        }

        return true;
    }

    getPlayerCards(player, firstPlayer) {
        if(firstPlayer) {
            return (<div className='game-faction-row first-player'>
                <div className='agenda-mini'>{ <img className='img-responsive' src={ `/img/cards/${player.agenda || 'cardback'}.png` } /> }</div>
                <div className='faction-mini'>{ <img className='img-responsive' src={ `/img/cards/${player.faction || 'cardback'}.png` } /> }</div>
            </div>);
        }

        return (<div className='game-faction-row other-player'>
            <div className='faction-mini'>{ <img className='img-responsive' src={ `/img/cards/${player.faction || 'cardback'}.png` } /> }</div>
            <div className='agenda-mini'>{ <img className='img-responsive' src={ `/img/cards/${player.agenda || 'cardback'}.png` } /> }</div>
        </div>);
    }

    getPlayerNameAndAvatar(player, firstPlayer) {
        if(firstPlayer) {
            return (<div className='game-footer-row'>
                <span className='gamelist-avatar'><Avatar username={ player.name } /></span>
                <span className='bold'>{ player.name }</span>
            </div>);
        }

        return (<div className='game-footer-row'>
            <span className='bold'>{ player.name }</span>
            <span className='gamelist-avatar'><Avatar username={ player.name } /></span>
        </div >);
    }

    render() {
        let gameList = this.props.games.map(game => {
            let firstPlayer = true;

            let players = Object.values(game.players).map(player => {
                let classes = classNames('game-player-row', {
                    'first-player': firstPlayer,
                    'other-player': !firstPlayer
                });

                let retPlayer = (<div key={ player.name } className={ classes }>
                    { this.getPlayerCards(player, firstPlayer) }
                    { this.getPlayerNameAndAvatar(player, firstPlayer) }
                </div >);

                firstPlayer = false;

                return retPlayer;
            });

            if(players.length === 1) {
                if(this.canJoin(game)) {
                    players.push(
                        <div className='game-faction-row other-player'>
                            <button className='btn btn-primary gamelist-button img-responsive' onClick={ event => this.joinGame(event, game) }>Join</button>
                        </div>);
                } else {
                    players.push(<div className='game-faction-row other-player' />);
                }
            }

            let isAdmin = this.props.user && this.props.user.permissions.canManageGames;
            let rowClass = classNames('game-row', {
                [game.node]: game.node && isAdmin
            });

            let labelClass = 'label';
            switch(game.gameType) {
                case 'beginner':
                    labelClass += ' label-success';
                    break;
                case 'casual':
                    labelClass += ' label-warning';
                    break;
                case 'competitive':
                    labelClass += ' label-danger';
                    break;
            }

            let timeDifference = moment().diff(moment(game.createdAt));
            if(timeDifference < 0) {
                timeDifference = 0;
            }

            let formattedTime = moment.utc(timeDifference).format('HH:mm');

            return (
                <div key={ game.id }>
                    <hr />
                    <div className={ rowClass }>
                        <div className='game-header-row'>
                            <span className='game-title'>
                                <b>{ game.name }</b>
                            </span>
                            { /* { <span className={ labelClass }>{ game.gameType }</span> } */ }
                            <span className='game-time'>{ `[${formattedTime}]` }</span>
                            <span className='game-icons'>
                                { game.useRookery && <img src='/img/RavenIcon.png' className='game-list-icon' alt='Rookery format' /> }
                                { game.showHand && <img src='/img/ShowHandIcon.png' className='game-list-icon' alt='Show hands to spectators' /> }
                                { game.needsPassword && <span className='password-game glyphicon glyphicon-lock' /> }
                            </span>
                        </div>
                        <div className='game-middle-row'>
                            { players }
                        </div>
                        <div className='game-row-buttons'>
                            { this.canWatch(game) &&
                                <button className='btn btn-primary gamelist-button' onClick={ event => this.watchGame(event, game) }>Watch</button> }
                            { isAdmin && <button className='btn btn-primary gamelist-button' onClick={ event => this.removeGame(event, game) }>Remove</button> }
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className='game-list' >
                { gameList }
            </div>);
    }
}

GameList.displayName = 'GameList';
GameList.propTypes = {
    currentGame: PropTypes.object,
    games: PropTypes.array,
    joinPasswordGame: PropTypes.func,
    showNodes: PropTypes.bool,
    socket: PropTypes.object,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(GameList);
