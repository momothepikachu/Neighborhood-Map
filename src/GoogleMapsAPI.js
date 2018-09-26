/* global google */
import './GoogleMapsAPI.scss'
import * as YelpAPI from './YelpAPI'

let map;
let markers = [];
function toggleInfoWindow(infowindow, marker){
	infowindow.open(map, marker)
}

export const getGoogleMaps = ()=>{
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

export const initMap = (MapStyle, currentLoc)=>{
	getGoogleMaps().then((google) => {
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 13,
			center: currentLoc,
			styles: MapStyle.style,
			disableDefaultUI: true
		});
	});
}

export const setMarkers = (locations)=>{
    // const topRestaurant = locations.filter(
    // 	restaurant => restaurant.rating >= 4.5);
    let image = {
    	url: 'https://i.postimg.cc/Z5hY3FrK/Star.png',
    	scaledSize: new google.maps.Size(50, 85)
    };


    locations.map( restaurant =>{
    	let restaurantName = restaurant.name;
    	let restaurantRating = restaurant.rating;
    	let restaurantAddress = restaurant.location.address1+', Charlottesville, VA';
    	var marker = new google.maps.Marker({
    		position: {lat:restaurant.coordinates.latitude, lng:restaurant.coordinates.longitude },
    		map: map,
    		animation: google.maps.Animation.DROP,
    		id: restaurant.id,
    		title: restaurantName,
    		icon: image,
    		rating: restaurantRating,
    		address: restaurantAddress
    	});	

    	markers.push(marker)

    })
    console.log(markers)
}
export const setInfoWindow = ()=>{  
	let largeInfowindow = new google.maps.InfoWindow();  
    markers.map((marker)=>{    	 
    	marker.addListener('mouseover', function(){
    		this.setAnimation(google.maps.Animation.BOUNCE);
    	})	
    	marker.addListener('mouseout', function(){
    		this.setAnimation(null);
    	})
    	marker.addListener('click', function(){
    	largeInfowindow.setContent('<div id="infoWindow"><div id="title">'+ 
    		marker.title + '</div><div id="rating">'+ marker.rating+ 
    		'</div><div id="address">'+marker.address+'</div></div>')     		
    		toggleInfoWindow(largeInfowindow, marker)
    	})    		  	
    })	
}