/*import React from 'react';

export default () => {
  return <div> Bienvenido a Ofertas hoy! </div>;
};*/

import React, { Component } from 'react';
//import ResultList from 'search/ResultList';
import SearchBar from './search/SearchBar';
import ResultList from './search/ResultList';
import request from 'superagent';
import { loginUser, fetchUser, loginWithProvider } from '../actions/firebase_actions';
import FireBaseTools from '../utils/firebase';
import '../../styles/app.css';

import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class HomeIndex extends Component {
	constructor(props){
		super(props);
		this.state = {
            todaysOffers: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
	}

	componentWillMount() {
	console.log("index home componentWillMount");
    let firebaseRef;
    let todaysOffersRef;

    this.firebaseRef = FireBaseTools.getDatabaseReference("todayOffers");
    this.firebaseRef.limitToLast(25).on('value', (dataSnapshot=> { 
        	var items =[];
        	console.log(dataSnapshot);

        	dataSnapshot.forEach( childSnapshot => { 
        			var item = childSnapshot.val();
        			console.log(item);

        			item['.key'] = childSnapshot.key;
        			items.push(item);
        		});

        		this.setState({ message: "2312" });
        		this.setState({ todaysOffers: items });
        }));
    }

  	componentWillUnmount () {
	console.log("index home componentWillUnmount");
    this.firebaseRef.off();
  	}

   	handleTermChange(term) {
		var _this = this;
        console.log(term);
        this.setState({text: term});
  	}

  	handleSubmit(e) {
  		e.preventDefault();
  		var firebaseKey = this.firebaseRef.push().getKey();
    	if (this.state.text && this.state.text.trim().length !== 0) {
      		this.firebaseRef.push(
      			 {
      			 	lenght : this.state.todaysOffers.length+1,
      			 	id :firebaseKey,
      			 	due : FireBaseTools.getServerTimeStamp(),
      			 	url : "http://fakeimg.pl/400x200/",
      			 	text : this.state.text
      			 });

      		this.setState({
        	text: ''
      		});
  			}
  		}

  	onChange = (event) => {
  		this.setState({ text: e.target.value })};

    render() {
        return (
            <div>
        		<h1>Ofertas Hoy</h1>
                <ResultList todaysOffers={this.state.todaysOffers} />
                <form onSubmit={ this.handleSubmit }>
         			<SearchBar onTermChange={this.handleTermChange} />
         			<button>{ 'Add #' + (this.state.todaysOffers.length + 1) }</button>
        		</form>
            </div>
        );
    }
}


export default HomeIndex;