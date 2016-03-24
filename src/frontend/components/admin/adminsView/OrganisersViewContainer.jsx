import React, {Component} from 'react';
import AdminsView from './AdminsView.jsx';
import labService from '../../../services/labService.js';
import adminService from '../../../services/adminService.js';

export default class OrganiserViewContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            admins: [],
            onSave: (adminDetails) => {
                this.props.onPreAction();
                let saveAction = this.state.admins.find(admin => admin.id === adminDetails.id) === undefined ? adminService.create : adminService.update;
                saveAction(adminDetails, this.props.labId)
                    .then((savedAdmin) => {
                        this.updateAdmins(this.state.admins, savedAdmin);
                        this.props.onActionSuccess('Organiser successfully saved');
                    })
                    .catch(this.props.onActionError);
            },
            onDelete: (selected) => {
                this.props.onPreAction();
                adminService.delete(selected, this.props.labId)
                .then(()=> {
                    this.removeAndUpdate(this.state.admins, selected);
                    this.props.onActionSuccess('Organiser successfully deleted');
                })
                .catch(this.props.onActionError);
            }
        };
    }

    updateAdmins(collection, element) {
        let newElements = collection.slice(0);
        let oldElement = newElements.find (g => g.id === element.id);
        if(oldElement) {
            Object.assign(oldElement, element);
        }
        else {
            newElements.push(element);
        }
        this.setState({admins: newElements});
    }

    removeAndUpdate(collection, element) {
        let oldElement = collection.find(item => item.id === element.id);
        this.setState({admins: _.without(collection, oldElement)});
    }

    componentWillReceiveProps() {
        if(this.props.labId) {
            labService.getOrganisers(this.props.labId)
                    .then( admins => {
                        this.setState({admins: admins});
                    });
        }
    }

    render() {
        return (
            <AdminsView
                title='Organisers'
                admins={this.state.admins}
                onSaveAdmin={this.state.onSave}
                onDeleteAdmin={this.state.onDelete}
                />
        )
    }
}

OrganiserViewContainer.propTypes = {
    onPreAction: React.PropTypes.func,
    onActionError: React.PropTypes.func,
    onActionSuccess: React.PropTypes.func,
    labId : React.PropTypes.string
};

export default OrganiserViewContainer
