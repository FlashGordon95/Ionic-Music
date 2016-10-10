angular.module('cosmic.controllers', []);
angular.module('cosmic.directives', []);
angular.module('cosmic.services', []);

var myApp = angular.module('cosmic', ['ionic', 'ngCordova', 'cosmic.controllers', 'cosmic.services','cosmic.directives'])
 .constant("AppConfig", {
          "StatusbarColor1": "#3B5998",
          "StatusbarColor2": "#000000",
          "StatusbarColor3": "999999"
      })

.run(function(AppConfig,$ionicPlatform,$cordovaStatusbar,$localstorage,$animate,$state) {
	$animate.enabled(false);
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleLightContent();
		}
		if ($localstorage.get('showStatusBar','true') === 'false'){
			$cordovaStatusbar.hide();
		}
		 if(window.StatusBar){
		// $cordovaStatusbar.overlaysWebView(false);
			console.log("StatusbarColor1=" + AppConfig.StatusbarColor1);				
				$cordovaStatusbar.styleHex(AppConfig.StatusbarColor1);
			console.log("$cordovaStatusbar= yes");
         }
       	if (cordova.platformId == 'android') {
       		
				StatusBar.backgroundColorByHexString(AppConfig.StatusbarColor1);
			console.log("StatusBar.backgroundColorByHexString = yes");
		}
			





		ionic.Platform.setGrade('c'); // remove advanced css feature
		$ionicPlatform.registerBackButtonAction(function (event) {
			if ($state.current.name==='tab.playlists') {
				backAsHome.trigger(function(){
					console.log("Success: back as home");
				}, function(){
					console.log("Error: back as home");
				});
			} else {
				navigator.app.backHistory();
			}
		}, 100);
	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "templates/tabs.html",
	})

	.state('tab.playlists', {
		url: '/playlists',
		views: {
			'tab-playlists': {
				templateUrl: 'templates/playlists.html',
				controller: 'PlaylistsCtrl'
			}
		}
	})

	.state('tab.playlist-items', {
		url: '/playlists/user/:playlistId/:playlistName',
		views: {
			'tab-playlists': {
				templateUrl: 'templates/playlist-items.html',
				controller: 'PlaylistItemsCtrl'
			}
		}
	})

	.state('tab.playlist-special', {
		url: '/playlists/special/:playlistId/:playlistName',
		views: {
			'tab-playlists': {
				templateUrl: 'templates/playlist-items.html',
				controller: 'PlaylistSpecialCtrl'
			}
		}
	})

	.state('tab.artists', {
		url: '/artists',
		views: {
			'tab-artists': {
				templateUrl: 'templates/artists.html',
				controller: 'ArtistsCtrl'
			}
		}
	})

	.state('titles', {
		url: '/artists/:artistId/artwork/:artworkUrl',
		templateUrl: 'templates/titles.html',
		controller: 'TitlesCtrl'
	})	
	// .state('tab.titles', {
	// 	url: '/artists/:artistId/artwork/:artworkUrl',
	// 	views: {
	// 		'tab-artists': {
	// 			templateUrl: 'templates/titles.html',
	// 			controller: 'TitlesCtrl'
	// 		}
	// 	}
	// })
	// 	templateUrl: 'templates/titles.html',
	// 	controller: 'TitlesCtrl'

	// })
	.state('tab.songs', {
		url: '/songs',
		views: {
			'tab-songs': {
				templateUrl: 'templates/songs.html',
				controller: 'SongsCtrl'
			}
		}
	})
	.state('settings', {
	// 	url: '/settings',
	// 	views: {
	// 		'tab-settings': {
	// 			templateUrl: 'templates/settings.html',
	// 			controller: 'SettingsCtrl'
	// 		}
	// 	}
	// })
		url: '/settings',
		templateUrl: 'templates/settings.html',
		controller: 'SettingsCtrl'
	})


	.state('tab.manage-directories', {
		url: '/manage-directories',
		views: {
			'tab-folder': {
				templateUrl: 'templates/manage-directories.html',
				controller: 'ManageDirectoriesCtrl'
			}
		}
	})
	.state('tab.fav', {
		url: '/favorites',
		views: {
			'tab-fav': {
				templateUrl: 'templates/favorites.html',
				controller: 'FavoriteCtrl'
			}
		}
	})

	// .state('tab.search', {
	// 	url: '/search',
	// 	views: {
	// 		'tab-search': {
	// 			templateUrl: 'templates/search.html',
	// 			controller: 'SearchCtrl'
	// 		}
	// 	}
	// })
	.state('search', {
		url: '/search',
		templateUrl: 'templates/search.html',
		controller: 'SearchCtrl'
	})

	.state('player', {
		url: '/player',
		templateUrl: 'templates/player.html',
		controller: 'PlayerCtrl'
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/playlists');
	

})
.config(['$ionicConfigProvider', function($ionicConfigProvider) {
	//$ionicConfigProvider.scrolling.jsScrolling(false); // native scrolling
	$ionicConfigProvider.tabs.position('top'); // other values: top,bottom
	$ionicConfigProvider.tabs.style('standard');
	$ionicConfigProvider.spinner.icon('ios');
	$ionicConfigProvider.views.transition('ios');
	$ionicConfigProvider.views.swipeBackEnabled(true);
	$ionicConfigProvider.views.swipeBackHitWidth(60);
	ionic.Platform.isFullScreen = true;
}])

.factory("$fileFactory", function($q) {

    var File = function() { };

    File.prototype = {

        getParentDirectory: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function(fileSystem) {
                fileSystem.getParent(function(result) {
                    deferred.resolve(result);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getEntriesAtRoot: function() {
            var deferred = $q.defer();
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                var directoryReader = fileSystem.root.createReader();
                directoryReader.readEntries(function(entries) {
                    deferred.resolve(entries);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getEntries: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function(fileSystem) {
                var directoryReader = fileSystem.createReader();
                directoryReader.readEntries(function(entries) {
                    deferred.resolve(entries);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

    };

    return File;

});

function bootstrapAngular(){
	console.log('Bootstrap Angular App');
	var domElement = document.querySelector('body');
	angular.bootstrap(domElement, ['cosmic']);
}

if (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
	console.log("URL: Running in Cordova/PhoneGap");
	document.addEventListener("deviceready", bootstrapAngular, false);
} else {
	console.log("URL: Running in browser");
	document.addEventListener("DOMContentLoaded", bootstrapAngular, false);
}
