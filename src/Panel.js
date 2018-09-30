import React, { Component } from 'react';
import './Panel.scss'
import serializeForm from 'form-serialize'


class Panel extends Component {
	handleSubmit = (e)=>{
		e.preventDefault()
		const value = serializeForm(e.target, {harsh: true})
		if (this.props.onUpdateMyLocation) {
			this.props.onUpdateMyLocation(value.location)
		}
	}
	handleExplore = (e)=>{
		e.preventDefault()
		const value = serializeForm(e.target, {harsh: true})
		if (this.props.onExplore) {
			if(!value.explore){
				alert('please enter a key word')
			} else {
				let val = value.explore.trim()
				this.props.onExplore(val)				
			}
		}
	}	
	handleRating = (val)=>{
		this.props.onUpdateRating(val)
	}
	handleMode = (val)=>{
		this.props.onUpdateMode(val)
	}
	handleDuration = (val)=>{
		this.props.onUpdateDuration(val)
	}
	
	render() {
		const { data} = this.props
		return (
			<div className="panel">
			<h1 className="title">Foodie Map</h1>
			<h2 className="desktop__headers"> My location </h2>
			<div id="forms">
				<form onSubmit={this.handleSubmit} autoComplete="off">
					<input type="text" name="location" id="myLocation" placeholder="Ex: UVA"/>
					<button id="locationSubmit" className="mobileButton"><span className="mobileButtonTitle">Go</span><span className="desktopButtonTitle">Submit</span></button>				
				</form>
				<h2 className="desktop__headers" id="explore"> Explore </h2>
				<form onSubmit={this.handleExplore} autoComplete="off">
					<input type="text" name="explore" id="searchRestaurant" placeholder="Ex: Pizza"/>
					<button id="searchSubmit" className="mobileButton"><span className="mobileButtonTitle">Go</span><span className="desktopButtonTitle">Submit</span></button>
				</form>				
			</div>	
			<h2 className="desktop__headers"> Rating </h2>
			<select onChange={(e)=>{this.handleRating(e.target.value)}} value={data.ratingValue} id="selectRating">
			<option value="5">5</option>
			<option value="4.5">4.5</option>
			<option value="4">4</option>
			<option value="3.5">3.5</option>
			</select>
			<h2 className="desktop__headers"> Radius </h2>		        
			<select onChange={(e)=>{this.handleMode(e.target.value)}} id="transit">
			<option value="DRIVING">drive</option>
			<option value="BICYCLING">bike</option>
			<option value="WALKING">walk</option>
			</select>				
			<select onChange={(e)=>{this.handleDuration(e.target.value)}} id="max-duration">
			<option value="30">30 min</option>
			<option value="15">15 min</option>
			<option value="10">10 min</option>
			</select>							
			</div>
			);
	}
}
export default Panel;