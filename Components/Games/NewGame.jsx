import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Site/Panel';
import * as actions from '../../actions';
import AlertPanel from '../Site/AlertPanel';

const GameNameMaxLength = 64;

class NewGame extends React.Component {
    constructor() {
        super();

        this.handleRookeryClick = this.handleRookeryClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onEventChange = this.onEventChange.bind(this);
        this.onSpectatorsClick = this.onSpectatorsClick.bind(this);
        this.onShowHandClick = this.onShowHandClick.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onUseGameTimeLimitClick = this.onUseGameTimeLimitClick.bind(this);
        this.onGameTimeLimitChange = this.onGameTimeLimitChange.bind(this);
        this.onMuteSpectatorsClick = this.onMuteSpectatorsClick.bind(this);
        this.onUseChessClocksClick = this.onUseChessClocksClick.bind(this);
        this.onChessClockTimeLimitChange = this.onChessClockTimeLimitChange.bind(this);

        this.state = {
            eventId: 'none',
            optionsLocked: false,
            spectators: true,
            showHand: false,
            selectedGameFormat: 'joust',
            selectedGameType: 'casual',
            password: '',
            useRookery: false,
            useGameTimeLimit: false,
            gameTimeLimit: 55,
            muteSpectators: false,
            useChessClocks: false,
            chessClockTimeLimit: 30
        };
    }

    componentWillMount() {
        this.props.loadEvents();
        this.setState({ gameName: this.props.defaultGameName });
    }

    handleRookeryClick(event) {
        this.setState({ useRookery: event.target.checked });
    }

    onCancelClick(event) {
        event.preventDefault();

        this.props.cancelNewGame();
    }

    onNameChange(event) {
        this.setState({ gameName: event.target.value });
    }

    onEventChange(event) {
        this.setState({ eventId: event.target.value });

        //set game options when the selected event uses event specific options
        //find the corresponding event
        const { events } = this.props;
        let selectedEvent = events.find(e => {
            return e._id === event.target.value;
        });
        //unlock game options in case they were locked before
        this.setState({ optionsLocked: false });
        if(selectedEvent && selectedEvent.useEventGameOptions) {
            //if the selectedEvent uses event game options, lock and set the options
            this.setState({ optionsLocked: true });
            if(selectedEvent.eventGameOptions.spectators !== undefined) {
                this.setState({ spectators: selectedEvent.eventGameOptions.spectators });
            }                
            if(selectedEvent.eventGameOptions.muteSpectators !== undefined) {
                this.setState({ muteSpectators: selectedEvent.eventGameOptions.muteSpectators });
            }
            if(selectedEvent.eventGameOptions.showHand !== undefined) {
                this.setState({ showHand: selectedEvent.eventGameOptions.showHand });
            }
            if(selectedEvent.eventGameOptions.useRookery !== undefined) {
                this.setState({ useRookery: selectedEvent.eventGameOptions.useRookery });
            }
            if(selectedEvent.eventGameOptions.useGameTimeLimit !== undefined) {
                this.setState({ useGameTimeLimit: selectedEvent.eventGameOptions.useGameTimeLimit });
            }
            if(selectedEvent.eventGameOptions.gameTimeLimit !== undefined) {
                this.setState({ gameTimeLimit: selectedEvent.eventGameOptions.gameTimeLimit });
            }
            if(selectedEvent.eventGameOptions.useChessClocks !== undefined) {
                this.setState({ useChessClocks: selectedEvent.eventGameOptions.useChessClocks });
            }
            if(selectedEvent.eventGameOptions.chessClockTimeLimit !== undefined) {
                this.setState({ chessClockTimeLimit: selectedEvent.eventGameOptions.chessClockTimeLimit });
            }
            if(selectedEvent.eventGameOptions.password !== undefined) {
                this.setState({ password: selectedEvent.eventGameOptions.password });
            }
            this.setState({ selectedGameType: 'competitive' });
        }
    }

    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    onSpectatorsClick(event) {
        this.setState({ spectators: event.target.checked });
    }

    onShowHandClick(event) {
        this.setState({ showHand: event.target.checked });
    }

    onMuteSpectatorsClick(event) {
        this.setState({ muteSpectators: event.target.checked });
    }

    onUseChessClocksClick(event) {
        this.setState({ useChessClocks: event.target.checked });
        //deactivate other timeLimit when chessClocks are used
        if(event.target.checked) {
            this.setState({ useGameTimeLimit: false });
        }
    }

    onChessClockTimeLimitChange(event) {
        this.setState({ chessClockTimeLimit: event.target.value });
    }

    onSubmitClick(event) {
        event.preventDefault();

        this.props.socket.emit('newgame', {
            name: this.state.gameName,
            eventId: this.state.eventId,
            spectators: this.state.spectators,
            showHand: this.state.showHand,
            gameType: this.state.selectedGameType,
            isMelee: this.state.selectedGameFormat === 'melee',
            password: this.state.password,
            useRookery: this.state.useRookery,
            quickJoin: this.props.quickJoin,
            useGameTimeLimit: this.state.useGameTimeLimit,
            gameTimeLimit: this.state.gameTimeLimit,
            muteSpectators: this.state.muteSpectators,
            useChessClocks: this.state.useChessClocks,
            chessClockTimeLimit: this.state.chessClockTimeLimit
        });
    }

    onRadioChange(gameType) {
        this.setState({ selectedGameType: gameType });
    }

    onGameFormatChange(format) {
        this.setState({ selectedGameFormat: format });
    }

    onUseGameTimeLimitClick(event) {
        this.setState({ useGameTimeLimit: event.target.checked });
        //deactivate other timeLimit when chessClocks are used
        if(event.target.checked) {
            this.setState({ useChessClocks: false });
        }
    }

    onGameTimeLimitChange(event) {
        this.setState({ gameTimeLimit: event.target.value });
    }

    isGameTypeSelected(gameType) {
        return this.state.selectedGameType === gameType;
    }

    getOptions() {
        return (<div className='row'>
            <div className='checkbox col-sm-8'>
                <label>
                    <input type='checkbox' onChange={ this.onSpectatorsClick } checked={ this.state.spectators } disabled={ this.state.optionsLocked } />
                    Allow spectators
                </label>
            </div>
            { this.state.spectators && <div className='checkbox col-sm-8'>
                <label>
                    <input type='checkbox' onChange={ this.onMuteSpectatorsClick } checked={ this.state.muteSpectators } disabled={ this.state.optionsLocked }/>
                    Mute spectators
                </label>
            </div> }
            <div className='checkbox col-sm-8'>
                <label>
                    <input type='checkbox' onChange={ this.onShowHandClick } checked={ this.state.showHand } disabled={ this.state.optionsLocked }/>
                    Show hands to spectators
                </label>
            </div>
            <div className='checkbox col-sm-8'>
                <label>
                    <input type='checkbox' onChange={ this.handleRookeryClick } checked={ this.state.useRookery } disabled={ this.state.optionsLocked }/>
                    Rookery format
                </label>
            </div>
            <div className='checkbox col-sm-12'>
                <label>
                    <input type='checkbox' onChange={ this.onUseGameTimeLimitClick } checked={ this.state.useGameTimeLimit } disabled={ this.state.optionsLocked }/>
                    Use a time limit (in minutes)
                </label>
            </div>
            { this.state.useGameTimeLimit && <div className='col-sm-4'>
                <input className='form-control' type='number' onChange={ this.onGameTimeLimitChange } value={ this.state.gameTimeLimit } disabled={ this.state.optionsLocked }/>
            </div> }
            <div className='checkbox col-sm-12'>
                <label>
                    <input type='checkbox' onChange={ this.onUseChessClocksClick } checked={ this.state.useChessClocks } disabled={ this.state.optionsLocked }/>
                    Use chess clocks with a time limit per player (in minutes)
                </label>
            </div>
            { this.state.useChessClocks && <div className='col-sm-4'>
                <input className='form-control' type='number' onChange={ this.onChessClockTimeLimitChange } value={ this.state.chessClockTimeLimit } disabled={ this.state.optionsLocked }/>
            </div> }
        </div>);
    }

    getMeleeOptions() {
        if(!this.props.allowMelee) {
            return;
        }

        return (
            <div className='row'>
                <div className='col-sm-12'>
                    <b>Game Format</b>
                </div>
                <div className='col-sm-10'>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onGameFormatChange.bind(this, 'joust') } checked={ this.state.selectedGameFormat === 'joust' } />
                        Joust
                    </label>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onGameFormatChange.bind(this, 'melee') } checked={ this.state.selectedGameFormat === 'melee' } />
                        Melee
                    </label>
                </div>
            </div>
        );
    }

    getGameTypeOptions() {
        return (
            <div className='row'>
                <div className='col-sm-12 game-type'>
                    <b>Game Type</b>
                </div>
                <div className='col-sm-10'>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, 'beginner') } checked={ this.isGameTypeSelected('beginner') } disabled={ this.state.optionsLocked }/>
                        Beginner
                    </label>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, 'casual') } checked={ this.isGameTypeSelected('casual') } disabled={ this.state.optionsLocked }/>
                        Casual
                    </label>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, 'competitive') } checked={ this.isGameTypeSelected('competitive') } disabled={ this.state.optionsLocked } />
                        Competitive
                    </label>
                </div>
            </div>);
    }

    getEventSelection() {
        const { events } = this.props;

        if(events.length === 0) {
            return null;
        }

        return (
            <div className='row'>
                <div className='col-sm-8'>
                    <label htmlFor='gameName'>Event</label>
                    <select className='form-control' value={ this.state.eventId } onChange={ this.onEventChange }>
                        <option value='none'>None</option>
                        { events.map(event => (<option value={ event._id }>{ event.name }</option>)) }
                    </select>
                </div>
            </div>
        );
    }

    render() {
        let charsLeft = GameNameMaxLength - this.state.gameName.length;
        let content = [];

        if(!this.props.events) {
            return <div>Loading...</div>;
        }

        if(this.props.quickJoin) {
            content =
                (<div>
                    <AlertPanel type='info' message="Select the type of game you'd like to play and either you'll join the next one available, or one will be created for you with default options." />
                    { this.getMeleeOptions() }
                    { this.getGameTypeOptions() }
                </div>);
        } else {
            content = (<div>
                <div className='row'>
                    <div className='col-sm-8'>
                        <label htmlFor='gameName'>Name</label>
                        <label className='game-name-char-limit'>{ charsLeft >= 0 ? charsLeft : 0 }</label>
                        <input className='form-control' placeholder='Game Name' type='text' onChange={ this.onNameChange } value={ this.state.gameName } maxLength={ GameNameMaxLength } />
                    </div>
                </div>
                { this.getEventSelection() }
                { this.getOptions() }
                { this.getMeleeOptions() }
                { this.getGameTypeOptions() }
                <div className='row game-password'>
                    <div className='col-sm-8'>
                        <label>Password</label>
                        <input className='form-control' type='password' onChange={ this.onPasswordChange } value={ this.state.password } disabled={ this.state.optionsLocked }/>
                    </div>
                </div>
            </div>);
        }

        return this.props.socket ? (
            <div>
                <Panel title={ this.props.quickJoin ? 'Join Existing or Start New Game' : 'New game' }>
                    <form className='form'>
                        { content }
                        <div className='button-row'>
                            <button className='btn btn-primary' onClick={ this.onSubmitClick }>Start</button>
                            <button className='btn btn-primary' onClick={ this.onCancelClick }>Cancel</button>
                        </div>
                    </form>
                </Panel >
            </div >) : (
            <div>
                <AlertPanel type='warning' message='Your connection to the lobby has been interrupted, if this message persists, refresh your browser' />
            </div>
        );
    }
}

NewGame.displayName = 'NewGame';
NewGame.propTypes = {
    allowMelee: PropTypes.bool,
    cancelNewGame: PropTypes.func,
    defaultGameName: PropTypes.string,
    events: PropTypes.array,
    loadEvents: PropTypes.func,
    quickJoin: PropTypes.bool,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        allowMelee: state.account.user ? state.account.user.permissions.allowMelee : false,
        events: state.events.events,
        socket: state.lobby.socket
    };
}

export default connect(mapStateToProps, actions)(NewGame);
