import React from 'react'
import {message, Button, Icon} from 'antd'
import PageContainer from '../pageBox';

import './index.less';

class User2 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <PageContainer title='User2'>
            <div>User2</div>
            </PageContainer>
        )
    }
}

export default User2;
