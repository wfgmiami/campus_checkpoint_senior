import { MESSAGES_RECEIVED, MESSAGES_LOADING, NEW_MESSAGE } from './constants';

const initialState = {
    messagesLoading: false,
    messages: []
};

export default (state = initialState, action) => {
    switch(action.type){
        case MESSAGES_LOADING:
            state = Object.assign({}, state, { messagesLoading: true })
            break;
        case MESSAGES_RECEIVED:
            state = Object.assign({}, state, { messagesLoading: false, messages: action.messages })
            break;
        case NEW_MESSAGE:
            state = Object.assign({}, { messages: state.messages.concat(action.message) })
            break;

        default:
            state;
    }
    return state;
};
