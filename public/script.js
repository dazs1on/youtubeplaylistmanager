var app = angular.module('myApp', ['ngRoute', 'ngResource']);


app.controller('MainCtrl', function($scope, $location) {
  $scope.name = 'World';
 
  $scope.myusers=[{username:'1',password:'12345'},
                  {username:'2',password:'12345'}];

  $scope.submit=function()
  {
    for(var i = 0; i < $scope.myusers.length; i++)
    {
      if(($scope.username == $scope.myusers[i].username) && ($scope.password == $scope.myusers[i].password)){
        correctlogin = true;
        $location.path("/success");
      }
      else if(($scope.username != $scope.myusers[i].username) || ($scope.password != $scope.myusers[i].password)){
       correctlogin = false;
       alert("Invalid Username or Password. If you do not have an account, please create one.");
     }
    }
   }
});

app.controller('PlaylistController', function($scope){
  $scope.currentplaylist = [
      { video: 'https://www.youtube.com/watch?v=CRoeRt54IWM' }
  ];


  $scope.addVideo = function(){
    $scope.currentplaylist.push(
        { video : $scope.currentplaylist.newVideo,
        });
    };
});

app.config(['$routeProvider',
  function ($routeProvider){
  $routeProvider
       .when('/view1', {
          templateUrl: 'views/view1.html',
          controller: 'MainCtrl',
        })
      .when('/userlist',{
          templateUrl: 'views/usertable.html',
          controller: 'MainCtrl',
        })
      .when('/success',{
          templateUrl: 'views/view2.html',
          controller: 'MainCtrl',
      })
      .when('/createLogin',{
          templateUrl: 'views/createlogin.html',
          controller: 'MainCtrl',
      })
      .otherwise({ 
        redirectTo: '/view1' 
      });
}]);


google.setOnLoadCallback(function () {
  
function loadVideo(video) {
 
  $('#videos h3').text(video.title);
 
  $('#youtubeVideo').html([
  '<iframe title="', video.title, '" width="560" height="349" src="', video.href, '" frameborder="0" allowfullscreen></iframe>'
  ].join(""));
  return false;
}

var playlistID;
var feedUrl = "http://gdata.youtube.com/feeds/api/playlists/PL0DFDCE143D23E014?max-results=50";
new google.feeds.lookupFeed(feedUrl, function (result) {
  if (result.error || !result.url) {
  $('#videocomm').hide();
  return;
}
// get the feed items
var feed = new google.feeds.Feed(result.url);
feed.setNumEntries(50);


feed.load(function (result) {
    
    var container = $(".youtubeFeed");

    for (var i = 0; i < result.feed.entries.length; i++) {
      var entry = result.feed.entries[i];
      var vidhash = /=(.*)&(.*)$/.exec (entry.link)[1];

      container.append('<li><div><a href="http://www.youtube.com/embed/'+vidhash+'" class="yt-vid-link" title="'+entry.title+'"><img src="http://img.youtube.com/vi/'+vidhash+'/2.jpg" /><br />'+entry.title+'</a></div></li>\n');
    }

    $(".yt-vid-link:first").each(function () {
      loadVideo(this);
      return false;
    });
   
    $(".yt-vid-link").click(function () {
      loadVideo(this);
      return false;
    });
  });

});

});

google.load("feeds", "1");