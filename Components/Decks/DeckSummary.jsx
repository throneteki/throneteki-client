import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DeckStatus from './DeckStatus';
import AltCard from '../GameBoard/AltCard';

class DeckSummary extends React.Component {
    constructor() {
        super();

        this.onCardMouseOut = this.onCardMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);

        this.state = {
            cardToShow: ''
        };
    }

    hasTrait(card, trait) {
        return card.traits.some(t => t.toLowerCase() === trait.toLowerCase());
    }

    onCardMouseOver(event) {
        let cardToDisplay = Object.values(this.props.cards).filter(card => {
            return event.target.innerText === card.label;
        });

        this.setState({ cardToShow: cardToDisplay[0] });
    }

    onCardMouseOut() {
        this.setState({ cardToShow: undefined });
    }

    getBannersToRender() {
        let banners = [];
        let bannerCards = this.props.deck.cards.filter(c => c.card.traits.includes('Banner'));

        for(const cardEntry of bannerCards) {
            banners.push(<div className='pull-right' key={ cardEntry.card.code ? cardEntry.card.code : cardEntry }>
                <span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ cardEntry.card.label }</span>
            </div>);
        }

        return <div className='info-row row'><span>Banners:</span>{ banners }</div>;
    }

    getAgenda(deck) {
        let agenda = deck.cards.find(c => c.card.type === 'agenda');

        return agenda && agenda.card;
    }

    getCardsToRender() {
        let cardsToRender = [];
        let groupedCards = {};
        let combinedCards = this.props.deck.cards.filter(c => ['attachment', 'character', 'location', 'event', 'plot'].includes(c.card.type));

        for(const card of combinedCards) {
            if(!card.card) {
                continue;
            }

            let typeCode = card.card.type;
            if(!typeCode) {
                continue;
            }

            let type = typeCode[0].toUpperCase() + typeCode.slice(1);
            let agenda = this.getAgenda(this.props.deck);

            if(agenda && agenda.code === '05045') {
                if(this.hasTrait(card.card, 'scheme')) {
                    type = 'Scheme';
                }
            }

            if(!groupedCards[type]) {
                groupedCards[type] = [card];
            } else {
                groupedCards[type].push(card);
            }
        }

        if(this.props.deck.rookeryCards) {
            for(const card of this.props.deck.rookeryCards) {
                if(!groupedCards['Rookery']) {
                    groupedCards['Rookery'] = [card];
                } else {
                    groupedCards['Rookery'].push(card);
                }
            }
        }

        for(const [key, cardList] of Object.entries(groupedCards)) {
            let cards = [];
            let count = 0;
            let index = 0;

            for(const card of cardList) {
                cards.push(<div key={ `${card.card.code}${index++}` }><span>{ card.count + 'x ' }</span><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.label }</span></div>);
                count += parseInt(card.count);
            }

            cardsToRender.push(
                <div className='cards-no-break' key={ key }>
                    <div className='card-group-title'>{ key + ' (' + count.toString() + ')' }</div>
                    <div key={ key } className='card-group'>{ cards }</div>
                </div>);
        }

        return cardsToRender;
    }

    render() {
        if(!this.props.deck || !this.props.cards) {
            return <div>Waiting for selected deck...</div>;
        }

        let cardsToRender = this.getCardsToRender();
        let banners = this.getBannersToRender();
        let agenda = this.getAgenda(this.props.deck);

        return (
            <div className='deck-summary col-xs-12'>
                { this.state.cardToShow ?
                    <div className={ classNames('hover-card', { 'horizontal': this.state.cardToShow.type === 'plot'}) }>
                        <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.code + '.png' } />
                        <AltCard card={ this.state.cardToShow } />
                    </div> : null }
                <div className='decklist'>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>{ this.props.deck.faction ? <img className='img-responsive' src={ '/img/cards/' + this.props.deck.faction.value + '.png' } /> : null }</div>
                    <div className='col-xs-8 col-sm-6'>
                        <div className='info-row row'><span>Faction:</span>{ this.props.deck.faction ? <span className={ 'pull-right' }>{ this.props.deck.faction.name }</span> : null }</div>
                        <div className='info-row row' ref='agenda'><span>Agenda:</span> { agenda && agenda.label ? <span className='pull-right card-link' onMouseOver={ this.onCardMouseOver }
                            onMouseOut={ this.onCardMouseOut }>{ agenda.label }</span> : <span>None</span> }</div>
                        { (agenda && agenda.label === 'Alliance') ? banners : null }
                        <div className='info-row row' ref='drawCount'><span>Draw deck:</span><span className='pull-right'>{ this.props.deck.status.drawCount } cards</span></div>
                        <div className='info-row row' ref='plotCount'><span>Plot deck:</span><span className='pull-right'>{ this.props.deck.status.plotCount } cards</span></div>
                        <div className='info-row row'><span>Validity:</span>
                            <DeckStatus className='pull-right' status={ this.props.deck.status } />
                        </div>
                    </div>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>{ agenda && agenda.code ? <img className='img-responsive' src={ '/img/cards/' + agenda.code + '.png' } /> : null }</div>
                </div>
                <div className='col-xs-12 no-x-padding'>
                    <div className='cards'>
                        { cardsToRender }
                    </div>
                </div>
            </div>);
    }
}

DeckSummary.displayName = 'DeckSummary';
DeckSummary.propTypes = {
    cards: PropTypes.object,
    deck: PropTypes.object
};

export default DeckSummary;
