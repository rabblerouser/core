'use strict';
import React from 'react';

export default ({ onDelete, admin }) => {

    var deleteOrganiser = () => {
        if(confirm('Are you sure you want to delete the selected person?')){
            onDelete(admin);
        }
    };

    return (<div className="buttons"><button onClick={onDelete} className="delete" title="Delete admin"><span>Delete admin</span></button></div>)
}
