import React from 'react';
import { Col, Row, Form } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';

import Panel from '../Site/Panel';

const ActionWindows = ({ formProps }) => {
    const { t } = useTranslation();
    const windows = [
        { name: 'plot', label: 'Plots revealed' },
        { name: 'draw', label: 'Draw phase' },
        { name: 'challengeBegin', label: 'Before challenge' },
        { name: 'attackersDeclared', label: 'Attackers declared' },
        { name: 'defendersDeclared', label: 'Defenders declared' },
        { name: 'dominance', label: 'Dominance phase' },
        { name: 'standing', label: 'Standing phase' },
        { name: 'taxation', label: 'Taxation phase' }
    ];

    return (
        <Panel title={t('Action Window Defaults')}>
            <Row>
                {windows.map((window) => {
                    return (
                        <Col xs='6' key={window.name}>
                            <Form.Check
                                id={window.name}
                                name={'promptedActionWindows.' + window.name}
                                label={t(window.label)}
                                type='switch'
                                checked={formProps.values.promptedActionWindows[window.name]}
                                onChange={formProps.handleChange}
                                onBlur={formProps.handleBlur}
                            />
                        </Col>
                    );
                })}
            </Row>
        </Panel>
    );
};

export default ActionWindows;
