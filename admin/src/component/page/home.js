import React from 'react'
import {message, Button, Icon} from 'antd'
import PageContainer from '../pageBox';

import './index.less';

class Home extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <PageContainer title='概况'>
                <div className='wellcome'>
                    <Icon type='smile-o'/>
                    <h3>antd admin boilerplate</h3>
                </div>
            </PageContainer>
        )
    }
}

export default Home;
