import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'jquery-migrate';
import { DragSource } from 'react-dnd';

import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import { ItemTypes } from '../../constants';

const cardSource = {
    beginDrag(props) {
        return {
            card: props.card,
            source: props.source
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        dragOffset: monitor.getSourceClientOffset()
    };
}

class InnerCard extends React.Component {
    constructor() {
        super();

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);

        this.state = {
            showMenu: false
        };

        this.shortNames = {
            count: 'x',
            stand: 'T',
            poison: 'O',
            gold: 'G',
            valarmorghulis: 'V',
            betrayal: 'B',
            vengeance: 'N',
            ear: 'E',
            venom: 'M',
            kiss: 'K',
            bell: 'L'
        };
    }

    onMouseOver(card) {
        if(this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut() {
        if(this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }

    isAllowedMenuSource() {
        // Explicitly disable menus on agendas when they're selectable during a
        // card select prompt.
        if(this.props.source === 'agenda' && this.props.card.selectable) {
            return false;
        }

        return this.props.source === 'play area' || this.props.source === 'agenda' || this.props.source === 'revealed plots';
    }

    onClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        if(this.isAllowedMenuSource() && this.props.card.menu && this.props.card.menu.length !== 0) {
            this.setState({ showMenu: !this.state.showMenu });

            return;
        }

        if(this.props.onClick) {
            this.props.onClick(card);
        }
    }

    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(this.props.card, menuItem);
            this.setState({ showMenu: !this.state.showMenu });
        }
    }

    getCountersForCard(card) {
        let counters = [];
        let needsFade = card.type === 'attachment' && !['rookery', 'full deck'].includes(this.props.source);

        if(card.power) {
            counters.push({ name: 'card-power', count: card.power, fade: needsFade, shortName: 'P' });
        }

        if(card.baseStrength !== card.strength) {
            counters.push({ name: 'strength', count: card.strength, fade: needsFade, shortName: 'S' });
        }

        if(card.dupes && card.dupes.length > 0) {
            counters.push({ name: 'dupe', count: card.dupes.length, fade: needsFade, shortName: 'D' });
        }

        for(const icon of card.iconsAdded || []) {
            counters.push({ name: icon, count: 0, cancel: false });
        }

        for(const icon of card.iconsRemoved || []) {
            counters.push({ name: icon, count: 0, cancel: true });
        }

        for(const [key, token] of Object.entries(card.tokens || {})) {
            counters.push({ name: key, count: token, fade: needsFade, shortName: this.shortNames[key] });
        }

        for(const attachment of card.attachments || []) {
            counters = counters.concat(this.getCountersForCard(attachment));
        }

        return counters.filter(counter => counter.count >= 0);
    }

    getAttachments() {
        if(!['rookery', 'full deck', 'play area'].includes(this.props.source)) {
            return null;
        }

        var index = 1;
        var attachments = this.props.card.attachments.map(attachment => {
            var returnedAttachment = (<Card key={ attachment.uuid } source={ this.props.source } card={ attachment }
                className={ classNames('attachment', `attachment-${index}`) } wrapped={ false }
                onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, attachment) }
                onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                onClick={ this.props.onClick }
                onMenuItemClick={ this.props.onMenuItemClick }
                size={ this.props.size } />);

            index += 1;

            return returnedAttachment;
        });

        return attachments;
    }

    getDupes() {
        if(this.props.source !== 'play area') {
            return null;
        }

        var facedownDupes = this.props.card.dupes.filter(card => {
            return card.facedown;
        });

        if(!facedownDupes || facedownDupes.length === 0) {
            return;
        }

        var index = 1;
        var dupes = facedownDupes.map(dupe => {
            var returnedDupe = (<Card key={ dupe.uuid } className={ classNames('card-dupe', `card-dupe-${index}`) }
                source={ this.props.source } card={ dupe } wrapped={ false }
                onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, dupe) }
                onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                size={ this.props.size } />);

            index += 1;

            return returnedDupe;
        });

        return dupes;
    }

    getCardOrder() {
        if(!this.props.card.order) {
            return null;
        }

        return (<div className='card-order'>{ this.props.card.order }</div>);
    }

    showMenu() {
        if(!this.isAllowedMenuSource()) {
            return false;
        }

        if(!this.props.card.menu || !this.state.showMenu) {
            return false;
        }

        return true;
    }

    showCounters() {
        if(['rookery', 'full deck'].includes(this.props.source)) {
            return true;
        }

        if(this.props.source !== 'play area' && this.props.source !== 'faction' && this.props.source !== 'revealed plots') {
            return false;
        }

        if(this.props.card.facedown || this.props.card.type === 'attachment') {
            return false;
        }

        return true;
    }

    isFacedown() {
        return this.props.card.facedown || !this.props.card.code;
    }

    getDragFrame(image) {
        if(!this.props.isDragging) {
            return null;
        }

        let style = {};

        if(this.props.dragOffset && this.props.isDragging) {
            let x = this.props.dragOffset.x;
            let y = this.props.dragOffset.y;

            style = {
                left: x,
                top: y
            };
        }

        return (
            <div className='drag-preview' style={ style }>
                { image }
            </div>);
    }

    getCard() {
        if(!this.props.card) {
            return <div />;
        }

        let cardClass = classNames('card', `card-type-${this.props.card.type}`, this.props.className, this.sizeClass, this.statusClass, {
            'custom-card': this.props.card.code && this.props.card.code.startsWith('custom'),
            'horizontal': this.props.orientation !== 'vertical' || this.props.card.kneeled,
            'vertical': this.props.orientation === 'vertical' && !this.props.card.kneeled,
            'unselectable': this.props.card.unselectable,
            'dragging': this.props.isDragging
        });
        let imageClass = classNames('card-image', this.sizeClass, {
            'horizontal': this.props.card.type === 'plot',
            'vertical': this.props.card.type !== 'plot',
            'kneeled': this.props.card.type !== 'plot' && (this.props.orientation === 'kneeled' || this.props.card.kneeled || this.props.orientation === 'horizontal')
        });

        let image = <img className={ imageClass } src={ this.imageUrl } />;

        let content = this.props.connectDragSource(
            <div className='card-frame'>
                { this.getDragFrame(image) }
                { this.getCardOrder() }
                <div className={ cardClass }
                    onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, this.props.card) }
                    onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                    onClick={ ev => this.onClick(ev, this.props.card) }>
                    <div>
                        <span className='card-name'>{ this.props.card.name }</span>
                        { image }
                    </div>
                    { this.showCounters() ? <CardCounters counters={ this.getCountersForCard(this.props.card) } /> : null }
                </div>
                { this.showMenu() ? <CardMenu menu={ this.props.card.menu } onMenuItemClick={ this.onMenuItemClick } /> : null }
            </div>);

        return this.props.connectDragPreview(content);
    }

    get imageUrl() {
        let image = 'cardback.jpg';

        if(!this.isFacedown()) {
            image = `${this.props.card.code}.png`;
        } else if(this.props.source === 'shadows') {
            image = 'cardback_shadow.png';
        }

        return '/img/cards/' + image;
    }

    get sizeClass() {
        return {
            [this.props.size]: this.props.size !== 'normal'
        };
    }

    get statusClass() {
        if(!this.props.card) {
            return;
        }

        if(this.props.card.selected) {
            return 'selected';
        } else if(this.props.card.selectable) {
            return 'selectable';
        } else if(this.props.card.inDanger) {
            return 'in-danger';
        } else if(this.props.card.saved) {
            return 'saved';
        } else if(this.props.card.inChallenge) {
            return 'challenge';
        } else if(this.props.card.stealth) {
            return 'stealth';
        } else if(this.props.card.controlled) {
            return 'controlled';
        } else if(this.props.card.new) {
            return 'new';
        }
    }

    render() {
        if(this.props.wrapped) {
            return (
                <div className='card-wrapper' style={ this.props.style }>
                    { this.getCard() }
                    { this.getDupes() }
                    { this.getAttachments() }
                </div>);
        }

        return this.getCard();
    }
}

InnerCard.displayName = 'Card';
InnerCard.propTypes = {
    card: PropTypes.shape({
        attached: PropTypes.bool,
        attachments: PropTypes.array,
        baseStrength: PropTypes.number,
        code: PropTypes.string,
        controlled: PropTypes.bool,
        dupes: PropTypes.array,
        facedown: PropTypes.bool,
        iconsAdded: PropTypes.array,
        iconsRemoved: PropTypes.array,
        inChallenge: PropTypes.bool,
        inDanger: PropTypes.bool,
        kneeled: PropTypes.bool,
        menu: PropTypes.array,
        name: PropTypes.string,
        new: PropTypes.bool,
        order: PropTypes.number,
        power: PropTypes.number,
        saved: PropTypes.bool,
        selectable: PropTypes.bool,
        selected: PropTypes.bool,
        stealth: PropTypes.bool,
        strength: PropTypes.number,
        tokens: PropTypes.object,
        type: PropTypes.string,
        unselectable: PropTypes.bool
    }).isRequired,
    className: PropTypes.string,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    disableMouseOver: PropTypes.bool,
    dragOffset: PropTypes.object,
    isDragging: PropTypes.bool,
    onClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'kneeled', 'vertical']),
    size: PropTypes.string,
    source: PropTypes.oneOf(['hand', 'discard pile', 'play area', 'dead pile', 'draw deck', 'plot deck', 'revealed plots', 'selected plot', 'attachment', 'agenda', 'faction',
        'additional', 'conclave', 'shadows', 'full deck', 'rookery']).isRequired,
    style: PropTypes.object,
    wrapped: PropTypes.bool
};
InnerCard.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

const Card = DragSource(ItemTypes.CARD, cardSource, collect)(InnerCard);

export default Card;

