angular.module('starter.controllers', [])


.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, $ionicHistory, Chats) {
    
  var destination = '';
  //var client;
  
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
    //var url = "ws://localhost:61614";
    var url = "ws://localhost:61614";
    var username = "admin";
    var passcode = "password";

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
  
      
    client.connect(headers, function(frame) {
    
    /*var producers = ["thuan"];*/   
    var path = constructSessionID(frame.headers.session + "");
     
    client.subscribe("/topic/chat.*", function(message) {
    var sendID = message.headers.destination;
        destination = destination + sendID;
        console.log("------------------------------" + destination);
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&" + sendID);
        
    console.debug(message);
    var msgID = constructSessionID(message.headers["message-id"] + "");
        
/************************************************************************************************************************************************/
/*          ``  var producerID = message.headers['message-id'];
            producerID = producerID.split(":-");
            producerID = producerID[0];
            producerID = constructSessionID(producerID);
            
        
            if(producers.indexOf(producerID) == -1){
                producers.push(producerID);
                
                var newEntry = [{
                        name: producerID,
                        lastText: 'new one',
                        face: 'img/max.png'
                        }];
                var finalObj = $scope.chats.concat(newEntry);
                $scope.chats = finalObj;
                console.log(producerID+ '   *************************** '+$scope.chats.length);
            }*/
  /************************************************************************************************************************************************/

        

        if (msgID.indexOf(path) > -1) {
              
            var reply = message.body + ('<p> <font size="1" color="black">' + new Date().toLocaleString() + '</font></p>');
            var des = message.headers["message-id"];
            
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
      client.send(destination, {}, text); //destination
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^" + destination);
        
      $('#user_input').val("");
    }
    // the client is notified when it is connected to the server.

    console.log("message submitted");
}
  
 
//Disconnecting the ActiveMQ server connection  
    $scope.disconnect = function() {
        var exit = 'DIRROUTETOBOT';
        client.send(destination, {}, exit);
        
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
