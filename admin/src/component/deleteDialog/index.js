import React from 'react'
import {Modal} from 'antd'

class DeleteDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
      return  <Modal title="确认删除" visible={this.props.visible}
        onOk={this.props.onOk} onCancel={this.props.onCancel}
        okText={"确定"}
        cancelText={"取消"}
        >
          <p>您确定要删除 {this.props.msg}？</p>
        </Modal>
    }
}

export default DeleteDialog;
