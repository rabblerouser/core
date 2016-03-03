import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import MembersList from './MembersList.jsx';


export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            members: []
        };
        this.loadMembers = this.loadMembers.bind(this);
        this.loadMembers();
    }

    loadMembers() {
        $.ajax({
            type: 'GET',
            url: '/members',
            dataType: 'json',
            success: function(value) {
                this.setState({members: value.members});
            }.bind(this)
        });
    }

    render() {
        return (
            <div className="admin-container">
                <div className="container">
                    <MembersList members={this.state.members}/>
                </div>
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));
