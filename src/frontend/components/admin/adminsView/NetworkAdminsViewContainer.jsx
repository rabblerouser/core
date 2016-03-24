import React, {Component} from 'react';
import AdminsView from './AdminsView.jsx';
import adminService from '../../../services/adminService.js';

export default class NetworkAdminsViewContainer extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            admins: [],
            onSave: (adminDetails) => {
                this.props.onPreAction();
                let saveAction = this.state.admins.find(admin => admin.id === adminDetails.id) === undefined ? adminService.createNetworkAdmin : adminService.updateNetworkAdmin;
                saveAction(adminDetails, this.props.labId)
                    .then((savedAdmin) => {
                        this.updateAdmins(this.state.admins, savedAdmin);
                        this.props.onActionSuccess('Network admin successfully saved');
                    })
                    .catch(this.props.onActionError);
            },
            onDelete: (selected) => {
                this.props.onPreAction();
                adminService.deleteNetworkAdmin(selected)
                .then(()=> {
                    this.removeAndUpdate(this.state.admins, selected);
                    this.props.onActionSuccess('Network admin successfully deleted');
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
            adminService.getNetworkAdmins(this.props.labId)
                    .then( admins => {
                        this.setState({admins: admins});
                    });
        }
    }

    render() {
        return (
            <AdminsView
                title='Network Admins'
                admins={this.state.admins}
                onSaveAdmin={this.state.onSave}
                onDeleteAdmin={this.state.onDelete}
                />
        )
    }
}

NetworkAdminsViewContainer.propTypes = {
    onPreAction: React.PropTypes.func,
    onActionError: React.PropTypes.func,
    onActionSuccess: React.PropTypes.func,
    labId : React.PropTypes.string
};

export default NetworkAdminsViewContainer
