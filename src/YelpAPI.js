import $ from 'jquery'

const token = 'Bearer uFxKyDnUWdPEZkWgzk-e3DIAbLGwfSBoXxw6EoHJab7YdXXA53fekY4fAo-_PIb2r8Hn3Cal79YoHIhbcc2ilvxAkiWSAjPr6VjCAVVq0hcdlSWsu4aPolsa0l-pW3Yx'
const cors_anywhere_url = 'https://cors-anywhere.herokuapp.com'
const yelp_search_url = 'http://api.yelp.com/v3/businesses/search'
const yelp_business_id = 'https://api.yelp.com/v3/businesses/'
const requestObj = {
	'url': cors_anywhere_url+'/'+yelp_search_url,
	'data': {term:'restaurants', location:'charlottesville, va', sort_by: 'rating', limit: 10},
	headers: {'Authorization':token},
	error: function(jqXHR, textStatus, errorThrown){
		console.log('AJAX error, jqXHR = ', jqXHR, ', textStatus = ',
			textStatus, ', errorThrown = ', errorThrown)
	}
}

export const get = ()=>{
	return $.ajax(requestObj) 	
}

export const stars = (rating)=>{
	let url = ''
	switch(rating){
		case 5:
			url = "https://i.postimg.cc/Hscs5Xqb/small_5.png";
			break;
		case 4.5:
			url = "https://i.postimg.cc/RCbZNXDM/small_4_half.png";
			break;
		case 4:
			url = "https://i.postimg.cc/7hbPK2f8/small_4.png";
			break;	        		
		case 3.5:
			url = "https://i.postimg.cc/3xGNMm93/small_3_half.png";
			break;	        		
		case 3:
			url = "https://i.postimg.cc/L505SVr8/small_3.png";
			break;		        			        		
	}
	return url
} 