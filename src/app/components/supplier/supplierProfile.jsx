import React, { Component } from 'react';
import SupplierOfferList from './SupplierOfferList';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from '../helpers/loading';
import request from 'superagent';
import FireBaseTools from '../../utils/firebase';

import { fetchUser, updateUser } from '../../actions/firebase_actions';

class SupplierProfile extends Component {
	constructor(props){
		super(props);
		this.props.fetchUser();
		this.state = {
            supplierOffers: []
        }
	}

  componentWillMount() {
	  

    let firebaseRef;
    let todaysOffersRef;
    
    this.firebaseRef = FireBaseTools.getDatabaseReference("todayOffers");
    this.firebaseRef.orderByChild("uid").limitToLast(25).on('value', (dataSnapshot=> { 
        	var items =[];

        	dataSnapshot.forEach( childSnapshot => { 
        			var item = childSnapshot.val();

        			item['.key'] = childSnapshot.key;
        			items.push(item);
        		});

        		this.setState({ supplierOffers: items });
        }));
    }

  	componentWillUnmount () {
    this.firebaseRef.off();
  	}

  render() {
  		if (!this.props.currentUser) {
            return <Loading />;
        }
        else
        {
			console.log("1asdasdasdasdasdasdasdd");
    		console.log(this.props.currentUser);    
        }

        return (
    		<div className="row col-md-12">
    			<SupplierOfferList supplierOffers={this.state.supplierOffers} />
    		</div>
  	);
  }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUser, updateUser }, dispatch);
}


function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(SupplierProfile);