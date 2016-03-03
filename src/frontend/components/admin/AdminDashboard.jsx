import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import MembersList from './MembersList.jsx';
import GroupsList from './GroupsList.jsx';


export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            members: [],
            groups: []
        };
    }

    componentDidMount() {
        $.ajax({
            type: 'GET',
            url: '/members',
            dataType: 'json',
            success: function(value) {
                this.setState({members: value.members});
            }.bind(this)
        });

        $.ajax({
            type: 'GET',
            url: '/groups',
            dataType: 'json',
            success: function(value) {
                console.log(value);
                this.setState({groups: value.groups});
            }.bind(this)
        });
    }


    render() {
        return (
            <div className="admin-container">
                <div className="container">
                    <GroupsList groups={ this.state.groups } />
                    <MembersList members={ this.state.members }/>
                </div>
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));
