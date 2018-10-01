/* global google */

import React, { Component } from 'react';
import './App.scss';
import * as MapStyle from './MapStyle'
import Panel from './Panel'
import * as GoogleMapsAPI from './GoogleMapsAPI'
import $ from 'jquery'

const token = 'Bearer uFxKyDnUWdPEZkWgzk-e3DIAbLGwfSBoXxw6EoHJab7YdXXA53fekY4fAo-_PIb2r8Hn3Cal79YoHIhbcc2ilvxAkiWSAjPr6VjCAVVq0hcdlSWsu4aPolsa0l-pW3Yx'
const cors_anywhere_url = 'https://thawing-hamlet-85900.herokuapp.com'
// const cors_anywhere_url = 'https://cors-anywhere.herokuapp.com'
const yelp_search_url = 'http://api.yelp.com/v3/businesses/search'
function objExplore(val){
  let obj = {
    'url': cors_anywhere_url+'/'+yelp_search_url,
    'data': {term: val, location:'charlottesville, va', limit: 20},
    headers: {'Authorization':token},
    error: function(jqXHR, textStatus, errorThrown){
      console.log('AJAX error, jqXHR = ', jqXHR, ', textStatus = ',
        textStatus, ', errorThrown = ', errorThrown)
    }
  }
  return obj
}

class App extends Component {
  state = {
    index: -1,
    city: {lat:38.051264, lng:-78.488061},
    currentLocation: {lat:38.051264, lng:-78.488061},
    ratingValue: 4.5,
    mode: 'DRIVING',
    duration: '30',
    locations:[],
    explore: 'restaurant'
  }
  
  get = (val)=>{
    return $.ajax(val)   
  }

  init=(obj)=>{
    return GoogleMapsAPI.initMap(MapStyle, this.state.city).then(()=>{
      this.get(obj).then((response)=>{
        let locations = response.businesses.filter((restaurant)=>restaurant.rating >= this.state.ratingValue)
        this.setState({locations:locations})
        console.log(this.state.locations)
        return locations
      }).then((data)=>{
        if(this.state.locations.length===0){
          alert('Oops! We found no matching restaurants:(')
        }
        GoogleMapsAPI.setMarkers(data)
        return data
      }).then(()=>{
        GoogleMapsAPI.setInfoWindow()
      }).then(()=>{
        GoogleMapsAPI.searchWithinTime(this.state.currentLocation, this.state.locations, this.state.mode, this.state.duration)
      })
    })    
  }

  componentWillMount() {
    GoogleMapsAPI.getGoogleMaps();
  }

  componentDidMount = ()=> {
    this.init(objExplore(this.state.explore))
  }

  updateRating = (val)=>{
    this.setState({ratingValue: val}, ()=>{
      this.init(objExplore(this.state.explore))
      let address = this.state.currentLocation
      if (address.lat!==38.051264 || address.lng!==-78.488061) {
        GoogleMapsAPI.setMyMarker(this.state.currentLocation)
      }
    })
  }

  updateMyLocation = (loc)=>{
    if(!loc || !loc.trim()) {
      alert('Please enter your location')
    } else {
      GoogleMapsAPI.setMyMarker(loc)
      GoogleMapsAPI.searchWithinTime(loc, this.state.locations, this.state.mode, this.state.duration)//show all listing within time and mode
      this.setState({currentLocation: loc})         
    }   
  }

  explore = (val)=>{
    if (val) {
      let obj = objExplore(val)
      this.setState({explore: val}, ()=>{
        this.init(obj)
        let address = this.state.currentLocation
        if (address.lat!==38.051264 || address.lng!==-78.488061) {        
          GoogleMapsAPI.setMyMarker(this.state.currentLocation)
        }
      })      
    }
  }

  updateMode=(mode)=>{
    let address = this.state.currentLocation
    if (address.lat===38.051264 && address.lng===-78.488061) {
      alert('Please enter your current location')
    } else {
      this.setState({mode}, ()=> GoogleMapsAPI.searchWithinTime(address, this.state.locations, this.state.mode, this.state.duration))
    }  
  }

  updateDuration=(duration)=>{
    let address = this.state.currentLocation
    if (address.lat===38.051264 && address.lng===-78.488061) {
      alert('Please enter your current location')
    } else {
      this.setState({duration}, ()=> GoogleMapsAPI.searchWithinTime(address, this.state.locations, this.state.mode, this.state.duration))
    }
  }

  openRestaurantInfo = (id)=>{
    GoogleMapsAPI.openInfoWindow(id)
  }

  render() {
    return (
      <div className="App"> 
        <Panel 
        onUpdateMyLocation={this.updateMyLocation}
        onUpdateMode={this.updateMode}
        onUpdateDuration={this.updateDuration}
        onUpdateRating={this.updateRating}
        onExplore={this.explore}
        onOpenRestaurantInfo={this.openRestaurantInfo}
        data={this.state}
        />   
        <div 
          id="map" 
          style={{position: 'absolute'}}
          tabIndex={this.state.index}>
        </div>
      </div>
      );
  }
}

export default App;
