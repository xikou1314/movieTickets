import React, { Component } from 'react'
import styles from './style.less'
import {Modal,Button} from 'antd'
import $ from 'jquery';
class FilmSeat extends Component {
  constructor(props){
     super(props)
     this.state = {
       row:this.props.row,
       column:this.props.column,
       seatFlag: this.props.selectedData
     }
  }
  getSeat=(row,column)=>{
    var rows=[];
    for(var i=1;i<=row;i++)
    {
      rows.push(      
      <div className="row" data-row={i}>
      {
        this.getRowSeat(i,column)
      }
      </div>);

    }
    return rows;
  }
  getRowSeat=(row,column)=>{
    
    var seats=[];
    for(var i=1;i<=column;i++)
    {
      if(this.state.seatFlag[row-1] && this.state.seatFlag[row-1][i-1]==0)
      {
        seats.push(<span className="seat" data-selected="0" data-row={row} data-column={i} onClick={this.handleSelect}></span>);
      }
      else
      {
        seats.push(<span className="seat" style={{background:'red'}} data-selected="1" data-row={row} data-column={i} onClick={this.handleSelect}></span>);
      }
      
    }
    return seats;
  }
  getRowId=(row)=>{
    var rowId=[];
    for(var i=1;i<=row;i++)
    {
      rowId.push(<span className="row-id">{i}</span>);
    }
    return rowId;
  }
  //选择某行某列的某个位置 
  handleSelect=(e)=>{
    let data=this.state.seatFlag.concat([]);
    var $element=$(e.target);
    var row=$element.attr("data-row");
    var column=$element.attr("data-column");
    var selected=$element.attr("data-selected");
    if(selected==="0")
    {
      $element.css({'background':'red'});
      data[row-1][column-1]=1;
      $element.attr("data-selected","1");
    }
    else{
      $element.css({'background':'white'});
      data[row-1][column-1]=0;
      $element.attr("data-selected","0");
    }
    this.setState({
      seatFlag:data
    })

  }
  onOk=()=>{
    this.props.onOk();

  }
  onCancel=()=>{
    this.props.onCancel(this.state.seatFlag);
  }
  componentWillReceiveProps(nextProps)
  {
    this.setState({
      row:nextProps.row,
      column:nextProps.column,
      seatFlag:nextProps.selectedData
    })
  }
  render(){
    const {row,column} = this.state;
    return (
      <Modal title="设置座位" visible={this.props.visible}
      onOk={this.onOk} onCancel={this.onCancel}
      width={column>10? (650+(column-10)*60+'px') : '650px'}
      footer={[]}
      >
      <div className="container" style={{
          width: column>10? (600+(column-10)*60+'px') : '600px'
      }}>
        <div className="row-id-container">
          {
            this.getRowId(row)
          }
        </div>
        <div className="seats-container" >
          <div className="screen-container">
            <div className="screen">银幕中央</div>
            <div className="screen-line"></div>
          </div>
          <div className="seats-wrapper">
            {this.getSeat(row,column)}
          </div>
        </div>
      </div>
      </Modal>);
  }
}
export default FilmSeat