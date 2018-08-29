import React from 'react';
import PropTypes from 'prop-types';

import CardPile from './CardPile';
import Droppable from './Droppable';

class DrawDeck extends React.Component {
    constructor() {
        super();

        this.handlePileClick = this.handlePileClick.bind(this);
        this.handleShuffleClick = this.handleShuffleClick.bind(this);
        this.handleShowDeckClick = this.handleShowDeckClick.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleCloseAndShuffleClick = this.handleCloseAndShuffleClick.bind(this);

        this.state = {
            showDrawMenu: false
        };
    }

    handleCloseClick() {
        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    handleCloseAndShuffleClick() {
        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }

        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    handlePileClick() {
        this.setState({ showDrawMenu: !this.state.showDrawMenu });
    }

    handleShuffleClick() {
        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    handleShowDeckClick() {
        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    renderDroppablePile(source, child) {
        return this.props.isMe ? <Droppable onDragDrop={ this.props.onDragDrop } source={ source }>{ child }</Droppable> : child;
    }

    render() {
        let drawDeckMenu = this.props.isMe && !this.props.spectating ? [
            { text: 'Show', handler: this.handleShowDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.handleShuffleClick }
        ] : null;

        let drawDeckPopupMenu = [
            { text: 'Close and Shuffle', handler: this.handleCloseAndShuffleClick }
        ];

        let drawDeck = (<CardPile className='draw'
            cardCount={ this.props.cardCount }
            cards={ this.props.cards }
            disablePopup={ this.props.spectating || !this.props.isMe }
            hiddenTopCard
            menu={ drawDeckMenu }
            onCardClick={ this.props.onCardClick }
            onCloseClick={ this.handleCloseClick.bind(this) }
            onDragDrop={ this.props.onDragDrop }
            onMouseOut={ this.props.onMouseOut }
            onMouseOver={ this.props.onMouseOver }
            popupLocation={ this.props.popupLocation }
            popupMenu={ drawDeckPopupMenu }
            size={ this.props.size }
            source='draw deck'
            title='Draw' />);

        return this.renderDroppablePile('draw deck', drawDeck);
    }
}

DrawDeck.propTypes = {
    cardCount: PropTypes.number,
    cards: PropTypes.array,
    isMe: PropTypes.bool,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onDrawClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onShuffleClick: PropTypes.func,
    popupLocation: PropTypes.oneOf(['top', 'bottom']),
    showDrawDeck: PropTypes.bool,
    size: PropTypes.string,
    spectating: PropTypes.bool
};

export default DrawDeck;
