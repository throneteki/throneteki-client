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

    render() {
        let gameList = this.props.games.map(game => {
            let players = Object.values(game.players).map(player => {
                return (<div key={ player.name } className='gamelist-player-row'>
                    <div className='mini-card'>{ player.faction && <img className='img-responsive' src={ `/img/cards/${player.faction}.png` } /> }</div>
                    <div className='mini-card'>{ player.agenda && <img className='img-responsive' src={ `/img/cards/${player.agenda}.png` } /> }</div>
                    <span className='gamelist-avatar'><Avatar username={ player.name } /></span>
                    <span>{ player.name }</span>
                    <span>{ player.totalPower }</span>
                </div>);
            });

            for(const player of Object.values(game.players)) {
                let factionIconClass = classNames('hidden-xs', 'col-xs-1', 'game-icon', `icon-${player.faction}`);

                if(firstPlayer) {
                    gameRow.push(
                        <span key={ player.name } className='col-xs-4 col-sm-3 game-row-avatar'>
                            <span className='hidden-xs col-sm-3 game-row-avatar'>
                                <Avatar username={ player.name } />
                            </span>
                            <span className='player-name col-sm-8'>{ player.name }</span>
                        </span>);
                    gameRow.push();
                    gameRow.push(<span key={ player.name + player.faction } className={ factionIconClass } />);

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
                <div key={ game.id } className={ rowClass }>
                    <span className='game-title'>
                        <b>{ game.name }</b>
                    </span>
                    <span className={ labelClass }>{ game.gameType }</span>
                    <span className='game-time'>{ `[${formattedTime}]` }</span>
                    <span className='game-icons'>
                        { game.useRookery && <img src='/img/RavenIcon.png' className='game-list-icon' alt='Rookery format' /> }
                        { game.showHand && <img src='/img/ShowHandIcon.png' className='game-list-icon' alt='Show hands to spectators' /> }
                        { game.needsPassword && <span className='password-game glyphicon glyphicon-lock' /> }
                    </span>
                    <div className='game-middle-row'>
                        <div className='players-block'>{ players }</div>
                        <div className='game-row-buttons'>
                            { this.canJoin(game) &&
                                <button className='btn btn-primary gamelist-button' onClick={ event => this.joinGame(event, game) }>Join</button> }
                            { this.canWatch(game) &&
                                <button className='btn btn-primary gamelist-button' onClick={ event => this.watchGame(event, game) }>Watch</button> }
                            { isAdmin && <button className='btn btn-primary gamelist-button' onClick={ event => this.removeGame(event, game) }>Remove</button> }
                        </div>
                    </div>
                </div >
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
