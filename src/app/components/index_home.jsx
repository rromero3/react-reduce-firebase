/*import React from 'react';

export default () => {
  return <div> Bienvenido a Ofertas hoy! </div>;
};*/

import React, { Component } from 'react';
//import ResultList from 'search/ResultList';
import CitiesList from './search/CitiesList';
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
            todaysOffers: [],
            cities: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
	}


  getTodayOffers(){
    var todayOffersDatabaseRef = FireBaseTools.getDatabaseReference("todayOffers");
    todayOffersDatabaseRef.limitToLast(25).on('value', (dataSnapshot=> { 
          var items =[];

          dataSnapshot.forEach( childSnapshot => { 
              var item = childSnapshot.val();

              item['.key'] = childSnapshot.key;
              items.push(item);
            });
            this.setState({ todaysOffers: items });
        }));
  }

  getCities(){
    var citiesDatabaseRef = FireBaseTools.getDatabaseReference("cities");
    citiesDatabaseRef.limitToLast(25).on('value', (dataSnapshot=> { 
          var items =[];

          dataSnapshot.forEach( childSnapshot => { 
              var item = childSnapshot.val();

              item['.key'] = childSnapshot.key;
              items.push(item);
            });
            this.setState({ cities: items });
        }));
  }

	componentWillMount() {
    let firebaseRef;
    let todaysOffersRef;

    this.getTodayOffers();
    this.getCities();
    }

  	componentWillUnmount () {
    this.firebaseRef.off();
  	}

   	handleTermChange(term) {
		var _this = this;
        this.setState({text: term});
  	}

  	handleSubmit(e) {
  		e.preventDefault();
      var _this = this;
  		var firebaseKey = this.firebaseRef.push().getKey();
    	if (this.state.text && this.state.text.trim().length !== 0) {

          const file = e.target[2].files[0];
          const extension = file.name.split('.').pop();

          // Create the file metadata
          var metadata = {
                contentType: file.type,
                id : firebaseKey
                };

          var storageRef = FireBaseTools.getChildStorageReference("images/"+firebaseKey);
          var uploadTask = storageRef.put(file, metadata);

          // Register three observers:
          // 1. 'state_changed' observer, called any time the state changes
          // 2. Error observer, called on failure
          // 3. Completion observer, called on successful completion
          uploadTask.on('state_changed', 
            function(snapshot){
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
            }, function(error) {
              // Handle unsuccessful uploads
            }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var downloadURL = uploadTask.snapshot.downloadURL;

            // after the file is upload push the message
            _this.firebaseRef.push(
             {
              lenght : _this.state.todaysOffers.length+1,
              id :firebaseKey,
              due : FireBaseTools.getServerTimeStamp(),
              url : downloadURL,
              text : _this.state.text,
              imageFullPath : storageRef.fullPath,
              imageName: storageRef.name,
              fileExtension: extension
             });

              _this.setState({
              text: ''
              });

          });
  			}
  		}

  	onChange = (event) => {
  		this.setState({ text: e.target.value })};

    render() {
        return (
            <div>
        		 <Link className="col-xs-12 col-md-12" to="/" className="navbar-brand"><img src="img/logo.png" alt="Ofertas Hoy Logo" width="100px" height="45px"></img></Link>
             <h3>Las ofertas de Hoy</h3>
             <br></br>
                <CitiesList cities={this.state.cities} />
                <ResultList todaysOffers={this.state.todaysOffers} />

                <form onSubmit={ this.handleSubmit }>
         			    <SearchBar onTermChange={this.handleTermChange} />
         			    <button>{ 'Add #' + (this.state.todaysOffers.length + 1) }</button>

                  <label htmlFor="input-b1">Select File</label>
                  <input className="btn btn-default btn-file file" id="nameImg" name="nameImg" type="file"  accept="image/*"></input>
        		    </form>
            </div>
        );
    }
}


export default HomeIndex;