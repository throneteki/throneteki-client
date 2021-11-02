import React from 'react';
import Panel from '../Site/Panel';
import { Form, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * @typedef { import('./Profile').ProfileDetails } ProfileDetails
 */

/**
 * @typedef ThronesGameSettingsProps
 * @property {import('formik').FormikProps<ProfileDetails>} formProps
 * @property {User} user
 */

/**
 * @param {ThronesGameSettingsProps} props
 */
const ThronesGameSettings = ({ formProps }) => {
    const { t } = useTranslation();

    return (
        <Panel title={t('Game Settings')}>
            <Form.Row>
                <Col sm='12'>
                    <Form.Check
                        id='promptDupes'
                        name='promptDupes'
                        label={t('Prompt before using dupes to save')}
                        type='switch'
                        checked={formProps.values.promptDupes}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                    />
                </Col>
                <Col sm='12'>
                    <Form.Check
                        id='chooseOrder'
                        name='keywordSettings.chooseOrder'
                        label={t('Choose order of keywords')}
                        type='switch'
                        checked={formProps.values.keywordSettings.chooseOrder}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                    />
                </Col>
                <Col sm='12'>
                    <Form.Check
                        id='chooseCards'
                        name='keywordSettings.chooseCards'
                        label={t('Make keywords optional')}
                        type='switch'
                        checked={formProps.values.keywordSettings.chooseCards}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                    />
                </Col>
            </Form.Row>
        </Panel>
    );
};

export default ThronesGameSettings;
