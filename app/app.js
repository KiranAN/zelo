var app = angular.module('app',[]);
app.controller('appCtrl',['$scope','flickrService',function($scope,flickrService){	
	var count = 1;
	$scope.search= function(page){		
		var params ={
         text: 'sachin',         
         jsoncallback: 'showPhotos',
         page: page
        }
		flickrService.search(params).then(function(data){
			eval(data);
		},function(err){

		});
	}
	
	$scope.photos =[];
	var getPhotos = function(photo){
		 return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
      '/' + photo.id + '_' + photo.secret + '_q.jpg';
	}

	function showPhotos(data){				
		var photo = {};
		var index =0 ;
		for(;index < data.photos.photo.length; index++){
			photo = data.photos.photo[index];
			photo.index = index+(100 * (count-1)) + 1;
			photo.src = getPhotos(photo);			
			getInfo(photo,index+(100 * (count-1)));
			$scope.photos.push(photo);			
		}
	}
	function getInfo(photo, index){
		var params = {
			photo_id:photo.id,
			secret:photo.secret,
			jsoncallback:'getResponse'
		};

		flickrService.getInfo(params).then(function(response){			
			var resp = eval(response);
			addInfo(resp, index);
		},function(err){

		})
	}

	var getResponse = function(response){
		return response;
	}

	var addInfo = function(response,index){		
	    var date = new Date(1000*response.photo.dates.posted);	    
		response.photo.dates.posted = date.toDateString();
		$scope.photos[index].info= response.photo;		
	}

	
	$(window).scroll(function(){
		if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
			count++;
			if(count<=20){
				$scope.search(count);	
			}			
	    }
	})
	$scope.search(1);
}]);

app.service('flickrService',['$http','$q',function($http,$q){
	var apiKey = 'd482a8036da4cb7b2c357bfa55196090';
   	var apiURL = 'https://api.flickr.com/services/rest/';	
	
	var search = function(params){
		var deferred = $q.defer();
		var params = extend(params, {
	        method: 'flickr.photos.getRecent',
	        api_key: apiKey,
	        format: 'json',
	        per_page:100,
	        page:params.page
		});

		$http({method:'GET',url:apiURL, params:params}).then(function(response){			
			deferred.resolve(response.data);
		}, function(err){
			console.log(err);
		});    

		return deferred.promise;
	}

	var getInfo = function(params){
		var deferred = $q.defer();
		var params = extend(params, {
	        method: 'flickr.photos.getInfo',
	        api_key: apiKey,
	        format: 'json',
		});		

		$http({method:'GET',url:apiURL, params:params}).then(function(response){			
			deferred.resolve(response.data);
		}, function(err){
			console.log(err);
		});    

		return deferred.promise;
	}

	function buildUrl(url, parameters){
		var queryString = '';

		for(var key in parameters) {
			if (parameters.hasOwnProperty(key)) {
				queryString += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
			}
		}

		if (queryString.lastIndexOf('&') === queryString.length - 1){
			queryString = queryString.substring(0, queryString.length - 1);
		}

		return url + '?' + queryString;
	}

	function extend(object) {
      for(var i = 1; i < arguments.length; i++) {
          for(var key in arguments[i]) {
             if (arguments[i].hasOwnProperty(key)) {
                object[key] = arguments[i][key];
             }
          }
      }

      return object;
    }
	return{
		search:search,
		getInfo:getInfo
	}
}])

function showPhotos(response){
	console.log(response);
}