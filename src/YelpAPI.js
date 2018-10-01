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