import React from 'react';

export default (props) => (
    <div onClick = { ()=> props.markAsRead(props.fullMessage.id) }>
        <h1>From: <span>{ props.fullMessage.from.email }</span></h1>

        <h2>To: <span>{ props.fullMessage.to.email }</span></h2>
        <h3>Subject: <span>{ props.fullMessage.subject }</span></h3>
        <p>{props.fullMessage.body }</p>
    </div>
);
