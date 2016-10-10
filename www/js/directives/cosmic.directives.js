angular.module('cosmic.directives').directive('playlistBar',function($ionicScrollDelegate,$timeout,cosmicConfig){
    return {
        restrict: 'E',
        templateUrl: 'templates/playlistBar.html',
        scope: {},
        controller : function($scope,$ionicScrollDelegate,cosmicPlayer){
            $scope.miniaturesPath = cosmicConfig.appRootStorage + 'miniatures/';
            $scope.player = cosmicPlayer;
            var scrollToCurrentTitle=function(){
                var delegate = $ionicScrollDelegate.$getByHandle('playlistBarScroll');
                delegate.scrollTo($scope.player.playlistIndex * 100,0,true);
            };
            $timeout(function(){
                $scope.$watch('player.playlistIndex',scrollToCurrentTitle);
                scrollToCurrentTitle();
            }, 700);
        }
    };

});

angular.module('cosmic.directives').directive('playBar',function($state,$ionicViewSwitcher,cosmicConfig,cosmicPlayer,cosmicDB){
    return {
        restrict: 'E',
        templateUrl: 'templates/playBar.html',
        scope: {
        },
        controller : function($scope){
            $scope.player = cosmicPlayer;
            $scope.miniaturesPath = cosmicConfig.appRootStorage + 'miniatures/';
            $scope.openPlayer=function(){
                if (cosmicPlayer.media){
                    $ionicViewSwitcher.nextDirection('forward');
                    $state.go('player');
                }
            };
        }
    };

});

angular.module('cosmic.directives').directive('artworkMosaic',function($state,cosmicConfig){
    return {
        restrict: 'A',
        templateUrl: 'templates/artwork-mosaic.html',
        scope: {
            title : "@",
            songs : "="
        },
        controller : function($scope){
            $scope.miniaturesPath = cosmicConfig.appRootStorage + 'miniatures/';
        }
    };

});


angular.module('cosmic.directives').directive('playSquare',function($state,cosmicPlayer,cosmicConfig){
    return {
        restrict: 'E',
        templateUrl: 'templates/play-square.html',
        replace : true,
        scope: {
        },
        controller : function($scope,cosmicPlayer,$ionicGesture,cosmicConfig){

            $scope.artworksPath = cosmicConfig.appRootStorage + 'artworks/';
            var artworkElement = angular.element(document.getElementById("player-box"));
           // var windowWidth    = artworkElement[0].clientWidth;
           var windowWidth    = 300;
            $scope.seeking = false;

            // Update position
            var onUpdate = function(position){
                $scope.position=position;
                if ($scope.duration>0){
                    $scope.progress = ($scope.position / $scope.duration);
                        $scope.rangeprogress = $scope.progress * 100  ;
                        $scope.rangeposition=Math.floor(position / 1000);
                    //alert("onUpdate $scope.progress = "+ $scope.progress)
                } else {
                    $scope.progress=0;
                        $scope.rangeprogress = 0  ;
                         $scope.rangeposition=position;
                }
            };

            // Update scope on new title
            var onNewTitle = function(){
                $scope.player=cosmicPlayer;
                $scope.position=0;
                $scope.progress =0;
                
                cosmicPlayer.getDuration().then(function(duration){
                    alert("getDuration="+duration)
                    $scope.duration=duration;
                    $scope.durationMax = Math.floor(duration / 1000);

                });
            };

            onNewTitle();
            cosmicPlayer.setOnUpdate(onUpdate);
            cosmicPlayer.setOnTitleChange(onNewTitle);


            $scope.stateChanged = function () {
                            //if ($scope.seeking){
                                //$scope.seeking = false;

                                // $scope.progressUpdate = $scope.progress / 100;

                                $scope.progress1 = ($scope.position / $scope.duration);
                               // alert("stateChanged  $scope.progress1="+$scope.progress1)

                                cosmicPlayer.seek($scope.progress1);
                                     //alert("stateChanged progressUpdate="+$scope.progressUpdate)
                                if (cosmicPlayer.playing){
                                    cosmicPlayer.startWatchTime();
                                    cosmicPlayer.media.play();
                                }
                           // }
             };
            $ionicGesture.on('dragleft dragright', function (event) {
                if (! $scope.seeking ){
                    $scope.seeking = true;
                    if (cosmicPlayer.playing){
                        cosmicPlayer.stopWatchTime();
                        cosmicPlayer.media.pause();
                    }
                }
                $scope.$apply(function(){
                    $scope.progress = event.gesture.center.pageX / windowWidth;
                        alert("dragleft dragright $scope.progress= "+$scope.progress)
                    $scope.position = $scope.progress * $scope.duration;

                });
            }, artworkElement);

            $ionicGesture.on('dragend', function () {
                console.log('dragEND');
                if ($scope.seeking){
                    $scope.seeking = false;
                    cosmicPlayer.seek($scope.progress);
                    alert("dragEnd progress="+$scope.progress)
                    if (cosmicPlayer.playing){
                        cosmicPlayer.startWatchTime();
                        cosmicPlayer.media.play();
                    }
                }
            }, artworkElement);

        } // end controller
    }; // end return

});


//angular.module('cosmic.directives').directive('dragAnimation',  function ($ionicGesture) {
    //return {
        //restrict: 'A',
        //link: function (scope, element) {
            //$ionicGesture.on('drag', function (event) {
                //element.css({ "-webkit-transform": "translate(" + event.gesture.deltaX + "px, " + event.gesture.deltaY + "px)" });
            //}, element);

            //$ionicGesture.on('dragend', function() {
                //element.css({ "-webkit-transform": "translate(0)" });
            //}, element);
        //}
    //};
//});
