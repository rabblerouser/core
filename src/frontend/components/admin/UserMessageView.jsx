'use strict';
import React from 'react';

export default ({messages, errors}) => {
    let errorItems = errors.map( (entry) => { return (<li className='error'>{entry}</li>);});
    let messageItems = messages.map( (entry) => { return (<li>{entry}</li>);});

    return (
        <section className="admin-section" id="user-messages">
            <ul>
                {errorItems}
                {messageItems}
            </ul>
        </section>
    )
}
