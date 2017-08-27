import React from 'react';
import {createStore} from 'redux';
import {range, last} from 'lodash';

import chai, {expect} from 'chai';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import faker from 'faker';

import Message from '../../react/components/Message';
import Inbox from '../../react/components/Inbox';
import NewMessageForm from '../../react/components/NewMessageForm';
import rootReducer from '../../react/redux/reducer';
import actualStore from '../../react/redux/store';
import {MESSAGES_RECEIVED, MESSAGES_LOADING, NEW_MESSAGE} from '../../react/redux/constants';
import {createLoadingAction, createMessagesReceivedAction, createNewMessageAction} from '../../react/redux/actions';

const createRandomMessages = amount => {
    return range(0, amount).map(index => {
        return {
            id: index + 1,
            from: {email: faker.internet.email()},
            to: {email: faker.internet.email()},
            subject: faker.lorem.sentence(),
            body: faker.lorem.paragraph()
        };
    });
};
const testUtilities = {
    createRandomMessages,
    createOneRandomMessage: () => createRandomMessages(1)[0]
};

describe('▒▒▒ React tests ▒▒▒', function () {

    describe('Message', () => {

        describe('visual content', () => {

            let messageData, messageWrapper;
            beforeEach('Create <Message /> wrapper', () => {
                messageData = {
                    id: 5,
                    from: {email: 'dan.sohval@fullstackacademy.com'},
                    to: {email: 'ashi@gracehopperacademy.com'},
                    subject: 'In re: curriculum updates',
                    body: 'We should teach React!'
                };
                messageWrapper = shallow(<Message fullMessage={messageData}/>);
            });

            it('includes "FROM" line as an h1', () => {
                expect(messageWrapper.find('h1')).to.have.html('<h1>From: <span>dan.sohval@fullstackacademy.com</span></h1>');
            });

            it('includes "TO" line as h2', () => {
                expect(messageWrapper.find('h2')).to.have.html('<h2>To: <span>ashi@gracehopperacademy.com</span></h2>');
            });

            it('includes "SUBJECT" line as h3', () => {
                expect(messageWrapper.find('h3')).to.have.html('<h3>Subject: <span>In re: curriculum updates</span></h3>');
            });

            it('includes "BODY" as p', () => {
                expect(messageWrapper.find('p')).to.have.html('<p>We should teach React!</p>');
            });

            it('is not hardcoded', () => {
                const aDifferentMessage = {
                    id: 6,
                    from: {email: 'ashi@gracehopperacademy.com'},
                    to: {email: 'dan.sohval@fullstackacademy.com'},
                    subject: 'Re: In re: curriculum updates',
                    body: 'Sounds awesome'
                };
                const differentMessageWrapper = shallow(<Message fullMessage={aDifferentMessage}/>);
                expect(differentMessageWrapper.find('h1')).to.have.html('<h1>From: <span>ashi@gracehopperacademy.com</span></h1>');
                expect(differentMessageWrapper.find('h2')).to.have.html('<h2>To: <span>dan.sohval@fullstackacademy.com</span></h2>');
                expect(differentMessageWrapper.find('h3')).to.have.html('<h3>Subject: <span>Re: In re: curriculum updates</span></h3>');
                expect(differentMessageWrapper.find('p')).to.have.html('<p>Sounds awesome</p>');
            });

        });

        describe('interactivity', () => {

            let messageData, messageWrapper, markAsReadSpy;
            beforeEach('Create <Message />', () => {
                messageData = testUtilities.createOneRandomMessage();
                // http://sinonjs.org/docs/#spies
                markAsReadSpy = spy();
                messageWrapper = shallow(<Message fullMessage={messageData} markAsRead={markAsReadSpy}/>);
            });

            it('when clicked, invokes a function passed in as the markAsRead property with the message id', () => {

                expect(markAsReadSpy).not.to.have.been.called;

                // This will trigger any onClick handlers registered to the component.
                messageWrapper.simulate('click');

                expect(markAsReadSpy).to.have.been.called;
                expect(markAsReadSpy).to.have.been.calledWith(messageData.id);

            });

        });

    });

    describe('Inbox', () => {

        let randomMessages;
        beforeEach('Create random example messages', () => {
            randomMessages = testUtilities.createRandomMessages(10)
        });

        let inboxWrapper;
        beforeEach('Create <Inbox />', () => {
            inboxWrapper = shallow(<Inbox />, {context: {store: actualStore}});
            // we're simulating the component mounting by simply calling the `componentDidMountMethod` for this component (if you've defined one)
            if (inboxWrapper.instance().componentDidMount) {
                inboxWrapper.instance().componentDidMount();
            }
        });

        it('starts with an initial state having an empty messages array', () => {
            const currentState = inboxWrapper.state();
            expect(currentState.messages).to.be.deep.equal([]);
        });

        describe('visual content', () => {

            it('is comprised of <Message /> components (NOTE: no need for a `markAsRead` prop) based on what gets placed on the state', () => {

                // This will set the component's local state.
                inboxWrapper.setState({messages: randomMessages});
                expect(inboxWrapper.find(Message)).to.have.length(10);

                // The first message displayed in the inbox should be based off of the
                // first element in the randomMessages array.
                const firstMessage = inboxWrapper.find(Message).at(0);
                expect(firstMessage.equals(<Message fullMessage={randomMessages[0]}/>)).to.be.true;

                // This will set the component's local state.
                inboxWrapper.setState({messages: randomMessages.slice(4)});
                expect(inboxWrapper.find(Message)).to.have.length(6);

            });

        });

    });

    describe('NewMessageForm', () => {

        let sendSpy;
        beforeEach('Create spy function to pass in', () => {
            sendSpy = spy();
        });

        let newMessageFormWrapper;
        beforeEach('Create <NewMessageForm /> wrapper', () => {
            newMessageFormWrapper = shallow(<NewMessageForm onSend={sendSpy}/>);
        });

        it('sets local state when inputs change', () => {

            expect(newMessageFormWrapper.state()).to.be.deep.equal({
                recipient: '',
                subject: '',
                body: ''
            });

            const recipientInput = newMessageFormWrapper.find('#recipient-field');
            recipientInput.simulate('change', {target: {value: 'joe@fullstackacademy.com', name: 'recipient'}});
            expect(newMessageFormWrapper.state().recipient).to.be.equal('joe@fullstackacademy.com');

            const subjectInput = newMessageFormWrapper.find('#subject-field');
            subjectInput.simulate('change', {target: {value: 'Hello?', name: 'subject'}});
            expect(newMessageFormWrapper.state().subject).to.be.equal('Hello?');

            const bodyInput = newMessageFormWrapper.find('#body-field');
            bodyInput.simulate('change', {target: {value: `Is it me you're looking for?`, name: 'body'}});
            expect(newMessageFormWrapper.state().body).to.be.equal(`Is it me you're looking for?`);

        });

        it('invokes passed in `onSend` function with local state when form is submitted', () => {

            const formInfo = {
                recipient: 'omri@gracehopperacademy.com',
                subject: 'Hi Omri!',
                body: 'Hello.'
            };

            newMessageFormWrapper.setState(formInfo);

            // This will trigger any onSubmit handlers registered to the component.
            newMessageFormWrapper.simulate('submit', {preventDefault: () => {}});

            expect(sendSpy).to.have.been.called;
            expect(sendSpy).to.have.been.calledWith(formInfo);

        });

    });

    describe('Redux architecture', () => {

        describe('action creators', () => {

            describe('createMessagesReceivedAction', () => {

                it('returns expected action description', () => {

                    const messages = testUtilities.createRandomMessages(5);

                    const actionDescriptor = createMessagesReceivedAction(messages);

                    expect(actionDescriptor).to.be.deep.equal({
                        type: MESSAGES_RECEIVED,
                        messages: messages
                    });

                });

            });

            describe('createLoadingAction', () => {

                it('returns expected action description', () => {

                    const actionDescriptor = createLoadingAction();

                    expect(actionDescriptor).to.be.deep.equal({
                        type: MESSAGES_LOADING
                    });

                });

            });

            describe('createNewMessageAction', () => {

                it('returns expected action description', () => {

                    const message = testUtilities.createOneRandomMessage();

                    const actionDescriptor = createNewMessageAction(message);

                    expect(actionDescriptor).to.be.deep.equal({
                        type: NEW_MESSAGE,
                        message: message
                    });

                });

            });

        });

        describe('store/reducer', () => {

            let testingStore;
            beforeEach('Create testing store from reducer', () => {
                testingStore = createStore(rootReducer);
            });

            it('has an initial state as described', () => {
                const currentStoreState = testingStore.getState();
                expect(currentStoreState.messagesLoading).to.be.equal(false);
                expect(currentStoreState.messages).to.be.deep.equal([]);
            });

            describe('reducing on MESSAGES_LOADING', () => {

                it('affects state by setting messagesLoading to true and messages to empty array', () => {

                    testingStore.dispatch({
                        type: MESSAGES_LOADING
                    });

                    const newState = testingStore.getState();

                    expect(newState.messagesLoading).to.be.true;
                    expect(newState.messages).to.be.deep.equal([]);

                });

                it('creates a NEW state object on any dispatched action', () => {

                    const currentStoreState = testingStore.getState();

                    testingStore.dispatch({
                        type: MESSAGES_LOADING
                    });

                    const subsequentStoreState = testingStore.getState();

                    expect(currentStoreState).to.not.be.equal(subsequentStoreState);

                });

            });

            describe('reducing on MESSAGES_RECEIVED', () => {

                beforeEach('initialize the store to be loading messages', () => {
                    testingStore.replaceReducer(() => ({...testingStore.getState(), messagesLoading: false}));
                    testingStore.dispatch({type: 'INITIALIZE_FOR_MESSAGES_RECEIVED_TEST'});
                    testingStore.replaceReducer(rootReducer);
                });

                it('affects the state by setting messagesLoading to false and messages to dispatched messages', () => {

                    const randomMessages = testUtilities.createRandomMessages(10);

                    testingStore.dispatch({
                        type: MESSAGES_RECEIVED,
                        messages: randomMessages
                    });

                    const newState = testingStore.getState();

                    expect(newState.messagesLoading).to.be.false;
                    expect(newState.messages).to.be.deep.equal(randomMessages);

                });

            });

            describe('reducing on NEW_MESSAGE', () => {

                let existingRandomMessages;
                beforeEach(() => {
                    existingRandomMessages = testUtilities.createRandomMessages(5);
                    testingStore = createStore(
                        rootReducer,
                        {messagesLoading: false, messages: existingRandomMessages}
                    );
                });

                it('affects the state by appends dispatched message to state messages', () => {

                    const dispatchedMessage = testUtilities.createOneRandomMessage();

                    testingStore.dispatch({
                        type: NEW_MESSAGE,
                        message: dispatchedMessage
                    });

                    const newState = testingStore.getState();
                    const lastMessageOnState = last(newState.messages);

                    expect(newState.messages).to.have.length(6);
                    expect(lastMessageOnState).to.be.deep.equal(dispatchedMessage);

                });

                it('sets messages to different array from previous state', () => {

                    const originalState = testingStore.getState();
                    const dispatchedMessage = testUtilities.createOneRandomMessage();

                    testingStore.dispatch({
                        type: NEW_MESSAGE,
                        message: dispatchedMessage
                    });

                    const newState = testingStore.getState();

                    expect(newState.messages).to.not.be.equal(originalState.messages);
                    expect(originalState.messages).to.have.length(5);

                });

            });

        });

        describe('EXTRA CREDIT', () => {

            describe('component connection', () => {

                /*  --- EXTRA CREDIT ---
                 *   The assertions in this describe block assume ALL OTHERS have passed.
                 *   Please only move on to this portion once all specs are passing.
                 */

                describe('<Inbox />', () => {

                    let inboxWrapper;
                    beforeEach('Get an <Inbox />', () => {
                        inboxWrapper = shallow(<Inbox />, {context: {store: actualStore}});
                        // we're simulating the component mounting by simply calling the `componentDidMountMethod` for this component (if you've defined one)
                        if (inboxWrapper.instance().componentDidMount) {
                            inboxWrapper.instance().componentDidMount();
                        }
                    });

                    it('has an initial local state that reflects the current store state', () => {
                        const componentState = inboxWrapper.state();
                        expect(componentState.messagesLoading).to.be.false;
                        expect(componentState.messages).to.be.deep.equal([]);
                    });

                    it('is subscribed to changes from the redux store and always reflects state accurately', () => {

                        actualStore.dispatch(createLoadingAction());

                        let currentComponentState = inboxWrapper.state();

                        expect(currentComponentState.messagesLoading).to.be.true;
                        expect(currentComponentState.messages).to.be.deep.equal([]);

                        const randomMessages = testUtilities.createRandomMessages(10);
                        actualStore.dispatch(createMessagesReceivedAction(randomMessages));

                        currentComponentState = inboxWrapper.state();

                        expect(currentComponentState.messagesLoading).to.be.false;
                        expect(currentComponentState.messages).to.be.deep.equal(randomMessages);

                        const randomNewMessage = testUtilities.createOneRandomMessage();

                        actualStore.dispatch(createNewMessageAction(randomNewMessage));

                        currentComponentState = inboxWrapper.state();

                        expect(currentComponentState.messages).to.be.deep.equal([...randomMessages, randomNewMessage]);

                    });

                });

            });

        });


   });

});
