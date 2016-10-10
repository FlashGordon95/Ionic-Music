// Player
angular.module('cosmic.controllers').controller('PlayerCtrl', function(AppConfig,$scope,cosmicPlayer,$ionicHistory,$cordovaStatusbar,$ionicGesture,$ionicViewSwitcher,cosmicConfig) {

         // $cordovaStatusbar.hide();
     $scope.$on('$ionicView.afterEnter', function() {
        if(window.StatusBar){
            // $cordovaStatusbar.overlaysWebView(false);
            console.log("1 cordovaStatusbar.styleHex ="+ AppConfig.StatusbarColor2);
            $cordovaStatusbar.styleHex(AppConfig.StatusbarColor2);
        }
    });
    $scope.ChangeColor = function(){
        if(window.StatusBar){
            // $cordovaStatusbar.overlaysWebView(false);
            console.log("cordovaStatusbar.styleHex ="+AppConfig.StatusbarColor1);
            $cordovaStatusbar.styleHex(AppConfig.StatusbarColor1);
        }       
    }


    $scope.player=cosmicPlayer;
    console.log("start 1");
//  insert from directive
    $scope.artworksPath = cosmicConfig.appRootStorage + 'artworks/';
    console.log("artworksPath = "+cosmicConfig.appRootStorage + 'artworks/');
            var artworkElement = angular.element(document.getElementById("player-box"));
           // var windowWidth    = artworkElement[0].clientWidth;
           var windowWidth    = 300;
            $scope.seeking = false;
console.log("start2");
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
                    //alert("getDuration="+duration)
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
             console.log("start 3");
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
                       // alert("dragleft dragright $scope.progress= "+$scope.progress)
                    $scope.position = $scope.progress * $scope.duration;

                });
            }, artworkElement);

            $ionicGesture.on('dragend', function () {
                console.log('dragEND');
                if ($scope.seeking){
                    $scope.seeking = false;
                    cosmicPlayer.seek($scope.progress);
                   // alert("dragEnd progress="+$scope.progress)
                    if (cosmicPlayer.playing){
                        cosmicPlayer.startWatchTime();
                        cosmicPlayer.media.play();
                    }
                }
            }, artworkElement);







    // Swipe down to go back
    var playerContainer=angular.element(document.getElementById('player'));
    $ionicGesture.on('swipedown',function(e){
        $ionicViewSwitcher.nextDirection('back');
        $ionicHistory.goBack(-1);
    }, playerContainer);
    console.log($scope.player.loop);
});


