/* global google */

import React, { Component } from 'react';
import './App.scss';
import * as MapStyle from './MapStyle'
import Panel from './Panel'
import * as YelpAPI from './YelpAPI'
import * as GoogleMapsAPI from './GoogleMapsAPI'

class App extends Component {
  state = {
    city: {lat:38.051264, lng:-78.488061},
    currentLocation: '',
    ratingValue: 4.5,
    mode: 'DRIVING',
    duration: '30',
    locations:[],
    newLocations: []
  }
  
  componentWillMount() {
    GoogleMapsAPI.getGoogleMaps();
  }

  componentDidMount = ()=> {
    GoogleMapsAPI.initMap(MapStyle, this.state.city).then(()=>{
      YelpAPI.get().then((response)=>{
        this.setState({locations:response.businesses})
        this.setState({newLocations:response.businesses})
        console.log(this.state.locations)
        return response.businesses
      }).then((data)=>{
        GoogleMapsAPI.setMarkers(data)
        return data
      }).then((data)=>{
        GoogleMapsAPI.setInfoWindow()
      })
    })
  }
 
  updateRating = (val)=>{
    let newLocations = this.state.locations.filter((restaurant)=>restaurant.rating >= val)
    GoogleMapsAPI.setMarkers(newLocations)
    GoogleMapsAPI.searchWithinTime(this.state.currentLocation, newLocations, this.state.mode, this.state.duration)
    this.setState({newLocations: newLocations}, GoogleMapsAPI.setInfoWindow())
    this.setState({ratingValue: val}) 
  }

  updateMyLocation = (loc)=>{
    GoogleMapsAPI.setMyMarker(loc)
    this.setState({currentLocation: loc})   
  }

  explore = (val)=>{
    if (val) {
      const match = new RegExp(val, 'i')
      let newLocations = this.state.newLocations.filter((restaurant)=>{
        let list = restaurant.categories.filter((Obj)=>{
          if(match.test(Obj.alias) || match.test(Obj.title)) {
            return true
          } else {return false}
        })
        return list.length>0
      })
      if (newLocations.length>0){
        GoogleMapsAPI.setMarkers(newLocations)
        this.setState({newLocations: newLocations}, GoogleMapsAPI.setInfoWindow())        
      } else {
        alert('Oops! Wanna try something else?')
      }
    }
  }

  updateMode=(mode)=>{
    this.setState({mode}, ()=> GoogleMapsAPI.searchWithinTime(this.state.currentLocation, this.state.newLocations, this.state.mode, this.state.duration))
  }

  updateDuration=(duration)=>{
    this.setState({duration}, ()=> GoogleMapsAPI.searchWithinTime(this.state.currentLocation, this.state.newLocations, this.state.mode, this.state.duration))
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
        data={this.state}
      />   
      <div id="map" style={{position: 'absolute'}}></div>
      </div>
      );
  }
}

export default App;
