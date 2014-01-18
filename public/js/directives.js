var groovly = angular.module('groovly.directives', [] );

//main method that loads the current song based on player controls or direct selection of the song
function setShare(currentShare, SongState) {
  SongState.setCS(currentShare);
  if(SongState.isHistoryEmpty())
  {
    mixpanel.track("started play history");
    SongState.initializeHistory();    
    SongState.pushToHistory(currentShare);
    SongState.setCurrentHistoryIndex(SongState.getHistoryLength() - 1);
    console.log('BLANK: this is the current history length: ' + SongState.getHistoryLength());
    console.log('BLANK: this is the current history index: '+ SongState.getCurrentHistoryIndex());
  }
  else
  { 
    if(!SongState.songExistsInHistory()) //if song doesn't exist in history
    {
      SongState.pushToHistory(currentShare);      
      
    }
    SongState.setCurrentHistoryIndexToIndexOfThisSong(currentShare);
    
    console.log('NOT BLANK: this is the current history length: ' + SongState.getHistoryLength());
    console.log('NOT BLANK: this is the current history index: '+ SongState.getCurrentHistoryIndex());
    console.log('and this is the history so far: ');
    console.log(SongState.getHistory());
  }
  loadVideoById(SongState.getCurrentID());
}

//Change the class of the selected song in the list with the highlighted CSS and remove the non-selected song's CSS
function selectShareInList(el) 
{
  angular.element(document.querySelector('.selected')).removeClass("selected");
  el.addClass("selected");
}

function startPlayer() 
{
  var nextBtn = angular.element(document.querySelector('.glyphicon-step-forward'));
  nextBtn.click();
}

groovly.directive( 'shareSelected', function () {
  return {
    require: 'shareSelected',
    controller: function($scope) {
          this.selectShare = function(element) {
            selectShareInList(element);
          };          
        },
    restrict : 'C',
    link: function(scope, element, attrs, selector) {
      element.bind("click" , function(e){
        selector.selectShare(element);
      });     
    }
  };
});

groovly.directive('shareobject', ['SongState', function(SongState) {
	return {
		require: 'shareobject',
		restrict: "E",
		replace: true,
		template: "<a ng-click='setCurrentShare();' class='thumbnail shareBrowserItem {{shareSelected}}'>" + 
				  "<img data-src='holder.js/120x150' src={{'http://img.youtube.com/vi/'+share._id.substring(share._id.indexOf(\'v=\')+2)+'/2.jpg'}} alt='' />" +
          "<center><p>{{share.sa}} - {{share.st}}</p></center>" +
				  "<p align='right' class='shareSource'>via {{share.using}}</p></a>",
		controller: function($scope) {
         this.setCurrentShare = function(currentShare) {
           setShare(currentShare, SongState);
      	   SongState.incrementListenCount();
        };
		  },
		  link: function(scope, element, attrs, controller) {
        element.bind("click" , function(e){
          controller.setCurrentShare(scope.share);          
        });  
		  }
	};
}]);

groovly.directive('playercontrols',['SongState', function(SongState) {
	return {
   require: "playercontrols",
	 restrict : 'E',
	 replace: true,
	 template : "<ul class='nav navbar-nav' data-ng-show='global.authenticated'><li id='previousButton' title='Previous' class='vidControls'><a ng-click='previousSong();'><i class='glyphicon glyphicon-step-backward'></i></a></li>" +
				"<li id='playButton' title='Play' class='vidControls'><a onClick='playpauseVideo();'><i class='glyphicon glyphicon-play'></a></i></li>" +
				"<li id='nextButton' title='Next'><a ng-click='nextSong();'><i class='glyphicon glyphicon-step-forward' class='vidControls'></a></i></li>" +
				"<li><a><div id='progContainer' class='progress'>" +
				"  <div id='progBar' class='progress-bar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width: 0%;'></div>" +
        "</div></a></li><li><img class='navbar-header' id='songLoader' style='visibility:hidden; padding: 18px 0px 0px 0px;' src='img/loaders/circle.gif' width='16px'></li></ul>",
   controller: function($scope) {     
      this.selectNewRandomSongAndPush = function() {//scope) {
          
      	  var randomChoice = Math.floor(Math.random()*SongState.getSongsLength('me') - 1);
          var adjustedListPosition = randomChoice + 2;
          console.log('inside new random song and push method');
        
      	  while(_.contains(SongState.getHistory(), SongState.getSongAtIndex('me',randomChoice)) && SongState.getHistoryLength() <= SongState.getSongsLength('me'))
          {
      		randomChoice = Math.floor(Math.random()*SongState.getSongsLength('me') - 1);
          }
          
          if(!_.contains(SongState.getHistory(), SongState.getSongAtIndex('me',randomChoice)))
          {
            this.selectShareFromControls(SongState.getSongAtIndex('me',randomChoice),SongState.getSongs('me'));
          }          
        };
     
        this.nextSong = function() {
          SongState.reachedEndOfStream(false);
          SongState.setLastActionAsNext();
          
          if(SongState.isHistoryEmpty())
          {
            SongState.reachedEndOfStream(false);
          }
          else
          {
            if(SongState.getHistoryLength() < SongState.getSongsLength('me')-1)
              SongState.reachedEndOfStream(false);
            else
              SongState.reachedEndOfStream(true);
          }
          
  		  if(SongState.isHistoryEmpty())// not played anything yet in random mode
          {
            console.log("nothing in here so pushing the first random choice i got");
         
            SongState.initializeHistory();
            this.selectNewRandomSongAndPush();
          }
          else // if tracks have already been played in random mode then check if link exists in linklist
          {
            if(SongState.atEndOfHistory())//it is at the end of the random linklist, then add the next choice
            {
              console.log("at the end of linklist getting new random choice");
              this.selectNewRandomSongAndPush();
            }			
            else //if not at the end of the linklist then just move to the next one
            {
              mixpanel.track("next song in history");
              SongState.setCurrentHistoryIndex(SongState.getCurrentHistoryIndex() + 1);
              this.selectShareFromControls(SongState.getHistory()[SongState.getCurrentHistoryIndex()],SongState.getSongs('me'));
            }		
          }
        };
     
        this.previousSong = function() {
          SongState.reachedEndOfStream(false);
          SongState.setLastActionAsPrevious();
          if(SongState.getCurrentHistoryIndex() > 0)
          {
            SongState.setCurrentHistoryIndex(SongState.getCurrentHistoryIndex() - 1);   

            if(SongState.isHistoryEmpty())
            {
              SongState.reachedEndOfStream(false);
            }
            else
            {
              if(SongState.getHistoryLength() < SongState.getSongsLength('me')-1)
                SongState.reachedEndOfStream(false);
              else
                SongState.reachedEndOfStream(true);
            }
       
            if(SongState.getCurrentHistoryIndex() >= 0)
            {
              console.log('history hasnt reached beginning');
              this.selectShareFromControls(SongState.getHistory()[SongState.getCurrentHistoryIndex()],SongState.getSongs('me'));
            }
          }          
          mixpanel.track("click previous song");
        };
     
        this.selectShareFromControls = function(share, shares) {
            var chosenIndex = shares.indexOf(share) + 2;
            angular.element(document.querySelector('ul li.shareBrowserItem:nth-child('+chosenIndex+') a')).click();
        };   
        
      },
	 link: function(scope, element, attrs, player) {
	   element.bind("click" , function(e){
       if(e.target.className == 'glyphicon glyphicon-step-forward') // next button clicked
       {
         player.nextSong();
       }
       else if(e.target.className == 'glyphicon glyphicon-step-backward') // next button clicked
       {
         player.previousSong();
       }
	   });  
	 }
	};
}]);