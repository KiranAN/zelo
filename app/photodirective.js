angular.module('app')
.directive('photos',function(){

	return{
		scope:true,
		restrict:'E',
		templateUrl:'photos.temp.html',
		link:function(scope, elem, attrs){
			console.log(scope.photos);
			//scope.watch(scope.photos, function)
		}
	}
})