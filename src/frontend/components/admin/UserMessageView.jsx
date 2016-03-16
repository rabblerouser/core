'use strict';
import React from 'react';

export default ({messages, errors}) => {
    let errorItems = errors.map( (entry) => { return (<li class='error'>{entry}</li>);});
    let messageItems = messages.map( (entry) => { return (<li>{entry}</li>);});

    return (
        <ul>
            {errorItems}
            {messageItems}
        </ul>
    )
}
