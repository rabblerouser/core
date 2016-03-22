import React from 'react';
import GroupsList from './GroupsList.jsx';
import GroupDetailView from './GroupDetailView.jsx';
import AddGroupModalLauncher from './AddGroupModalLauncher.jsx';

export default ({ selectedGroup, groups, onSelectGroup, onSaveGroup, onDeleteGroup }) => {
    let detailsView = selectedGroup ? (<GroupDetailView selectedGroup={selectedGroup}
                                                            onSave={onSaveGroup}
                                                            onDelete={onDeleteGroup} />) : '';
    return (
        <section className='admin-section' id="group-details">
            <h3>Lab Groups</h3>
            <AddGroupModalLauncher
                onSave={onSaveGroup}
            />
            <GroupsList
                groups={groups}
                onSelect={onSelectGroup}
            />
            
            { detailsView }
        </section>
    )
}
