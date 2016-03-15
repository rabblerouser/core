'use strict';
import React from 'react';

export default ({ group }) => (
        <dl>
            <dt>
            	{ group.name }
            </dt>
           <dd>
            	{ group.description }
        	</dd>
       </dl>
)
