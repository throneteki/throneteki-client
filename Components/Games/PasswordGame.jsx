import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import * as actions from '../../actions';

class PasswordGame extends React.Component {
    constructor() {
        super();

        this.state = {
            password: ''
        };
    }

    componentWillMount() {
        this.props.clearGameStatus();
    }

    onJoinClick(event) {
        event.preventDefault();

        if(this.props.passwordJoinType === 'Join') {
            this.props.sendSocketMessage('joingame', this.props.passwordGame.id, this.state.password);
        } else if(this.props.passwordJoinType === 'Watch') {
            this.props.sendSocketMessage('watchgame', this.props.passwordGame.id, this.state.password);
        }
    }

    onCancelClick(event) {
        this.props.cancelPasswordJoin();

        this.setState({ password: '' });

        event.preventDefault();
    }

    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    render() {
        if(!this.props.passwordGame) {
            return null;
        }

        return (
            <div>
                <Panel title={ this.props.passwordGame.name }>
                    { this.props.joinFailReason && <AlertPanel type='error' message={ this.props.joinFailReason } /> }
                    <div>
                        <h3>Enter the password</h3>
                    </div>
                    <div className='game-password'>
                        <input className='form-control' type='password' onChange={ this.onPasswordChange.bind(this) } value={ this.state.password } />
                    </div>
                    <div>
                        <div className='btn-group'>
                            <button className='btn btn-primary' onClick={ this.onJoinClick.bind(this) }>{ this.props.passwordJoinType }</button>
                            <button className='btn btn-primary' onClick={ this.onCancelClick.bind(this) }>Cancel</button>
                        </div>
                    </div>
                </Panel>
            </div>);
    }
}

PasswordGame.displayName = 'PasswordGame';
PasswordGame.propTypes = {
    cancelPasswordJoin: PropTypes.func,
    clearGameStatus: PropTypes.func,
    joinFailReason: PropTypes.string,
    passwordGame: PropTypes.object,
    passwordJoinType: PropTypes.string,
    sendSocketMessage: PropTypes.func
};

function mapStateToProps(state) {
    return {
        joinFailReason: state.lobby.joinFailReason,
        passwordGame: state.lobby.passwordGame,
        passwordJoinType: state.lobby.passwordJoinType
    };
}

export default connect(mapStateToProps, actions)(PasswordGame);

