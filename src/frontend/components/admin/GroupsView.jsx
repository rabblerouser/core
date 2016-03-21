import React from 'react';
import GroupsList from './GroupsList.jsx';
import GroupDetailView from './GroupDetailView.jsx';
import AddGroupModalLauncher from './AddGroupModalLauncher.jsx';

export default ({ selectedGroup, groups, onSelectGroup, onSaveGroup, onDeleteGroup }) => {
    let detailsView = selectedGroup ? (<GroupDetailView selectedGroup={selectedGroup}
                                                            onSave={onSaveGroup}
                                                            onDelete={onDeleteGroup} />) : '';
    return (
        <section className='groups-view'>
            <header>Lab Groups</header>
            <GroupsList
                groups={groups}
                onSelect={onSelectGroup}
            />
            <AddGroupModalLauncher
                onSave={onSaveGroup}
            />
            { detailsView }
        </section>
    )
}
