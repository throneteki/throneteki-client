import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import { addBreadcrumb } from '@sentry/browser';

import callAPIMiddleware from './middleware/api-middleware.js';

const sentryReporter = () => (next) => (action) => {
    addBreadcrumb({
        message: action.type,
        category: 'redux action',
        level: 'info',
        data: {
            payload: action.payload
        }
    });
    return next(action);
};

const enhancer = compose(applyMiddleware(thunkMiddleware, callAPIMiddleware, sentryReporter));

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);

    return store;
}
