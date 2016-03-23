'use strict';
import React from 'react';

export default ({ onDelete, organiser }) => {

    var deleteOrganiser = () => {
        if(confirm('Are you sure you want to delete the current organiser?')){
            onDelete(organiser);
        }
    };

    return (<div className="buttons"><button onClick={deleteOrganiser} className="delete" title="Delete organiser"><span>Delete organiser</span></button></div>)
}
