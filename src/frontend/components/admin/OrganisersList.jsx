'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import {sortByOrder, map} from 'lodash';
const Table = require('reactabular').Table;
import sortColumn from '../../lib/sortColumn.js';
const classnames = require('classnames');

function tableColumns() {
    return [
        {
            property: 'name',
            header: 'Organiser name',
            cell: (nothing, organisers, rowIndex) => {
                return {
                    value: <span>{organisers[rowIndex].firstName + " " + organisers[rowIndex].lastName}</span>
                }
            },
            headerClass: classnames('name participant')
        },
        {
            property: 'contactNumber',
            header: 'Contact information',
            cell: (nothing, organisers, rowIndex) => {
                return {
                    value:
                        <dl>
                            <dd>{organisers[rowIndex].contactNumber}</dd>
                            <dd>{organisers[rowIndex].contactEmail}</dd>
                        </dl>

                }
            },
            headerClass: classnames('contact')
        }
    ];
}

export default class OrganisersList extends Component {

    constructor(props) {
        super(props);
        this.state  = {
            columns: tableColumns(),
            columnNames: {
                onClick: (column) => {
                    sortColumn(
                        this.state.columns,
                        column,
                        this.setState.bind(this)
                    );
                }
            }
        };
    }

    render() {
        let data = sortColumn.sort(this.props.organisers, this.state.sortingColumn, sortByOrder);

        return (
            <Table columns={this.state.columns} data={data} columnNames={this.state.columnNames}/>
        );
    }
}
