/* global google */
import './GoogleMapsAPI.scss'
import * as YelpAPI from './YelpAPI'
import $ from 'jquery'

let map;
let markers = [];
let state = {
	mode: 'DRIVING',
	duration: '30'
};
let myMarker = ''
let directionsDisplay = '';
function toggleInfoWindow(infowindow, marker){
	infowindow.open(map, marker)
}

export const getGoogleMaps = ()=>{
	if (!this.googleMapsPromise) {
		this.googleMapsPromise = new Promise((resolve) => {
			window.resolveGoogleMapsPromise = () => {
				resolve(google);
				delete window.resolveGoogleMapsPromise;
			};
			const script = document.createElement("script");
			const API = 'AIzaSyDiADYLnih_NW88akZPOpqVTZIjLbv_8Zo';
			script.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=${API}&callback=resolveGoogleMapsPromise`;
			script.async = true;
			document.body.appendChild(script);
		});
	}
	return this.googleMapsPromise;
}

export const initMap = (MapStyle, currentLoc)=>{
	return getGoogleMaps().then((google) => {
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 13,
			center: currentLoc,
			styles: MapStyle.style,
			disableDefaultUI: true
		});
		let myLocationComplete = new google.maps.places.Autocomplete(
			document.getElementById('myLocation'));	
		myLocationComplete.bindTo('bounds', map);
	});
}

export const setMyMarker = (loc)=>{
	if(myMarker!=='') {myMarker.setMap(null)}
	let image = {
		url: 'https://i.postimg.cc/8cjcKp5p/char-cat-girl.png',
		scaledSize: new google.maps.Size(50, 85)
	};
	let geocoder = new google.maps.Geocoder();
	let address = loc;
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === 'OK') {
			map.setCenter(results[0].geometry.location);
			myMarker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location,
				icon: image
			});
			state.currentLocation = results[0].geometry.location			
		} else {
			alert('Please enter a valid address >_<')
			// alert("Can't find your location for the following reason: " + status);
		}
	})
}

export const setMarkers = (locations)=>{
	if (markers.length>0) {
		markers.map((marker)=>{
			marker.setMap(null);
		})
		markers=[]		
	}
	if(directionsDisplay!==''){directionsDisplay.setMap(null)}	
	document.getElementById('searchRestaurant').value= ''
    let image = {
    	url: 'https://i.postimg.cc/Z5hY3FrK/Star.png',
    	scaledSize: new google.maps.Size(50, 85)
    };
    locations.map( restaurant =>{
    	let restaurantName = restaurant.name;
    	let restaurantRating = restaurant.rating;
    	let restaurantAddress = restaurant.location.address1+', Charlottesville, VA';
    	let marker = new google.maps.Marker({
    		position: {lat:restaurant.coordinates.latitude, lng:restaurant.coordinates.longitude },
    		map: map,
    		animation: google.maps.Animation.DROP,
    		id: restaurant.id,
    		title: restaurantName,
    		icon: image,
    		rating: restaurantRating,
    		address: restaurantAddress,
    		image: restaurant.image_url,
    		phone: restaurant.phone,
    		url: restaurant.url
    	});	

    	markers.push(marker)
    })
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
			let streetViewService = new google.maps.StreetViewService();
			let radius = 50; 
			function getStreetView(data, status) {
				if (status === 'OK') {
					let nearStreetViewLocation = data.location.latLng;
					largeInfowindow.setContent('<div id="infoWindow"><img id="photo" src="'+
						marker.image+'"><div id="title">'+ 
						marker.title + '</div><div id="rating"><span>'+ marker.rating+ 
						' Stars </span><img id="ratingstars" src="'+YelpAPI.stars(marker.rating)+
						'"></div><div id="info"><h3>Address</h3>'+marker.address+
						'<h3>Phone</h3>'+marker.phone+
						'</div><button id="getDirection">Directions</button><a id="details" href="'+
						marker.url+'">View details</a><h3>Street View</h3><div id="pano"></div></div>') 
					let panoramaOptions = {
						position: nearStreetViewLocation,
						panControl: false,
						zoomControl: false,
						addressControl: false,
						fullscreenControl: false,
						enableCloseButton: false,
						pov: {
							heading: 10,
							pitch: -10
						}
					};
					let panorama = new google.maps.StreetViewPanorama(
						document.getElementById('pano'), panoramaOptions);
				} else {
					largeInfowindow.setContent('<div>' + marker.title + '</div>' +
						'<div>No Street View Found</div>');
				}
			}
			google.maps.event.addListener(largeInfowindow, 'domready', function(){
				if(!!document.getElementById('getDirection')){
					document.getElementById('getDirection').onclick=()=>{displayDirection(marker)}
				}			
			})   
			streetViewService.getPanorama({location: marker.position, preference: google.maps.StreetViewPreference.NEAREST, source: google.maps.StreetViewSource.OUTDOOR, radius: radius}, getStreetView);         		    		
			toggleInfoWindow(largeInfowindow, marker)
		})   		  	
	})	
	google.maps.event.addListener(largeInfowindow, 'domready', function() {
		let iwOuter = $('.gm-style-iw');
		let iwBackground = iwOuter.prev();
		iwBackground.children(':nth-child(2)').css({'display' : 'none'});
		iwBackground.children(':nth-child(4)').css({'display' : 'none'});
		let iwCloseBtn = iwOuter.next();
		iwCloseBtn.css({
			opacity: '1', 
			right: '8px', top: '-13px', 
			border: '12px solid #F78888', 
			'border-radius': '50%', 
			'box-shadow': '0 0 5px #777777' 
		});
		iwCloseBtn.mouseout(function(){
			$(this).css({opacity: '1'});
		});    	
	});		     
}

export const searchWithinTime = (myloc, newloc, modeval, maxduration)=>{
	state.mode = modeval
	state.duration = maxduration
	let distanceMatrixService = new google.maps.DistanceMatrixService;
	let address = myloc

		if (markers.length>0) {
			markers.map((marker)=>{
				marker.setMap(null);
			})
		}
		if(directionsDisplay!==''){directionsDisplay.setMap(null)}	
		let origins = newloc.map((loc)=>{
			let lat= loc.coordinates.latitude
			let lng= loc.coordinates.longitude
			return {lat, lng}})
		distanceMatrixService.getDistanceMatrix({
			origins: origins,
			destinations: [address],
			travelMode: google.maps.TravelMode[modeval],
			unitSystem: google.maps.UnitSystem.IMPERIAL,
		}, function(response, status) {
			if (status !== 'OK') {
				// window.alert('Error was: ' + status);
			} else {
				response.rows.map((restaurant, index)=>{
					let element = restaurant.elements[0]
					if(element.status==='OK'){
						if(element.duration.value/60 <= maxduration) {
							markers[index].setMap(map)
						}
					}
				})
			}
		});		
		
	}

	export const displayDirection=(e)=>{

		if (!state.currentLocation) {
			alert('Please enter your current location')
		} else {
			if (markers.length>0) {
				markers.map((marker)=>{
					if(marker.id!==e.id){marker.setMap(null);}					
				})	
			}
			let directionsService = new google.maps.DirectionsService;			
			let destinationAddress = e.position;
			directionsService.route({
				origin: destinationAddress,
				destination: state.currentLocation,
				travelMode: google.maps.TravelMode[state.mode]
			}, function(response, status){
				if (status === 'OK') {
					directionsDisplay = new google.maps.DirectionsRenderer({
						map: map,
						directions: response,
						draggable: true,
						polylineOptions: {
							strokeColor: 'orange'
						}
					});
					directionsDisplay.setOptions( { suppressMarkers: true } )
				} else {
					window.alert('Directions request failed due to ' + status);
				}
			})
		}
	}