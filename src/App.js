/* global google */

import React, { Component } from 'react';
import './App.css';
import * as MapStyle from './MapStyle'
import Panel from './Panel'

class App extends Component {
  getGoogleMaps() {
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        window.resolveGoogleMapsPromise = () => {
          resolve(google);
        };
        const script = document.createElement("script");
        const API = 'AIzaSyDiADYLnih_NW88akZPOpqVTZIjLbv_8Zo';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }
    return this.googleMapsPromise;
  }

  componentWillMount() {
    this.getGoogleMaps();
  }

  componentDidMount() {
    this.getGoogleMaps().then((google) => {
      const city = {lat:38.018175, lng:-78.498115};
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: city,
        styles: MapStyle.style
      });
    });
  }

  render() {
    return (
      <div className="App"> 
        <Panel />   
        <div id="map"></div>
      </div>
    );
  }
}

export default App;
