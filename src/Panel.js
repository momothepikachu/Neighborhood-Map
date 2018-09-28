import React, { Component } from 'react';
import './Panel.scss'

class Panel extends Component {
	render() {
		return (
			<div className="panel">
				<h1 className="title">Foodie Map</h1>
				<h2 className="desktop__headers"> My location </h2>
				<input type="text" id="myLocation" placeholder="Current Location"/>
				<button id="locationSubmit" className="mobileButton"><span className="mobileButtonTitle">Go</span><span className="desktopButtonTitle">Submit</span></button>
				<h2 className="desktop__headers" id="explore"> Explore </h2>
				<input type="text" id="searchRestaurant" placeholder="Ex: Pizza"/>
				<button id="searchSubmit" className="mobileButton"><span className="mobileButtonTitle">Go</span><span className="desktopButtonTitle">Submit</span></button>
				<label id="openNow"><input type="checkbox"/>Open now</label>
				<h2 className="desktop__headers"> Rating </h2>
		        <select id="selectRating">
		          <option value="5">5</option>
		          <option value="4.5" selected>4.5</option>
		          <option value="4">4</option>
		          <option value="3.5">3.5</option>
		          <option value="3">3</option>
		        </select>
		        <h2 className="desktop__headers"> Radius </h2>		        
		        <select id="transit">
		          <option value="drive">drive</option>
		          <option value="bike">bike</option>
		          <option value="walk">walk</option>
		        </select>				
		        <select id="max-duration">
		          <option value="10">10 min</option>
		          <option value="15">15 min</option>
		          <option value="30">30 min</option>
		          <option value="60">1 hour</option>
		        </select>								
			</div>
		);
	}
}
export default Panel;