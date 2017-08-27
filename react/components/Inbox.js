import React from 'react';
import Message from './Message';
import store from '../redux/store';

export default class extends React.Component {

    constructor(props) {
        super();
        this.state = store.getState();
    }

    componentDidMount(){
        this.unsubsribe = store.subscribe(()=>{
            this.setState( store.getState() )
        })
    }
    componentWillUnmount(){
        this.unsubsribe();
    }

    render() {
        return (
            <div>
                <h1>Inbox</h1>
                { this.state.messages.map(message => {
                    return <Message fullMessage = {message} />
                })}

            </div>
        );
    }

}
