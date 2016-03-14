'use strict';
import React from 'react';

export default ({ group }) => (
        <p>
            Name:
            { group.name }
            <br/>
            Description:
            { group.description }
        </p>
)
