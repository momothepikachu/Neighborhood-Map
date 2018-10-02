import React, { Component } from 'react';
import './Panel.scss'
import serializeForm from 'form-serialize'

class Panel extends Component {
	// when clicking filters, ask for user's current location if there is not one
	handleClick = ()=>{
		let address = this.props.data.currentLocation;
		if (address.lat===38.051264 && address.lng===-78.488061){
			alert('Please enter your current location')
		}
	}
	// handle info entered for user location and explore form
	handleSubmit = (e)=>{
		e.preventDefault()
		const value = serializeForm(e.target, {harsh: true})
		if (this.props.onUpdateMyLocation) {
			this.props.onUpdateMyLocation(value.location)
		}
	}
	// handle key word for restaurant
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
	// value for filter: rating	
	handleRating = (val)=>{
		this.props.onUpdateRating(val)
	}
	// value for filter: transportation mode
	handleMode = (val)=>{
		this.props.onUpdateMode(val)
	}
	// value for filter: max duration
	handleDuration = (val)=>{
		this.props.onUpdateDuration(val)
	}
	// update panel view list when parent's state changes
	componentDidUpdate(prevProps) {
		let newLoc = this.props.data.newlocations;
		let oldLoc = prevProps.data.newlocations;
		for(let i=0;i<=newLoc.length;i++){
				if(!oldLoc[i] || newLoc.length!==oldLoc.length || newLoc[i].name !== oldLoc[i].name){
					this.showRestaurantList()
				}
		}		
	}

	showRestaurantList = ()=>{
		let sth = this.props.onOpenRestaurantInfo
		let locationList = this.props.data.newlocations;
		console.log(locationList)
		let length = this.props.data.newlocations.length;
		document.getElementById('list_ul').innerHTML = ''
		document.getElementById('list_select').innerHTML = ''
		locationList.map((restaurant, index)=>{
			let name = restaurant.name;
			let li = document.createElement('LI');
			let option = document.createElement('OPTION');
			this.setMulAttr(li,name,index,length)
			this.setMulAttr(option,name,index,length)
			document.getElementById('list_ul').appendChild(li)
			document.getElementById('list_select').appendChild(option)
			li.addEventListener('click', function(e){
				let id = +e.target.id
				sth(id)
			})
			li.addEventListener('keypress', function(e){
				let key = e.which || e.keyCode;
			    if (key === 13) { // 13 is enter
					let id = +e.target.id				
					sth(id)
			    }				
			})			
		})		
	}
	// helper method for setting up attribute for the view list
	setMulAttr=(el,name, index, total)=>{
		let newIndex = index+1
		el.innerHTML = name;
		el.setAttribute("id", index);
		el.setAttribute("tabindex", 10);
		el.setAttribute('aria-posinset', newIndex)
		el.setAttribute('aria-setsize', total)
		el.setAttribute('role', 'option')		
	}

	render() {
		const { data} = this.props
		return (
			<div className="panel">
			<h1 className="title" >Foodie Map</h1>			
			<div id="forms">
			<h2 className="desktop__headers" id="myLocationHeader"> My location </h2>
			<form onSubmit={this.handleSubmit} autoComplete="off">
			<input aria-labelledby="myLocationHeader" type="text" name="location" id="myLocation" placeholder="Ex: UVA" tabIndex="1"/>
			<button tabIndex="2" id="locationSubmit" className="mobileButton"><span className="mobileButtonTitle">Go</span><span className="desktopButtonTitle">Submit</span></button>				
			</form>
			<h2 className="desktop__headers" id="explore"> Explore </h2>
			<form onSubmit={this.handleExplore} autoComplete="off">
			<input aria-labelledby="explore" type="text" name="explore" id="searchRestaurant" placeholder="Ex: Pizza" tabIndex="3"/>
			<button tabIndex="4" id="searchSubmit" className="mobileButton"><span className="mobileButtonTitle">Go</span><span className="desktopButtonTitle">Submit</span></button>
			</form>				
			</div>	
			<h2 className="desktop__headers" id="filters"> Filters </h2>
			<select aria-label="filters: restaurant rating" tabIndex="5" onChange={(e)=>{this.handleRating(e.target.value)}} value={data.ratingValue} id="selectRating">
			<option value="5">5</option>
			<option value="4.5">4.5</option>
			<option value="4">4</option>
			<option value="3.5">3.5</option>
			</select>		        
			<select aria-label="filters: transportation mode" tabIndex="6" onClick={this.handleClick} onChange={(e)=>{this.handleMode(e.target.value)}} id="transit">
			<option value="DRIVING">drive</option>
			<option value="BICYCLING">bike</option>
			<option value="WALKING">walk</option>
			</select>				
			<select aria-label="filters: transportation max duration" tabIndex="7" onClick={this.handleClick} onChange={(e)=>{this.handleDuration(e.target.value)}} id="max-duration">
			<option value="30">30 min</option>
			<option value="15">15 min</option>
			<option value="10">10 min</option>
			</select>
			<h2 className="desktop__headers"> Restaurants </h2>	
			<nav id="list" tabIndex="8">
			<ul aria-label="list of Restaurants" role='listbox' id="list_ul">
			</ul>
			<select aria-label="list of Restaurants" id="list_select" tabIndex="9"> 
				<option>Select</option> 			    
			</select>             
			</nav>										
			</div>
			);
	}
}
export default Panel;