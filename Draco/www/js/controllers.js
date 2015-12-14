angular.module('starter.controllers', [])


.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, $ionicHistory, Chats) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };


  //Initiating the ActiveMQ server connection
  $scope.initiate = function() {
    var url = "ws://localhost:61614";
    var username = "admin";
    var passcode = "password";
    var destination = "/topic/chat.thuan";

    client = Stomp.client(url);
    var headers = {
      login: 'mylogin',
      passcode: 'mypasscode',
      // additional header
      'client-id': 'thuan'
    };

    var headersq = {
      'activemq.subscriptionName': 'thuan'
    };


    function constructSessionID(id) {
      return id.replace(/:|-/g, '');
    }


    client.connect(destination, function(frame) {
    var path = constructSessionID(frame.headers.session + "");
     
    client.subscribe('/topic/chat.*', function(message) {
    console.debug(message);
    var msgID = constructSessionID(message.headers["message-id"] + "");
        
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*        if(producers.indexOf($rootScope.userName) == -1){
           producers.push($rootScope.userName);
                
            if($rootScope.userName !=path)  { 
                var newEntry = [{
                    name: $rootScope.userName,
                    lastText: 'new one',
                    face: 'img/max.png',
                     ddestination:message.headers["destination"]
                    }];
                       
                    $scope.chats = $scope.chats.concat(newEntry);
                    console.log($rootScope.userName + '   *************************** '+$scope.chats.length);
                    }
            }*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        if (msgID.indexOf(path) > -1) {
              
            var reply = message.body + ('<p> <font size="1" color="black">' + new Date().toLocaleString() + '</font></p>');
              
          $('<div class="msg_b"> <div class="profile-pic-right"><img src="https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"></div> <p style="color:black;">' + reply + '</p> </div>').insertBefore('.enter-msg');

        } else {
            
             var reply = message.body + ('<p> <font size="1" color="white">' +  new Date().toLocaleString() + '</font></p>');
            
           $('<div class="msg_a"> <div class="profile-pic-left"> <img  src="https://s.yimg.com/wv/images/a9696dca20fc0835ff82d7e0c7fc3a91_96.png"></div> <p style="color:white;">' + reply + '</p> </div>').insertBefore('.enter-msg');
        }
      }, headersq);
    });
    console.log("successfully initiated");
}
//end of initiation


  
  $scope.sendMessage = function() {

    var text = $('#user_input').val();

    if (text != '') {
      client.send('/topic/chat.thuan', {}, text); //destination

      $('#user_input').val("");
    }
    // the client is notified when it is connected to the server.
      
   /* var fh = fopen("C:\\Users\\tsshiek\\Downloads\\AI_Bot\\data.txt", 3); // Open the file for writing
      if(fh!=-1) // If the file has been successfully opened
      {
        var str = text;
        fwrite(fh, str); // Write the string to a file
        fclose(fh); // Close the file 
      }*/
      
    console.log("message submitted");
}
  
  
 
  //Disconnecting the ActiveMQ server connection
  $scope.disconnect = function() {
    var exit = 'DIRROUTETOBOT';
    client.send('/topic/chat.thuan', {}, exit);


    client.disconnect(function() {
      console.log("connection disconnected!");

      $ionicHistory.goBack();
    })
  }
})




.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
