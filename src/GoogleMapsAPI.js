/* global google */
import './GoogleMapsAPI.scss'
import * as YelpAPI from './YelpAPI'
import $ from 'jquery'

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
    		phone: restaurant.phone
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
	          if (status == 'OK') {
	            let nearStreetViewLocation = data.location.latLng;
	            largeInfowindow.setContent('<div id="infoWindow"><img id="photo" src="'+
	            	marker.image+'"><div id="title">'+ 
		    		marker.title + '</div><div id="rating"><span>'+ marker.rating+ 
		    		' Stars </span><img id="ratingstars" src="'+YelpAPI.stars(marker.rating)+
		    		'"></div><div id="info"><h3>Address</h3>'+marker.address+
		    		'<h3>Phone</h3>'+marker.phone+
		    		'</div><h3>Reviews</h3><div id="reviews"></div><h3>Street View</h3><div id="pano"></div></div>') 
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