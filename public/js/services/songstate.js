angular.module('groovly.songstate').factory("SongState", ['$http',
 function ($http) {
   var currentTab = 'me';
   var mySongs = [];
   var friendSongs = [];
   var globalSongs = [];
   var history = [];
   var currentHistoryIndex = 0;
   var currentSong;
   var currentID;
   var lastAction = 'next';
   var reachedEndOfStream = false;
   
   //Song State Methods
   var getCurrentSong = function() {
     return currentSong;
   };
   var setCurrentSong = function(s) {
     console.log('SETTING the current song to : '+ s);
     currentSong = s;
     currentID = s._id.substring(s._id.indexOf("v=")+2); //currentID is set directly in set current share
   };
   
   var updateMySongs = function(sh) {
     console.log('SETTING the shares state:');
     mySongs = sh;
     console.log(mySongs);
   };
   
   var getSongsLength = function(tab) {
     if(tab == 'me')
       return mySongs.length;
     else if(tab == 'friends')
       return friendSongs.length;
     else if(tab == 'global')
       return globalSongs.length;     
   };
   
   var getSongs = function(tab) {
     if(tab == 'me')
       return mySongs;
     else if(tab == 'friends')
       return friendSongs;
     else if(tab == 'global')
       return globalSongs;     
   };  
   
   var getSongAtIndex = function(tab, i) {
     if(tab == 'me')
       return mySongs[i];
     else if(tab == 'friends')
       return friendSongs[i];
     else if(tab == 'global')
       return globalSongs[i];     
   };
   
   var isHistoryEmpty = function() {
     if (history == [] || history == null || history == undefined || history == "")
       return true;
     else
       return false;
   };
   
   var initializeHistory = function() {
     history = [];
   };
   
   var pushToHistory = function(s) {
     console.log('pushing this to the history'+ s.st);
     history.push(s);
   };
   
   var getCurrentHistoryIndex = function() {
     return currentHistoryIndex;
   };
   
   var setCurrentHistoryIndex = function(i) {
     currentHistoryIndex = i;
   };
   
   var getHistory = function() {
     return history;
   };
   
   var getHistoryLength = function() {
     return history.length;
   };
   
   var setCurrentHistoryIndexToIndexOfThisSong = function(s) {
     currentHistoryIndex = history.indexOf(s);
   };
   
   var songExistsInHistory = function() {
     if(history.indexOf(currentSong) == -1) //song doesn't exist in history
     {
       console.log('this song does not exist in history: '+ currentSong.st);
     	return false;
     }
     else
     {
       console.log('this song ALREADY EXISTS in history: '+ currentSong.st);
     	return true;
     }
   };
   
   var atEndOfHistory = function() {
     if(currentHistoryIndex == history.length-1)
     {
       console.log('at the end of the history');
     	return true;
     }
     else
     {
       	console.log('NOT AT HISTORY END!');
     	return false;
     }
   };
   
   var getCurrentID = function() {
     return currentID;
   };
   
   var incrementListenCount = function() {
     currentSong.listenCount += 1;
     $http({method: 'PUT', url: '/lc/' + currentID + '/yt/' + currentSong.listenCount}).
       success(function(data, status) {
         if(status == 200)
           console.log('this is the successful data: '+ data);
         else
           console.log('this is the non-200 data: ' + data);
       }).
       error(function(data, status) {
         //console.log('ERROR!!!!!! this is the status: ' + status + ' and this is the data: ' + data);
     });
   };
   
   //method to update the auto error count for a video
   var updateAEC = function() {
     currentSong.aeCount += 1;
     $http({method: 'PUT', url: '/aec/' + currentID + '/yt/' + currentSong.aeCount}).
       success(function(data, status) {
         if(status == 200)
           console.log('this is the successful data: '+ data);
         else
           console.log('this is the non-200 data: ' + data);
       }).
       error(function(data, status) {
         //console.log('ERROR!!!!!! this is the status: ' + status + ' and this is the data: ' + data);
     });
   };
   
   var setLastActionAsNext = function() {
   		lastAction = 'next'; 
   };
   
   var setLastActionAsPrevious = function() {
   		lastAction = 'previous'; 
   };
   
   var getLastAction = function() {
     	return lastAction;
   };
   
   var reachedEndOfStream = function(state) {
   		reachedEndOfStream = state;
   };   
    
   return {
     getCS: getCurrentSong,
     setCS: setCurrentSong,
     updateMySongs: updateMySongs,
     getSongsLength : getSongsLength,
     getSongs : getSongs,
     getSongAtIndex : getSongAtIndex,
     isHistoryEmpty : isHistoryEmpty,
     initializeHistory : initializeHistory,
     pushToHistory : pushToHistory,
     getCurrentHistoryIndex : getCurrentHistoryIndex,
     setCurrentHistoryIndex : setCurrentHistoryIndex,
     getHistory : getHistory,
     getHistoryLength : getHistoryLength,
     setCurrentHistoryIndexToIndexOfThisSong : setCurrentHistoryIndexToIndexOfThisSong,
     songExistsInHistory : songExistsInHistory,
     atEndOfHistory : atEndOfHistory,
     getCurrentID : getCurrentID,
     incrementListenCount : incrementListenCount,
     updateAEC : updateAEC,
     setLastActionAsNext : setLastActionAsNext,
     setLastActionAsPrevious : setLastActionAsPrevious,
     getLastAction : getLastAction,
     reachedEndOfStream	: reachedEndOfStream     
   }
}]);