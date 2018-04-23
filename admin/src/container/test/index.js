import React , { Component }from 'react';
import FilmSeatTitle from '../../component/FilmSeatTitle/index';
class Test extends Component {
		constructor(props)
		{
			super(props);
			this.state={
        id:"111"
			};
	
		};

	  componentDidMount() {
      
	  };
    render(){
        return  <div>
   
          <FilmSeatTitle/>
  
        </div>

           
		
    };
};

export default Test;
  
