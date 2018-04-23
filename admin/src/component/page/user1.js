import React from 'react'
import {message, Button, Icon} from 'antd'
import PageContainer from '../pageBox';

import './index.less';

class User1 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <PageContainer title='User1'>
            <div>User1</div>
            </PageContainer>
        )
    }
}

export default User1;
