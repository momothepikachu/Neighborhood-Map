/* global google */

import React, { Component } from 'react';
import './App.scss';
import * as MapStyle from './MapStyle'
import Panel from './Panel'
import * as YelpAPI from './YelpAPI'
import * as GoogleMapsAPI from './GoogleMapsAPI'

class App extends Component {
  state = {
    currentLocation: {lat:38.029306, lng:-78.476678},
    locations:[]
  }
  
  componentWillMount() {
    GoogleMapsAPI.getGoogleMaps();
  }

  componentDidMount() {
    GoogleMapsAPI.initMap(MapStyle, this.state.currentLocation);
    YelpAPI.get().then((response)=>{
      this.setState({locations:response.businesses})
      console.log(this.state.locations)
      return response.businesses
    }).then((data)=>{
      GoogleMapsAPI.setMarkers(data)
      return data
    }).then((data)=>{
      GoogleMapsAPI.setInfoWindow()
    })
  }

  render() {
    return (
      <div className="App"> 
      <Panel />   
      <div id="map" style={{position: 'absolute'}}></div>
      </div>
      );
  }
}

export default App;
