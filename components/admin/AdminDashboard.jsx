import React, {Component} from 'react';
import {render} from 'react-dom';
import Secretary from './Secretary.jsx';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.statics = {
            dashboard: 1,
            secretary: 2,
            treasurer: 3,
            memberDetails: 4
        };
        this.render = this.render.bind(this);
        this.loadSecretaryPage = this.loadSecretaryPage.bind(this);
        this.loadTreasurerPage = this.loadTreasurerPage.bind(this);
        this.state = {page: this.statics.dashboard};
    }


    loadSecretaryPage() {
        this.setState({page: this.statics.secretary});
    }

    loadTreasurerPage() {
        this.setState({page: this.statics.secretary});
    }

    render() {
        if (this.state.page === this.statics.secretary) {
            return <div className="admin-container">
                <div className="container">
                    <Secretary />
                </div>
            </div>;
        }
        return (
            <div className="admin-container">
                <div className="container">
                    <div className="navigation">
                        <h1>Admin Dashboard</h1>
                        <br/>
                        <input type="button" className="admin-button" id="secretary" name="secretary" value="Secretary page"
                               onClick={this.loadSecretaryPage}/>
                        <br/>
                        <input type="button" className="admin-button" name="treasurer" value="Treasurer page"
                               onClick={this.loadTreasurerPage}/>
                        <br/>
                        <a href="/logout">Logout</a>
                    </div>
                </div>
            </div>

        )
    }
}

render(<AdminDashboard />, document.getElementById('app'));