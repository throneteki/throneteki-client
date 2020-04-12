import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import Panel from '../../Components/Site/Panel';
import ApiStatus from '../../Components/Site/ApiStatus';
import * as actions from '../../actions';
import { navigate } from '../../ReduxActions/misc';

class EventsAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ip: '',
            currentRequest: 'REQUEST_BANLIST'
        };

        this.onAddBanlistClick = this.onAddBanlistClick.bind(this);
    }

    componentWillMount() {
        this.props.loadEvents();
    }

    componentWillReceiveProps(props) {
        let clearStatus = false;
        if(props.banListAdded) {
            clearStatus = true;
            this.setState({ successMessage: 'Banlist item added successfully.' });
        }

        if(props.banListDeleted) {
            clearStatus = true;
            this.setState({ successMessage: 'Banlist item deleted successfully.' });
        }

        if(clearStatus) {
            setTimeout(() => {
                this.props.clearBanlistStatus();
                this.setState({ successMessage: undefined });
            }, 5000);
        }
    }

    onIpTextChange(event) {
        this.setState({ ip: event.target.value });
    }

    onAddBanlistClick(state) {
        this.setState({ currentRequest: 'ADD_BANLIST' });
        this.props.addBanlist(state.ip);
    }

    handleDeleteClick(id) {
        this.setState({ currentRequest: 'DELETE_BANLIST' });
        this.props.deleteEvent(id);
    }

    render() {
        // if(this.props.apiState && this.props.apiState.loading) {
        //     return 'Loading banlist, please wait...';
        // }

        let statusBar;

        // switch(this.state.currentRequest) {
        //     case 'REQUEST_BANLIST':
        //         statusBar = <ApiStatus apiState={ this.props.apiState } successMessage={ this.state.successMessage } />;
        //         break;
        //     case 'ADD_BANLIST':
        //         statusBar = <ApiStatus apiState={ this.props.apiAddState } successMessage={ this.state.successMessage } />;
        //         break;
        //     case 'DELETE_BANLIST':
        //         statusBar = <ApiStatus apiState={ this.props.apiDeleteState } successMessage={ this.state.successMessage } />;
        //         break;
        // }

        const { events, navigate } = this.props;

        return (
            <div className='col-xs-12'>
                { statusBar }
                <Panel title='Events administration'>
                    <a className="btn btn-primary" href="/events/add">Add event</a>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th className='col-sm-2'>Event</th>
                                <th className='col-sm-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { events.map(event => (
                                <tr>
                                    <td>{ event.name }</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={ () => navigate(`/events/${event._id}`) }>Edit</button>
                                        <button className='btn btn-danger' onClick={ () => this.handleDeleteClick(event._id) }>Delete</button>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </Panel>
            </div>);
    }
}

EventsAdmin.displayName = 'EventsAdmin';
EventsAdmin.propTypes = {
    addBanlist: PropTypes.func,
    apiAddState: PropTypes.object,
    apiDeleteState: PropTypes.object,
    apiState: PropTypes.object,
    banListAdded: PropTypes.bool,
    banListDeleted: PropTypes.bool,
    deleteEvent: PropTypes.func,
    events: PropTypes.array,
    loadEvents: PropTypes.func,
    navigate: PropTypes.func,
    clearBanlistStatus: PropTypes.func,
    loadBanlist: PropTypes.func,
    successMessage: PropTypes.string
};

function mapStateToProps(state) {
    return {
        apiAddState: state.api.ADD_BANLIST,
        apiDeleteState: state.api.DELETE_BANLIST,
        apiState: state.api.REQUEST_BANLIST,
        banlistAdded: state.admin.banlistAdded,
        banlistDeleted: state.admin.banlistDeleted,
        events: state.events.events,
        loadBanlist: state.admin.loadBanlist,
        loading: state.api.loading
    };
}

export default connect(mapStateToProps, actions)(EventsAdmin);
