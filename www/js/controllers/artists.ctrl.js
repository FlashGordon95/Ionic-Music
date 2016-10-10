// Artists
angular.module('cosmic.controllers').controller('ArtistsCtrl', function($scope,$q, cosmicDB,cosmicConfig) {
console.log("0 controllers ");
    $scope.miniaturesPath = cosmicConfig.appRootStorage + 'miniatures/';
    // Get artists
    console.log("1 start ArtistsCtrl ");
    $scope.$on('$ionicView.afterEnter', function() {
            cosmicDB.getArtists().then(function(artists){
                   console.log("3 calling getArtists ");
                   console.log("Show objects>"+artists);
                $scope.artists=artists;
            });
        console.log('AFTER ENTER FIRED');
    });
   

    $scope.refreshArtists = function() {
        console.log("start refreshArtists");
        cosmicDB.getArtists().then(function(artists){
            console.log("4 end");
            $scope.artists=artists;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
});

