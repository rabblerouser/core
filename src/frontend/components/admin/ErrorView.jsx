'use strict';
import React from 'react';

export default ({errors}) => {
    let errorItems = errors.map( (entry) => { return (<li>{entry}</li>);});

    return (
        <ul>
            {errorItems}
        </ul>
    )
}
