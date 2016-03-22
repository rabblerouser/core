'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';


const GroupCheckboxes = ({participantGroups, groupOptions, onChange}) => {


    function isSelected(testGroup) {
        return participantGroups.includes(testGroup.id);
    }

    return (
        <fieldset className="selectGroups">
            {groupOptions.map(
                group => {
                    return (<div>
                                <input type="checkbox"
                                        id={group.id}
                                        onChange={onChange}
                                        defaultChecked={isSelected(group)}
                                        value={group.id} />
                                <label htmlFor={group.id} key={group.id}>{group.name}</label>
                            </div>);
                }
            )}
        </fieldset>
    )
}

GroupCheckboxes.propTypes = {
    participantGroups: React.PropTypes.array,
    groupOptions: React.PropTypes.array,
    onChange: React.PropTypes.func
};

export default GroupCheckboxes
