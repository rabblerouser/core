import React, {Component} from 'react';
import AdminsView from './AdminsView.jsx';
import adminService from '../../../services/adminService.js';
import _ from 'underscore';

export default class NetworkAdminsViewContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            admins: [],
            onSave: (adminDetails) => {
                this.props.onPreAction();
                let saveAction = this.state.admins.find(admin => admin.id === adminDetails.id) === undefined ? adminService.createNetworkAdmin : adminService.updateNetworkAdmin;
                saveAction(adminDetails)
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
                    this.setState({admins: _.without(this.state.admins, selected)});
                    this.props.onActionSuccess('Network admin successfully deleted');
                })
                .catch(this.props.onActionError);
            }
        };
    }

    updateAdmins(collection, element) {
        let newElements = collection.slice(0);
        _.extend(newElements.find (g => g.id === element.id), element);
        this.setState({admins: newElements});
    }

    componentDidMount() {
        adminService.getNetworkAdmins()
            .then( admins => this.setState({admins: admins}) );
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
    onActionSuccess: React.PropTypes.func
};

export default NetworkAdminsViewContainer
