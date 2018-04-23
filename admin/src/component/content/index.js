import React from 'react';

import './index.less';

class Content extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <main className="admin-framework-content">
                {this.props.children}
            </main>
        )
    }
}

export default Content
