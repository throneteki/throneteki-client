import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Form, Col } from 'react-bootstrap';
import { getStandardControlProps } from '../../util';

import './GameOptions.scss';

const GameOptions = ({ formProps }) => {
    const { t } = useTranslation();

    const options = [
        { name: 'allowSpectators', label: t('Allow spectators') },
        { name: 'muteSpectators', label: t('Mute spectators') },
        { name: 'showHand', label: t('Show hands to spectators') },
        { name: 'useGameTimeLimit', label: t('Use a time limit (minutes)') },
        { name: 'gamePrivate', label: t('Private (requires game link)') },
        { name: 'rookeryFormat', label: t('Rookery Format') },
        {
            name: 'useChessClocks',
            label: t('Use chess clocks (minutes)')
        }
    ];

    return (
        <>
            <Form.Group>
                <Form.Row>
                    <Col xs={12} className='font-weight-bold'>
                        <Trans>Options</Trans>
                    </Col>
                    {options.map((option) => (
                        <Col key={option.name} lg='4' className='game-option'>
                            <Form.Check
                                type='switch'
                                id={option.name}
                                label={option.label}
                                inline
                                onChange={formProps.handleChange}
                                value='true'
                                checked={formProps.values[option.name]}
                            ></Form.Check>
                        </Col>
                    ))}
                </Form.Row>
            </Form.Group>
            {formProps.values.useGameTimeLimit && (
                <Form.Row>
                    <Form.Group as={Col} sm={4}>
                        <Form.Label>{t('Time Limit')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('Enter time limit')}
                            {...getStandardControlProps(formProps, 'gameTimeLimit')}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {formProps.errors.gameTimeLimit}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
            )}
            {formProps.values.useChessClocks && (
                <Form.Row>
                    <Form.Group as={Col} sm={4}>
                        <Form.Label>{t('Clock Time Limit')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('Enter time limit')}
                            {...getStandardControlProps(formProps, 'chessClockTimeLimit')}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {formProps.errors.chessClockTimeLimit}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
            )}
        </>
    );
};

export default GameOptions;
