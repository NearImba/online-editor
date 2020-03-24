import React, { Component } from 'react';

import './add.scss';

export default class Add extends Component {
    render () {
        const { name } = this.props;
        return (
          <div className="my-fc">
            Congratulations to {name || 'wu'} !!2
          </div>
);
    }
}
