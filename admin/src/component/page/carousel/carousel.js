import React from 'react'
import {message, Button, Icon, Form, Input, Checkbox} from 'antd'
import EditableTable from '../../EditableTable';
import PageContainer from '../../pageBox';
import createBreadCrumb from '../../../assets/util/breadCrumb';
import '../index.less';
import menuData from "../../../menu";
import request from '../../../assets/util/request';


class Carousel extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            breadcrumb:[],
        }
    }
    componentDidMount(){
        this.setState({
            breadcrumb:createBreadCrumb(this.props.location.pathname,menuData)
        })

    }

    render() {

        return (
            <PageContainer title='首页轮播设置' breadcrumb={this.state.breadcrumb}>
                <EditableTable></EditableTable>

            </PageContainer>
        )
    }
}

export default Carousel;
