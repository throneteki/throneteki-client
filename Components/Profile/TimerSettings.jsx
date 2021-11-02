import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { useTranslation, Trans } from 'react-i18next';

import Panel from '../Site/Panel';

const TimerSettings = ({ formProps }) => {
    const { t } = useTranslation();

    return (
        <Panel title={t('Timed Interrupt Window')}>
            <p className='help-block small'>
                <Trans>
                    Every time a game event occurs that you could possibly interrupt to cancel it, a
                    timer will count down. At the end of that timer, the window will automatically
                    pass. This option controls the duration of the timer. The timer can be configure
                    to show when events are played (useful if you play cards like The Hand&apos;s
                    Judgement) and to show when card abilities are triggered (useful if you play a
                    lot of Treachery).
                </Trans>
            </p>
            <Form.Row>
                <Form.Label column xs={4}>
                    {t('Window timeout')}
                </Form.Label>
                <Col xs={4}>
                    <Form.Control
                        type='range'
                        custom
                        id='timer'
                        name='windowTimer'
                        min={0}
                        max={10}
                        value={formProps.values.windowTimer}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                    />
                </Col>
                <Col xs={2}>
                    <Form.Control
                        id='timer2'
                        name='timer2'
                        readonly
                        value={formProps.values.windowTimer}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                    />
                </Col>
                <Form.Label column xs={2}>
                    {t('seconds')}
                </Form.Label>
            </Form.Row>
        </Panel>
    );
};

export default TimerSettings;
