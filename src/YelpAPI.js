import $ from 'jquery'

const token = 'Bearer uFxKyDnUWdPEZkWgzk-e3DIAbLGwfSBoXxw6EoHJab7YdXXA53fekY4fAo-_PIb2r8Hn3Cal79YoHIhbcc2ilvxAkiWSAjPr6VjCAVVq0hcdlSWsu4aPolsa0l-pW3Yx'
const cors_anywhere_url = 'https://cors-anywhere.herokuapp.com'
const yelp_search_url = 'http://api.yelp.com/v3/businesses/search'
const yelp_business_id = 'https://api.yelp.com/v3/businesses/'
const requestObj = {
	'url': cors_anywhere_url+'/'+yelp_search_url,
	'data': {term:'restaurants', location:'charlottesville, va', sort_by: 'rating', limit: 20},
	headers: {'Authorization':token},
	error: function(jqXHR, textStatus, errorThrown){
		console.log('AJAX error, jqXHR = ', jqXHR, ', textStatus = ',
			textStatus, ', errorThrown = ', errorThrown)
	}
}

// function requestDetails(id){
// 	let Obj = {
// 		'url': yelp_business_id + id,
// 		headers: {'Authorization':token},
// 		error: function(jqXHR, textStatus, errorThrown){
// 			console.log('AJAX error, jqXHR = ', jqXHR, ', textStatus = ',
// 				textStatus, ', errorThrown = ', errorThrown)
// 		}
// 	}	
// 	return Obj;
// }

export const get = ()=>{
	return $.ajax(requestObj) 	
}

// export const getDetails = (id)=>{
// 	let Obj = requestDetails(id)
// 	return $.ajax(Obj)
// }