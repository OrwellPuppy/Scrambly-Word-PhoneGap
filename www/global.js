//*********************************************************************************************
//************************* INITIALIZE GLOBAL VARIABLES ***************************************
//*********************************************************************************************

//create frequency strings:
var c =["B","C","D","F","G","H","J","K","L","M",
        "N","P","Q","R","S","T","V","W","X","Y","Z"];
var cF=[ 15, 28, 43, 22, 20, 60,  2,  8, 40, 24,
         68, 19,  1, 60, 63, 91, 10, 24,  2, 20, 1];
var v =["A","E","I","O","U"];
var vF=[ 82,127, 70, 75, 28];
var consonants = "";
for(var i=0;i<cF.length;i++){
  for(var x=0;x<cF[i];x++){
    consonants+=c[i];
  }
}
var vowels = "";
for(var i=0;i<vF.length;i++){
  for(var x=0;x<vF[i];x++){
    vowels+=v[i];
  }
}
var alphabet = vowels+consonants;
//var cv="ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Creates the dictionary lookup object
var dict = {};

  // And add them as properties to the dictionary lookup
for (var i=0; i<words.length; i++) {
  dict[ words[i] ] = true;
}
dict[""]=false;


//some global jquery selectors and variables
var main = {}; //the broader pane
var pane = {}; //the pane where the game goes
var controlButtons={}; //the control buttons
var globalScore = 0; //global score keeper
var globalTime = 1; //global game time tracker
var globalRound = 1; //global round tracker
var globalRoundName = ""; //global round name
var wordCount = []; //keeps track of the size of each word used
for(var x=2;x<11;x++){wordCount[x]=0}


//core letter object definition
function Letter(letter,myClass,got){
  this.letter=letter;
  this.clickEvent={};//the event that is assigned on click
  this.spot=0;
  this.guessed=false;
  this.got=got; //boolean: true if this letter is already got. otherwise false
  this.image=$('<div class = "letter '+myClass+'">' +letter+'</div>');
  this.ID=0;//ID for determining what which letter object it is when clicked on
}


//***core game state object definition***
function gameState(gameTime, minWordLength, alphaBonusTime, lettBonusTime, needed, skill){
  var me=this;
  //game type parameters
  this.minWordLength=minWordLength;//determines the minimum word length needed to get a letter
  this.skill=skill;
  //jquery object references
  this.gotArea=$();//area with the letters that are needed to get to win
  this.clock=$();//the timer
  this.title1=$();//the game's exit button in game mode
  this.pBoard=$();//scoreboard element
  this.pLabel=$();//scoreboard label element
  this.enterLabel=$();//enter button that changes to clear button
  this.restartMenu=$();//restart menu
  this.correctArea=$();//the little area where the words and points you get are shown
  this.guessArea=$();//the area where the letters go when you are forming a word
  this.lettersArea=$();//are for the pool of available letters
  this.containerDiv=$();//contains all the game stuff for easy selecting
  this.myLastWord=$();//last corrtect word got object
  this.myBonusTime=$();//last bonus time object
  this.myBonusPoints=$();//last bonus points object

  //jQuery class selectors
  this.autoWidth=$('.autoWidth');
  this.autoWidth2=$('.autoWidth2');
  this.autoHeight=$('.autoHeight');
  this.spacerHeight=$('.spacerHeight');
  this.autoFontSize=$('.autoFontSize');
  this.autoSmallFontSize=$();

  //other stuff
  this.lettBonusTime=lettBonusTime;  //amount of time granted for getting a needed lett
  this.alphabetBonusTime=alphaBonusTime; //amount of time granted for the alphabet bonus
  this.savedScoresMax=5; //number of top scores to save
  this.needed=needed; //array of letters that are needed to pass round
  this.neededCheck=[]; //array the same length as needed but booleans for if they've been got
    //true means you still need the letter, otherwise false
  this.neededImage=[];  //array of references to the jquery images for the needed array
  this.neededCount = this.needed.length; //number of needed letters total for the round; does not change
  this.lettL=[];//The array of available letters
  this.gotLookup={};//Array lookup object of letters that have been "drawn"--
    //Stores an integer count for each type of letters still needed in your hand [thisLett]
  this.handLookup={};//contains a integer count of each type of letters in hand
    // {formally gotLookup[Lett+'count']}
    //also has dummy inflated numbers to avoid getting too many crappy letters
  this.lastLett ="";//last letter drawn
  this.guessL=[];//The guess array of letters
  this.roundNum=globalRound;  //keeps track of the current round number
  this.success=0; //Keeps track of the # of unique letters used
  this.deadline=new Date(); //keeps track of the time the round ends
  this.gameTime=gameTime; //Starting game time of the current round
  this.timeRemaining; //Time remaining in the current round, updated every second
  this.winWords=[]; //stores the words you've got
  this.timeInterval={}; //an interval object used to update clock and other things
  this.gameOn = true; //determines if graphics and things should be updated continually
  this.calculating=false;//determines if a word is still being processed to prevent premature end of game
  this.score = globalScore;//keeps track of score
  this.paused1 = false;//if true, should delay new round for animations
  this.paused2 = false;//if true, should delay new round for animations
  this.timeoutAni = false;//if true, game doesn't accept certain input, to prevent spamming
  this.IDcounter=1;//keeps track of the ID assigned to letters

  this.codeString="XXXXX";//the last 5 digits typed
  this.guess = ""; //The last word guessed
  this.processKeyboard={};//parameter that must be globalish--
                         // due to restrictions on adding event listeners
  this.gotAreaHeight=80;
  this.neededLoc=[];//Array of objects with a left, top, and speed attribute for animations

  this.lettNum=0; //number of letters available in hand. assigned in the in initGame function parameter

  this.vCount = 0;//vowel count of letter left after a correct guess
  this.cCount = 0;//consonant count of letter left after a correct guess
  this.gCount = 0;//count of needed letters after a correct guess

  //spacing and sizing
  this.lettSpace=0; //width-spacing between letters and sides
  this.guessAreaTopSpace=4; //space between the top of the div and the letter
  this.lettAreaTopSpace=2; //space between the top of the div and the letter
  this.areaWidth=475; //width of areas
  this.lettersAreaPos={}; //position of lettersArea
  this.windowWidth=0; //width of the window
  this.windowHeight=0; //height of the window
  this.clockWidth=0; //width of clock
  this.buttonFontSize=10; //button font size

  //letter properties
  this.lettHeight=56;
  this.lettWidth=42;
  this.lettFontSize=48;
  this.lettBorderRadius=9;

  //miniletter properties
  this.mlettHeight=20;
  this.mlettWidth=17;
  this.mlettFontSize=16;
  this.mlettBorderRadius=5;

  //colors list
  this.myDarkGreen='rgb(0,166,118)';
  this.myLightGreen='rgb(46,182,142)';
  this.myVeryLightGreen='rgb(84,195,162)';
  this.myVeryVeryLightGreen='rgb(122,208,183)';
  this.myGrey='rgb(50,50,50)';
  this.myButtonColor='rgb(83,148,218)';//button color
  this.anotherGrey='rgb(25,25,25)';//background when times up
  this.shadowColor='rgb(90,90,90)';
  this.myRed='rgb(218,44,56)';
  this.myBackground='rgb(0,0,0)';
  this.cheat=false;


  //*** FUNCTION: UPDATE SPACING/LAYOUT
  this.updateLettSpace=function(recallMe){
    if(typeof recallMe == 'undefined'){recallMe = false}
    console.log("resized");
    var myWindow=window.getComputedStyle(document.getElementById('main'));
    me.windowWidth=parseInt(myWindow.getPropertyValue('width'));
    me.windowHeight=parseInt(myWindow.getPropertyValue('height'));
    pane.css('width',me.windowWidth);
    pane.css('height',me.windowHeight);

    //calculate an "effective" screen width
    var miniRows=1;
    var slackDivAdder=0;//used to add space in case of non-mobile browser
    //if it's not a mobile, make it smaller
    if(!jQuery.browser.mobile){
      var minSize=400;
      if(me.windowWidth>minSize){
        me.windowWidth=minSize+(me.windowWidth-minSize)*.1;
      }
      if(me.windowHeight>minSize){
        slackDivAdder=(me.windowHeight-minSize)*.1;
        me.windowHeight=minSize+(me.windowHeight-minSize)*.1;
      }
    }

    //letter width calcs
    me.lettWidth=Math.max(Math.min(Math.floor((Math.min(me.windowWidth, me.windowHeight*1.3)-4)/me.lettNum),1000),8);
    me.lettHeight=Math.floor(Math.max(me.windowHeight*.17,me.lettWidth*1));
    me.lettBorderRadius=Math.floor((me.lettWidth+me.lettHeight)*0.09);
    me.lettFontSize=Math.floor(Math.min(me.lettWidth*1.5,me.lettHeight*1.0));
    me.areaWidth=Math.min(me.windowWidth-4,me.lettWidth*(me.lettNum+3));
    
    //*****PORTRAIT ORIENTATION*****
    if(me.windowWidth/me.windowHeight<0.88){
      me.mlettWidth=Math.max(Math.min(Math.floor((Math.min(me.windowWidth, me.windowHeight*1.45)-36-8)/17),1000),8);
      me.gotArea.css('width',me.mlettWidth*13+15+'px');
      miniRows=2;
    //*****LANDSCAPE ORIENTATION*****
    }else{
      me.mlettWidth=Math.max(Math.min(Math.floor((Math.min(me.windowWidth, me.windowHeight*1.45)-36-8)/26),1000),8);
      me.gotArea.css('width',me.areaWidth+'px');
    }

    //miniletter sizes
    me.mlettBorderRadius=Math.floor(me.mlettWidth*0.22);
    me.mlettFontSize=Math.floor(me.mlettWidth*1.25);
    me.mlettHeight=Math.floor(me.mlettWidth*1.35);

    var tempMinWidth=me.windowWidth-8;
    me.lettSpace=(me.areaWidth-me.lettNum*me.lettWidth)/2;
    
    //assign widths
    me.autoWidth.css('width',me.areaWidth);
    me.autoWidth2.css('width',Math.floor(Math.min(me.areaWidth-20, me.areaWidth*.7+50)));

    //assign letter dimensions
    var tempElements=document.getElementsByClassName('letter');
    for(i=0; i<tempElements.length; i++){
      tempElements[i].style.width=me.lettWidth+'px';
      tempElements[i].style.height=me.lettHeight+'px';
      tempElements[i].style.fontSize=me.lettFontSize+'px';
      tempElements[i].style.borderRadius=me.lettBorderRadius+'px';
      tempElements[i].style.lineHeight=me.lettHeight+'px';
    }
    
    //assign miniLetter dimensions
    tempElements=document.getElementsByClassName('miniLetter');
    for(i=0; i<tempElements.length; i++){
      tempElements[i].style.width=me.mlettWidth+'px';
      tempElements[i].style.height=me.mlettHeight+'px';
      tempElements[i].style.fontSize=me.mlettFontSize+'px';
      tempElements[i].style.borderRadius=me.mlettBorderRadius+'px';
      tempElements[i].style.lineHeight=me.mlettHeight+1+'px';
    }
    //CHECK THIS MATH************************************************
    //assign heights
    me.lettersArea.css('height',me.lettHeight+4);
    me.guessArea.css('height',me.lettHeight+4);
    var spacerCount=2;
    var titleHeight=me.mlettHeight;
    var correctAreaHeight=Math.floor(me.lettFontSize/2+me.mlettFontSize/2);
    var remainingHeight=Math.floor(me.windowHeight-(me.lettHeight*2+14+me.mlettHeight*miniRows*2+16+correctAreaHeight+2));
    var mySpacerHeight=2;
    var buttonHeight=(remainingHeight-mySpacerHeight*spacerCount)/2;
    var myMaxHeight=me.lettHeight;
    if(buttonHeight>myMaxHeight){
      mySpacerHeight=Math.floor(Math.min((remainingHeight-myMaxHeight*2)/spacerCount,me.windowHeight*0.01));
      buttonHeight=myMaxHeight;
    }    
    
    //the correctArea gets all remaining height up to max, rest goes to slackHeight
    var slackHeight=Math.max((remainingHeight-(buttonHeight*2+mySpacerHeight*spacerCount+10))/2,0);
    slackHeight+=slackDivAdder;
    
    buttonHeight=Math.max(buttonHeight, 24);
    me.correctArea.css('height', correctAreaHeight);
    me.buttonFontSize=Math.min(Math.max(buttonHeight*0.35,me.mlettFontSize),me.lettFontSize*.80);
    me.autoHeight.css('height',buttonHeight).css('line-height',buttonHeight+'px').css('font-size', me.buttonFontSize);
    me.spacerHeight.css('height', mySpacerHeight);

    var correctAreaWidth=me.areaWidth-(correctAreaHeight+me.mlettHeight*miniRows+8);
    me.correctArea.css('width', correctAreaWidth);
    document.getElementById('infoDiv').style.width=correctAreaWidth+'px';
    document.getElementById('slackDiv').style.height=slackHeight+'px';
    me.clockWidth=correctAreaHeight+me.mlettHeight*miniRows;
    //console.log("correctAreaWidth:"+correctAreaWidth+" "+me.areaWidth);
    me.clock.css('width',me.clockWidth)
      .css('height',me.clockWidth)
      .css('border-radius',buttonHeight)
      .css('font-size',Math.floor(me.clockWidth*.55))
      .css('line-height',Math.floor(me.clockWidth)+'px');

    //assign title and label sizes
    me.pBoard.css('height', me.mlettHeight);
    me.pLabel.css('height', me.mlettHeight);
    me.title1.css('height', me.mlettHeight);
    me.title1.css('line-height', me.mlettHeight+'px');
    
    me.autoFontSize.css('font-size', me.mlettFontSize);
    me.autoSmallFontSize.css('font-size', me.mlettFontSize*0.75);

    if(miniRows==1){
      me.title1.css('width',correctAreaWidth*0.38-10);
      me.pLabel.css('width',correctAreaWidth*0.2-5);
      me.pBoard.css('min-width',correctAreaWidth*0.20-5);
    }else{
      me.title1.css('width',correctAreaWidth*.65-20);
      me.pLabel.css('width',correctAreaWidth*0.7-15);
      me.pBoard.css('min-width',correctAreaWidth*0.30-5);
    }
    
    //assign actual letter positions
    me.lettersAreaPos=me.lettersArea.position();
    //for not-guessed letters
    for(var i=0;i<me.lettNum;i++){
      if((me.lettL[i]) && (me.lettL[i].guessed==false)){
        me.lettL[i].image.css('left',me.lettersAreaPos.left+(i*me.lettWidth)+me.lettSpace);
        me.lettL[i].image.css('top',me.lettersAreaPos.top+me.lettAreaTopSpace);
      }
    }
    //for guessed letters
    for(var i=0;i<me.guessL.length;i++){
      me.guessL[i].image.css('top',me.guessArea.position().top+me.guessAreaTopSpace);
      if(me.guessL.length<4){
        me.guessL[i].image.css('left',me.guessArea.position().left+(me.areaWidth-3*me.lettWidth)/2+(i)*me.lettWidth)
      }else{
        me.guessL[i].image.css('left',me.guessArea.position().left+(me.areaWidth-me.guessL.length*me.lettWidth)/2+(i)*me.lettWidth);
      }
    }

    //restart menu sizing
    if(miniRows==2){
      me.restartMenu.css('top',slackHeight+buttonHeight);
    }
    else{
      //me.restartMenu.css('top',slackHeight+buttonHeight*0.75);
      me.restartMenu.css('top',(me.windowHeight-me.restartMenu.height())/2);
    }
    
    //double recall for calc timing issues
    if(recallMe){
      setTimeout(function(){me.updateLettSpace(false)}, 60);
    }
  }


  //*** FUNCTION: INITIALIZE--THROW UP HTML OBJECTS IN THE PANE
  this.initHTML1=function(numL){
    pane.prepend($(
    "<div id='containerDiv' class='test'>"
      
      +"<div id='clock' class='test'></div>"
      +"<div id='infoDiv' class='test inlineMe'>"
        +"<div id='title1' class='test autoFontSize controlButton'>"+"EXIT"+"</div>"
        +"<div id='scoreDiv' class='test'>"
          +"<div id='pLabel' class='test autoFontSize'>Score:</div>"
          +"<div id='pBoard' class='test autoFontSize'>0</div>"
        +"</div>"
        +"<div id='correctArea' class='test'></div>"
      +"</div>"
      +"<div id='slackDiv' class='test inlineMe autoWidth'></div>"
      +"<div id='gotArea' class='test' style='text-align: center'></div>"
      +"<div id='guessArea' class='autoWidth'></div>"
      +"<div id='lettersArea' class='autoWidth'></div>"
      +"<div id='spacerA' class='autoWidth2 spacerHeight'></div>"
      +"<div id='enterLabel' class='controlButton autoWidth2 autoHeight' >CLEAR</div>"
      +"<div id='spacerB' class='autoWidth2 spacerHeight'></div>"
      +"<div id='mixLabel' class='controlButton autoWidth2 autoHeight' >SCRAMBLE</div>"
    +"</div>"
    ));
    me.containerDiv=$('#containerDiv');
    me.gotArea=$('#gotArea');
    me.clock=$('#clock');
    me.title1=$('#title1');
    me.pBoard=$('#pBoard');
    me.pLabel=$('#pLabel');
    me.correctArea=$('#correctArea');
    me.guessArea=$('#guessArea');
    me.lettersArea=$('#lettersArea');
    me.enterLabel=$('#enterLabel');
    me.mixLabel=$('#mixLabel');
    
    //refresh jQuery class selectors
    me.autoWidth=$('.autoWidth');
    me.autoWidth2=$('.autoWidth2');
    me.autoHeight=$('.autoHeight');
    me.spacerHeight=$('.spacerHeight');
    me.autoFontSize=$('.autoFontSize');
    
    //resize function
    $(window).off('resize'); //in case Resize function has already been added
    $(window).resize(me.doubleResize);
    //first initialize all the letters to zero in the gotLookup and handLookup objects
    me.lettNum=numL;
    me.pBoard.html(me.score);
    var aLetter = "";
    for(var x=65; x<91; x++){
      aLetter=String.fromCharCode(x);
      me.gotLookup[aLetter]=0;
      me.handLookup[aLetter]=0;
    }
    me.updateLettSpace(false);
    for(var x=0; x<me.neededCount; x++){
      me.neededCheck[x]=true;
      aLetter=me.needed[x];
      me.gotLookup[aLetter]++;
      me.gotArea.append(
        me.neededImage[x]=$('<div class="miniLetter ungot">'+aLetter+'</div>')
      );
    }
    me.handLookup['Q']=2;
    me.handLookup['J']=2;
    me.handLookup['W']=1;
    me.handLookup['X']=2;
    me.handLookup['Y']=1;
    me.handLookup['Z']=1;
    me.handLookup['I']=1;
    me.handLookup['U']=1;
    me.updateLettSpace(false);
  }


  //*** FUNCTION: CREATE A NEW RANDOM LETTER AND ADD TO THE POOL
  this.randLett=function(sendToIndex){
    console.log("v"+me.vCount+"/c"+me.cCount+"/g"+me.gCount);
    if(me.gameOn){
      //Generate the random letter
      var thisLett = "";
      var unique = false;      

      do{
        //CASE: If you need a unique letter
        if((me.cCount>=2)&&(me.vCount>=2)&&(me.gCount==0)&&(me.success<me.neededCount)){
          thisLett=me.needed[Math.floor(Math.random()*me.neededCount)];
          var n = 0;
          var index = 0;
          while((me.gotLookup[thisLett]<=0)&&(n<300)){
            //jump by a random amount
            index = me.needed.indexOf(thisLett)+Math.floor(Math.random()*me.neededCount);
            if(index>me.neededCount-1){index-=me.neededCount}
            thisLett=me.needed[index];
            n++;
          }
          console.log("n= "+n);
        }
        //CASE: If you need a consonant 
        else if((me.cCount<3)&&(me.vCount>=3)){
          do{
            thisLett=consonants[Math.floor(Math.random()*consonants.length)];
          }while(me.handLookup[thisLett]>=2);
        }
        //CASE: If you need a vowel
        else if((me.vCount<3)&&(me.cCount>=3)){
          do{
            if((me.handLookup['Q']==3)&&(me.handLookup['U']==1)
                &&(Math.random()<.18)){
              thisLett='U';
              console.log('*** GRANTED VOWEL: U ***');
            }
            else{thisLett=vowels[Math.floor(Math.random()*vowels.length)]}
          }while(me.handLookup[thisLett]>=2);
        }
        //CASE: If you need nothing, or both vowel & consonant
        else{
          do{
            console.log(me.handLookup['Q']+"_"+me.handLookup['U'])
            if((me.handLookup['Q']==3)&&(me.handLookup['U']==1)
                &&(Math.random()<.2)){
              thisLett='U';
              console.log('*** GRANTED AnyLett: U ***');
            }
            else{thisLett=alphabet[Math.floor(Math.random()*alphabet.length)];}
          }while(me.handLookup[thisLett]>=3);
        }
        if(me.gotLookup[thisLett]>0){unique=false}
      }while((thisLett==me.lastLett&&me.gotLookup[thisLett]==0)||unique);
      //Add the random letter to model
      me.lastLett=thisLett;
      me.handLookup[thisLett]++;
      var myNewLett={};
      if(me.checkLett(thisLett).answer){
        myNewLett=new Letter(thisLett,'notFound',false);
        me.gotLookup[thisLett]--;
        me.gCount++;
      }
      else{
        myNewLett=new Letter(thisLett,'found', true);
        //update gCount
      }
      me.animateSpawn(myNewLett.image, sendToIndex, false);
      //attach the ID number and the click event
      myNewLett.image.data('ID', me.IDcounter);
      myNewLett.ID=me.IDcounter;
      me.IDcounter++;
      myNewLett.image.bind('touchstart', myNewLett.clickEvent=function(e){
        me.clickOnImage($(this));
        e.stopPropagation();
        e.preventDefault();
      });
      myNewLett.image.bind('mousedown', myNewLett.clickEvent=function(e){
        me.clickOnImage($(this));
      });
      //update Vowel/C count with new letter
      if(['A', 'E', 'I', 'O', 'U'].indexOf(thisLett) !== -1){
        me.vCount++;
      }
      else{me.cCount++}
      //return the letter object      
      return myNewLett;
    }
  }


  this.borderUpdate=function(){
    var tempGuess="";//bookmark
    for(var x=0;x<me.guessL.length;x++){
      tempGuess+=me.guessL[x].letter;
    }
    if(me.cheat&&tempGuess.toLowerCase().length>2){dict[tempGuess.toLowerCase()]=true; console.log('CHEATED '+me.success)}  //FOR TESTING
    if(dict[tempGuess.toLowerCase()]){
      me.guessArea.css('border-color', me.myDarkGreen);
      me.enterLabel.html('SUBMIT').css('border-color', me.myDarkGreen);
    }else if(me.guessL.length==0&&me.guess.length>0){
      me.enterLabel.html('UNDO').css('border-color', me.myButtonColor);
      me.guessArea.css('border-color', me.myBackground);
    }else{
      me.guessArea.css('border-color', me.myBackground);
      me.enterLabel.html('CLEAR').css('border-color', me.myButtonColor);
    }
  }


  //*** FUNCTION: CHECK A GUESSED WORD
  this.checkGuess=function(){
    var guessWordLength=me.guessL.length;
    //if the guess is blank, return last guess
    if(guessWordLength==0){
      for(var i=0; i<me.guess.length; i++){
        me.addGL(me.guess[i], me.guess.length);
      }
    }
    else{
      me.calculating = true;
      var extraTime = 0;
      me.guess = "";
      var guessNeededLetts = 0;
      for(var x=0;x<guessWordLength;x++){
        me.guess+=me.guessL[x].letter;
        //if(me.checkLett(me.guessL[x].letter).answer){guessNeededLetts++}
      }
      //console.log(me.guess+" "+dict[me.guess.toLowerCase()]);
      if(dict[me.guess.toLowerCase()]){
        var lastScore = 0;
        var needRef={}//reference to the image of needed letters
        //update clock
        switch (guessWordLength){
          case 4:
            extraTime=2;
            lastScore=2;
            break;
          case 5:
            extraTime=4;
            lastScore=4;
            break;
          case 6:
            extraTime=6;
            lastScore=6;
            break;
          case 7:
            extraTime=10;
            lastScore=10;
            break;
          case 8:
            extraTime=20;
            lastScore=20;
            break;
          case 9:
            extraTime=50;
            lastScore=50;
            break;
          case 10:
            extraTime=100;
            lastScore=100;
            break;
          default:
            extraTime=0;
            lastScore=1;
        }
        extraTime=extraTime*me.lettBonusTime;
        lastScore=lastScore*me.lettBonusTime;
        me.winWords.push(me.guess);
        //delete old letters, generate new letters
        me.bonusAnimations(guessWordLength);
        for(var i=0;i<guessWordLength;i++){
          var thisLettCheck=me.checkLett(me.guessL[i].letter);
          //if its a letter that's needed
          if(thisLettCheck.answer&&(guessWordLength>=me.minWordLength)){
            needRef=me.neededImage[thisLettCheck.neededIndex];
            me.neededCheck[thisLettCheck.neededIndex]=false;
            me.animateCorrectMove(me.guessL[i].image, needRef);
            guessNeededLetts++;
            me.success++;
            if(me.success==me.neededCount){
              me.throwPoints(me.alphabetBonusTime,me.alphabetBonusTime,9,me.clockWidth,me.clockWidth,me.clock.position());
              setTimeout(function(){me.alphabetBonus(me.neededImage)}, 845);
            }
          }else if(!thisLettCheck.answer&&!me.guessL[i].got){
            me.gotLookup[me.guessL[i].letter]++;
            me.animateDissipation(me.guessL[i].image);
          }else{
            //if it's needed but not long enough word
            if(thisLettCheck.answer){me.gotLookup[me.guessL[i].letter]++}
            me.animateDissipation(me.guessL[i].image);
          }
          //me.guessL[i].image.remove();
          me.handLookup[me.guessL[i].letter]--;
        }
        me.throwPoints(extraTime+guessNeededLetts*me.lettBonusTime, extraTime+guessNeededLetts*me.lettBonusTime, guessWordLength, me.clockWidth,me.clockWidth, me.clock.position())
        //update the word used count
        wordCount[guessWordLength]++;
        wordCount[2]++;
        me.throwGuessWord();
        me.score+=lastScore+guessNeededLetts*me.lettBonusTime;
        me.pBoard.html(me.score);

        //check for need to change got status
        for(var i=me.lettL.length-1;i>-1;i--){
          if(!me.checkLett(me.lettL[i].letter).answer &&!me.lettL[i].got&&!me.lettL[i].guessed){
            me.lettL[i].got=true;
            me.lettL[i].image.toggleClass('found');
            me.lettL[i].image.toggleClass('notFound');
            me.gotLookup[me.lettL[i].letter]++;//bookmark
          }
        }
        //delete old letters and get new ones
        me.updateVowelCount();
        for(var i=me.lettL.length-1;i>-1;i--){
          if(me.lettL[i].guessed){
            me.lettL.splice(i,1,me.randLett(i));
          }
        }
        me.guessL=[];
        me.guess = "";
        me.borderUpdate();
      }
      //Else if the guess isn't a word
      else{
       for(var i=0; i<me.guess.length; i++){
          me.removeGL(me.guessL.length-1);
        }
      }
      me.calculating=false;
      me.updateClock();
    }
  }


  //***FUNCTION: UPDATES THE COUNT OF VOWELS/C/G FOR THE GUESS WORD
  this.updateVowelCount=function(){
    me.vCount = 0;
    me.cCount = 0;
    me.gCount = 0;
    for(var i=0;i<me.lettL.length;i++){
      if(!me.lettL[i].guessed){
        if(!me.lettL[i].got){me.gCount++}
        if(['A', 'E', 'I', 'O', 'U'].indexOf(me.lettL[i].letter) !== -1){
          me.vCount++;
        }
        else{me.cCount++}
      }
    }
  }


  //***FUNCTION: ANIMATION AND GIVE BONUS TIME FOR GETTING ALL THE LETTERS
  this.alphabetBonus=function(myNeededImage){
    console.log('Alphabet Bonus!');
    me.bonusAnimations(0);
    me.gotArea.css('min-height',me.gotArea.height()); //this is set to zero after respawning letters
    me.gotArea.css('min-width',me.gotArea.width()); //this is set to zero after respawning letters
    var myPosition={};
    for(var x=0; x<me.neededCount; x++){
      myPosition=myNeededImage[x].position();
      myNeededImage[x].css('top', myPosition.top);
      myNeededImage[x].css('left', myPosition.left);
    }
    var thisExplosionType=Math.random();
    var gotAreaPosTop=me.gotArea.position().top;
    for(var x=0; x<me.neededCount; x++){
      if(thisExplosionType<=0.4){
        me.lettExplosion(myNeededImage[x],me.windowWidth,me.windowHeight);
      }else if(thisExplosionType>=0.6){
        me.lettBlast(myNeededImage[x],me.windowWidth,gotAreaPosTop);//me.windowHeight
      }else{
        if(Math.random()>thisExplosionType){
          me.lettExplosion(myNeededImage[x],me.windowWidth,me.windowHeight);
        }
        else{
          me.lettBlast(myNeededImage[x],me.windowWidth,gotAreaPosTop);//me.windowHeight
        }
      }
    }
    for(var x=0; x<me.neededCount; x++){
      me.neededCheck[x]=true;
      aLetter=me.needed[x];
      me.gotLookup[aLetter]++;
      me.gotArea.append(
        me.neededImage[x]=$('<div class="miniLetter ungot">'+aLetter+'</div>')
      );
      me.neededImage[x].css('font-size','1px')
        .css("height", "1px")
        .css("width", "1px")
        .css("border-radius", "1px")
        .css("opacity", "1")
        .css("line-height", "1px")
    }
    //check for letter changes--all letters should be changed..
    for(var i=me.lettL.length-1;i>-1;i--){
      if(!me.checkLett(me.lettL[i].letter).answer &&!me.lettL[i].got){//probably not necessary?
        me.lettL[i].got=true;
        me.lettL[i].image.toggleClass('found');
        me.lettL[i].image.toggleClass('notFound');
        me.gotLookup[me.lettL[i].letter]++;
      }else if(me.checkLett(me.lettL[i].letter).answer &&me.lettL[i].got){
        me.lettL[i].got=false;
        me.lettL[i].image.toggleClass('notFound');
        me.lettL[i].image.toggleClass('found');
        me.gotLookup[me.lettL[i].letter]--;
      }
    }
    me.success=0;
    setTimeout(function(){
      for(var x=0; x<me.neededCount; x++){
        me.neededImage[x].animate({
          'font-size':me.mlettFontSize+'px',
          height: me.mlettHeight+'px',
          width: me.mlettWidth+'px',
          'line-height':me.mlettHeight+1+'px',
          'border-radius':me.mlettBorderRadius+'px'
        },{
          duration: 1750,
          easing:'easeInCubic',
        });
      }
    }, 750);
    setTimeout(function(){
      me.gotArea.css('min-height',0);
      me.gotArea.css('min-width',0);
    },3000);
  }


  //***FUNCTION: UPON CORRECT GUESS (OR ALPHABET BONUS), DISPLAY THE TIME GAIN ANIMATION
  this.throwPoints=function(time, dtime, wordLength, size, fsize, tempSpot){
    me.deadline = new Date(Date.parse(me.deadline)+(time*1000));
    //me.updateClock(); //moved to end of guess processing function
    //Bonus time animation
    if(dtime>0){
      var tempFontEnd=0;
      var tempFontStart=0;
      var myBonusTime=$();
      tempFontEnd=Math.floor(fsize*.55*((wordLength+15)/20));
      tempFontStart=Math.floor(fsize*.35);
      myBonusTime=$('<div class="bonus test"> +'+dtime+''+'</div>');
      myBonusTime.css('left',tempSpot.left+size*.84);
      if(wordLength>=7){myBonusTime.css('left',tempSpot.left+size*.74)}
      myBonusTime.css('top',tempSpot.top+size/2-tempFontStart*.66);
      myBonusTime.css('font-size',tempFontStart);
      pane.append(myBonusTime);
      myBonusTime.animate({
        fontSize:tempFontEnd,
        top:tempSpot.top+size/2-tempFontEnd*.66
      },{
        duration:Math.ceil((wordLength-4)/2)*500+(wordLength-4)*20,
        //easing:'easeOutBackX'
        specialEasing:{fontSize:'easeOutBackX', top:'easeOutBack'}
      });
      me.animateFloatAndFade(myBonusTime,fsize/2-(tempFontStart+tempFontEnd)*.25);
    }
  }

  //***FUNCTION: THROW GUESS WORD ANIMATION
  this.throwGuessWord=function(){
    me.myLastWord.remove();
    me.myLastWord=$('<div class="correctWord test">'+me.guess+''+'</div>');
    me.myLastWord.css('font-size', me.lettFontSize/2+me.mlettFontSize/2);
    me.myLastWord.css('line-height', me.lettFontSize*1/3+me.mlettFontSize*2/3+'px');
    me.correctArea.append(me.myLastWord);
    me.myLastWord.fadeOut(3000, "easeInCubic");
  }


  //***FUNCTION: ANIMATE BONUS FLOAT UP AND FADE OUT
  this.animateFloatAndFade=function(myObject, dist){
    //console.log("thisdist: "+dist);
    myObject.animate({
      top:'-='+dist,
      opacity:.01
    },{
      duration: 2000,
      easing: 'easeOutQuad',
      complete:function(){
         myObject.remove();
      }
    });  
  }
  this.clearEvents=function(){
    document.removeEventListener('keydown', me.processKeyboard);
    clearInterval(me.timeInterval);
    controlButtons.unbind('touchstart');
    controlButtons.unbind('mousedown');
  }

  //***FUNCTION: END ROUND PART 1
  this.roundOverPart1=function(){
    me.clearEvents();
    me.gameOn=false;
    me.paused1=true;
    for(var i=0;i<me.lettL.length;i++){
      me.lettL[i].image.unbind('touchstart');
      me.lettL[i].image.unbind('mousedown');
    }
    setTimeout(function(){
      me.paused1=false;
    },1000);
    me.clock.stop(true);
    me.clock.css('background-color',me.myRed);
    me.containerDiv.fadeTo(1000,.15,'easeOutQuad');
    setTimeout(function(){me.pauseGame1(me.roundOverPart2)},100);
  }

  //***FUNCTION: END ROUND PART 2
  this.roundOverPart2=function(){
    //update statuses in the menu
    me.correctArea.html("");
    me.winWords = [];
    console.log('Success:'+me.success);
    me.guess="";
    me.throwRestartMenu(pane);  
    document.getElementById('messageBox').innerHTML="You're out of time.";
    var currentScores=me.getHighScores(me.score);
    if(!currentScores[0] || currentScores[me.savedScoresMax]==0){
      document.getElementById('scoreBox').innerHTML="Score: "+me.score;
    }else{
      document.getElementById('scoreBox').innerHTML="But you've set a high score!";
    }
    var myList=$('#myList');
    for(var x=1;x<=me.savedScoresMax;x++){
      if(currentScores[x]==0){
        myList.append('<li>&ensp; &ensp; &ensp;'+'-'+'</li>');
      }else{
        myList.append('<li>&ensp; &ensp; &ensp; '+currentScores[x]+'</li>');
      }
    }
    if(currentScores[0]){
      $('#myList li:eq('+(currentScores[0]-1)+')').addClass('highlight');
    }
    me.updateLettSpace();//need to resize the menu once everything is added
    console.log(currentScores);
    console.log('******');
    me.score=0;
    me.roundNum=1;
    for(var x=2;x<11;x++){wordCount[x]=0}
    globalScore=me.score;
    globalRound=me.roundNum;
    me.restartMenu.fadeTo(400,1,'easeOutQuad');
    //document.getElementById("restartMenu").style.display = "inherit";
    var returnButton=$("#returnButton");
    exitToMenu=function(){
      returnButton.unbind('touchstart');
      returnButton.unbind('mousedown');
      me.lettButtonDarken(returnButton);
      pane.fadeTo(400,0,'easeOutQuad',function(){
        throwIntro();
      });      
    }
    returnButton.bind('touchstart', clickFunc=function(e){
      exitToMenu();
      e.stopPropagation();
      e.preventDefault();
    });
    returnButton.bind('mousedown', clickFunc=function(e){
      exitToMenu();
    });
  }

  
  //*** FUNCTION: PROCESS TYPING INPUT
  this.processTyping=function(event){
    //me.testCodeString(String.fromCharCode(event.keyCode)) //ENABLE TO ENABLE CHEAT {BOOKMARK}
    //If LETTER
    if((event.keyCode>64)&&(event.keyCode<91)){
      me.addGL(String.fromCharCode(event.keyCode));
    }
    //If BACKSPACE
    else if((event.keyCode==8)&&(me.guessL[0])){
      me.removeGL(me.guessL.length-1);
    }
    //If ENTER WITH GUESS
    else if(event.keyCode==13){
      me.checkGuess();
    }
    //If SPACEBAR
    else if((event.keyCode==32)&&(me.guessL.length<me.lettL.length-1)){
      me.twist();
    }
  }


  //*** FUNCTION: PAUSE NEW ROUND INFO TO FINISH ANIMATION
  this.pauseGame1=function(runMe){
    if(me.paused1){
      console.log('<paused1>');
      setTimeout(function(){
        me.pauseGame1(runMe);
      },1000);
    }
    else{runMe()}
  }

  //*** FUNCTION: UPDATE CLOCK IMAGE
  this.updateClock=function(){
    me.timeRemaining=me.getTimeRemaining(me.deadline);
    if((me.timeRemaining<=3)&&(me.timeRemaining>=1)){
      me.clock.animate({backgroundColor: me.myRed},500);
      me.clock.animate({backgroundColor: me.myGrey},500);//clockmark
    }
    if(me.timeRemaining<0){
      me.timeRemaining=0;
      me.clock.stop(true);
      me.clock.animate({backgroundColor: me.myRed},1);
      me.clock.css('backgroundColor', me.myRed);
    }
    //endgame event: out-of-time
    me.clock.html(me.timeRemaining);
    if((me.timeRemaining<=0)&&(me.gameOn)&&(!me.calculating)){
      me.roundOverPart1();
    }
  }

  //*** FUNCTION: MIX UP LETTERS
  this.twist=function(){
    var myLength=me.lettL.length;
    if(!me.timeoutAni){
      me.timeoutAni=true;
      setTimeout(function(){me.timeoutAni=false},350);
      var tempL=[];
      var oldIndex=[];
      var n=0;
      for(var c=0;c<myLength;c++){
        if(!me.lettL[c].guessed){
          tempL.push(me.lettL[c]);
          oldIndex.push(c);
        }
      }
      for(var i=0;i<myLength;i++){
        if(!me.lettL[i].guessed){
          n=Math.floor(Math.random()*tempL.length);
          me.animateTwistMove(tempL[n].image, oldIndex[n], i);
          me.lettL[i]=tempL[n];
          tempL.splice(n,1);
          oldIndex.splice(n,1);
        }
      }
    }
    else{console.log('*twist spam silenced*')}
  }


  //*** FUNCTION: CHECK TO SEE IF A LETTER IS "NEEDED"
  this.checkLett=function(myLett){
    var theAnswer={};
    theAnswer.answer=false;
    theAnswer.neededIndex=null;
    for(var i=0;i<me.neededCount;i++){
      if((myLett==me.needed[i])&&(me.neededCheck[i])){
        theAnswer.answer=true;
        theAnswer.neededIndex=i;
      }
    }
    return theAnswer;
  }  


  //*** FUNCTION: GET REMAINING SECONDS
  this.getTimeRemaining=function(endtime){
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor(t/1000);
    return seconds;
  }


  //*** FUNCTION: ADD A LETTER TO THE GUESS ARRAY, IF IN POOL, GIVEN LETTER
  this.addGL=function(lett, totalLetts){//totalLetts parameter optional
    for (var x=0;x<me.lettL.length;x++){
      if((me.lettL[x].letter==lett) && (!me.lettL[x].guessed)){
        me.lettL[x].spot=x;
        me.addTheLett(me.lettL[x], totalLetts);
        break;
      }
    }
  }


  //*** FUNCTION: ADD OR REMOVE A LETTER TO/FROM THE GUESS ARRAY, GIVEN IMAGE
  this.clickOnImage=function(lettImage){
    var thisID=lettImage.data('ID');
    for(var x=0;x<me.guessL.length;x++){
      if(me.guessL[x].ID==thisID){
      //if((me.guessL[x].image.offset().left==lettImage.offset().left)
      //  &&(me.guessL[x].image.offset().top==lettImage.offset().top)){
        me.removeGL(x);
        for(var i=0;i<me.guessL.length;i++){
          me.animateCenterMove(me.guessL[i].image,i+1,me.guessArea,me.guessAreaTopSpace,me.guessL.length);
        }
        return;
      }
    }
    for(var x=0;x<me.lettL.length;x++){
      if(me.lettL[x].ID==thisID){
      //if((me.lettL[x].image.offset().left==lettImage.offset().left)
      //  &&(me.lettL[x].image.offset().top==lettImage.offset().top)){
        me.lettL[x].spot=x;
        me.addTheLett(me.lettL[x]);
        break;
      }
    }
  }


  //*** FUNCTION: UPDATE MODEL & CALL ANIMATION FOR A LETTER BEING ADDED TO GUESS ARRAY
  this.addTheLett=function(theLett, totalLetts){//last parameter optional. letter object as parameter theLett
    //if all the letters are entered at once, send them directly to their spot and doesn't rearrange-loop
    me.guessL.push(theLett);
    if(totalLetts){
      var totalNumLetts=totalLetts;
      var counter=me.guessL.length-1;
    }else{
      var totalNumLetts=me.guessL.length;
      var counter=0
    }
    theLett.guessed=true;
    for(var i=counter;i<me.guessL.length;i++){
      me.animateCenterMove(me.guessL[i].image,i+1,me.guessArea,me.guessAreaTopSpace,totalNumLetts);
    }//animationImage,thisIndex,toArea,topSpace,totalLets
    me.borderUpdate();
  }


  //*** FUNCTION: DELETE LETTER FROM GUESS ARRAY
  this.removeGL=function(n){ //parameter 'n' is index of Letter in guessL that needs to be deleted
    me.lettL[me.guessL[n].spot].guessed=false;
    me.animateSimpleMove(me.guessL[n].image,me.guessL[n].spot+1,me.lettersArea,me.lettAreaTopSpace);
    me.guessL.splice(n,1);
    me.borderUpdate();
  }


  //***FUNCTION: CODES FOR TESTING
  this.testCodeString=function(addLett){
    me.codeString+=addLett;
    me.codeString=me.codeString.slice(1);
    if(me.codeString==="DDDDD"){
      me.deadline = new Date(Date.parse(me.deadline) + 30*1000);
    }
    else if(addLett=="9"){
      me.cheat=true;
    }
    else if(me.codeString==="IDWON"){
      for(var x=0; x<me.neededCount; x++){
        aLetter=me.needed[x];
        console.log(aLetter+': '+me.gotLookup[aLetter]);
      }
    }
    else if(addLett=="0"){
      me.throwPoints(me.alphabetBonusTime,me.alphabetBonusTime,9,me.clockWidth,me.clockWidth,me.clock.position());
      me.alphabetBonus(me.neededImage);
    }
    //temporary instant codes

    if(addLett=="3"||addLett=="4"||addLett=="5"||addLett=="6"||addLett=="7"||addLett=="8"){
      //me.bonusAnimations(addLett);
      for(var x=0;x<Number(addLett);x++){
        me.addGL(me.lettL[x].letter);
      }
      setTimeout(me.checkGuess, 10);
      
    }
  }
  

  //*** FUNCTION: RESIZE TWICE
  this.doubleResize=function(){
    setTimeout(function(){me.updateLettSpace(true)},20);
  }


  //*** FUNCTION: INITIALIZE THE GAME
  this.initGame=function(){
    for(var q=0; q<me.lettNum; q++){
      me.lettL[q]=me.randLett(q);
    }
    document.addEventListener('keydown', me.processKeyboard=function(keyEvent){me.processTyping(keyEvent)});
    //update the timer
    me.deadline = new Date(Date.parse(new Date())+((me.gameTime+.4)*1000));
    me.updateClock();
    me.timeInterval = setInterval(function(){me.updateClock()},1000);
  }


  //*** FUNCTION: THROW UP END-OF-ROUND MENU 
  this.throwRestartMenu=function(pane){
    pane.append(me.restartMenu=$(
      "<div id='restartMenu' class='test' style='display:none'>"
        +"<div id='messageBox' class='test autoSmallFontSize'></div>"
        +"<div id='scoreBox' class='test autoSmallFontSize'></div>"
        +"<div id='highScoreTitle' class='autoSmallFontSize menuSize'>High Scores "+me.skill.toUpperCase()+"</div>"
        +"<ol id='myList' class='autoSmallFontSize'></ol>"
        +"<div id='returnButton' class='skillButton autoHeight'>MENU</div>"
      +"</div>"
    ));
    me.restartMenu.css('box-shadow', '0px 0px 10px 5px '+me.shadowColor)
        .css('position','absolute');
    me.autoSmallFontSize=$('.autoSmallFontSize');
    me.autoHeight=$('.autoHeight');
    me.updateLettSpace();
  }


  //*** FUNCTION: STORE HIGH SCORE
  this.getHighScores=function(thisScore){//thisScore is the current score
    //clear out old scores for newest version
    //localStorage.clear()
    if(localStorage.getItem('score1')){window.localStorage.clear()}
    //set default scores  
    for(var i=1;i<=me.savedScoresMax;i++){
      if(!localStorage.getItem('score'+me.skill+i)){
        localStorage.setItem('score'+me.skill+i,'0');
      }
    }
    //possibly enter new high score
    var i=me.savedScoresMax;
    while(thisScore>parseInt(localStorage.getItem('score'+me.skill+i))&&i>0){
      if(thisScore<=parseInt(localStorage.getItem('score'+me.skill+(i-1)))||i==1){
        for(var x=me.savedScoresMax;x>=(i+1);x--){
          var tempScore=localStorage.getItem('score'+me.skill+(x-1));
          localStorage.setItem('score'+me.skill+x,tempScore);
        }
        localStorage.setItem('score'+me.skill+i,thisScore);
      }
      i-=1;
    }
    i+=1;
    //retrieve scores
    var scores=[];
    for(var n=1;n<=me.savedScoresMax;n++){
      scores[n]=parseInt(localStorage.getItem('score'+me.skill+n));
    }
    //determine if a high score was set and return scores
    if(i<=me.savedScoresMax){
      scores[0]=i;
    }else{
      scores[0]=false;
    }
    return scores;
  }


  //**********************************************************************************************
  //*******************************  ANIMATION FUNCTIONS  ****************************************
  //**********************************************************************************************

  //*** FUNCTION: ANIMATE BORDER COLOR ON CORRECT GUESS
  this.bonusAnimations=function(wordLength){
    me.clock.stop(true);
    me.clock.css('background-color',me.myGrey);
    if(wordLength==1){
      me.animateShadow(me.clock,'mediumGreenShadow', false);
    }else if(wordLength==3){
      me.animateShadow(me.guessArea,'littleGreenShadow', false);
    }else if(wordLength==4){
      me.animateShadow(me.guessArea,'mediumGreenShadow', false);
      me.animateShadow(me.clock,'mediumGreenShadow', false);
    }else if(wordLength==5){
      me.animateShadow(me.guessArea,'mediumGreenShadow', true);
      me.animateShadow(me.clock,'mediumGreenShadow', true);
      me.animateShadow(pane,'mediumGreenShadow', true);
    }else if(wordLength==6){
      //me.animateColor(me.guessArea,1000,me.myVeryVeryLightGreen,me.myGrey);
      //me.animateColor(me.clock,1000,me.myVeryVeryLightGreen,me.myGrey);
      //me.animateColor(pane,1000,me.myVeryVeryLightGreen,me.myBackground);
      me.animateShadow(me.guessArea,'bigGreenShadow', true);
      me.animateShadow(me.clock,'bigGreenShadow', true);
      me.animateShadow(pane,'bigGreenShadow', true);
    }else if(wordLength==7){
      //me.animateColor(me.guessArea,1400,me.myVeryLightGreen,me.myGrey);
      //me.animateColor(me.clock,1400,me.myVeryLightGreen,me.myGrey);
      //me.animateColor(pane,1400,me.myVeryLightGreen,me.myBackground);
      me.animateShadow(me.guessArea,'extraBigGreenShadow', true);
      me.animateShadow(me.clock,'extraBigGreenShadow', true);
      me.animateShadow(pane,'extraBigGreenShadow', true);
    }else if(wordLength>=8){
      me.animateColor(me.guessArea,2000,me.myLightGreen,me.myGrey);
      me.animateColor(me.clock,2000,me.myLightGreen,me.myGrey);
      me.animateColor(pane,2000,me.myLightGreen,me.myBackground);
      me.animateShadow(me.guessArea,'extraBigGreenShadow', true);
      me.animateShadow(me.clock,'extraBigGreenShadow', true);
      me.animateShadow(pane,'extraBigGreenShadow', true);
    }else if(wordLength==0){
      me.animateColor(me.guessArea,350,me.myLightGreen,me.myGrey);
      me.animateColor(me.clock,350,me.myLightGreen,me.myGrey);
      me.animateColor(pane,350,me.myLightGreen,me.myBackground);
      me.animateShadow(me.guessArea,'extraBigGreenShadow', true);
      me.animateShadow(me.clock,'extraBigGreenShadow', true);
      me.animateShadow(pane,'extraBigGreenShadow', true);
    }
  }


  //*** FUNCTION: ANIMATE SHADOW FOR A SHORT TIME
  this.animateShadow=function(myObject,myColorClass,long){
    myObject.removeClass('addTransition');  
    myObject.removeClass('addLongTransition');  
    myObject.addClass(myColorClass);
    setTimeout(function(){
      if(long){myObject.addClass('addLongTransition')}
      else{myObject.addClass('addTransition')}
      myObject.removeClass(myColorClass);
    },50);
  }


  //*** FUNCTION: ANIMATE COLORS FOR A SHORT TIME
  this.animateColor=function(myObject,myDuration,myColor,myReturnColor){
    //fade in
    myObject.stop();
    myObject.animate({
      backgroundColor: myColor
    },{queue:true, duration:50,easing:'linear'});
    //fade out
    myObject.animate({
      backgroundColor: myReturnColor
    },{queue:true, duration:myDuration-50, easing:'linear'});
  }


  //*** FUNCTION: ANIMATE NEW LETTER SPAWNING
  this.animateSpawn=function(image, thisIndex, secondTime){
    if(!secondTime){//second time for case animation didnt complete
      image.css({'top':me.lettersAreaPos.top+me.lettAreaTopSpace+me.lettHeight/2})
          .css({'left':me.lettersAreaPos.left+((thisIndex)*me.lettWidth)+me.lettSpace+me.lettWidth/2})
          .css('font-size','1px')
          .css("height", "1px")
          .css("width", "1px")
          .css("border-radius", "1px")
          .css("opacity", "1")
          .css("line-height", "1px")
    }
    image.animate({
      top:me.lettersAreaPos.top+me.lettAreaTopSpace,
      left:me.lettersAreaPos.left+((thisIndex)*me.lettWidth)+me.lettSpace,
      'font-size':me.lettFontSize+'px',
      height: me.lettHeight+'px',
      width: me.lettWidth+'px',
      'line-height':me.lettHeight+'px',
      'border-radius':me.lettBorderRadius+'px'
    },{
      duration: 325,
      easing:'easeOutSine',
      start:function(){
        if(!secondTime){me.containerDiv.append(image)}
      },
      fail:function(){//ensures this completes
        me.animateSpawn(image, thisIndex, true);
      }
    });
  }


  //*** FUNCTION: ANIMATE RE-ALIGNMENT LETTER MOVEMENT AND OTHER STUFF
  this.animateSimpleMove=function(animationImage,thisIndex, toArea, topSpace){
    animationImage.stop();
    var gotoTop=toArea.position().top+topSpace;
    var gotoLeft=toArea.position().left+((thisIndex-1)*me.lettWidth)+me.lettSpace;
    var dist=Math.sqrt(Math.pow(animationImage.position().top-gotoTop,2)
        +Math.pow(animationImage.position().left-gotoLeft,2));
    animationImage.animate({
      top:gotoTop,
      left:gotoLeft,
    },{
      duration: (dist/me.lettWidth)*100+40,
      easing: 'easeOutSine'//'linear'//'easeOutQuad'
    });
  }


  //*** FUNCTION: ANIMATE REGULAR LETTER MOVEMENT TO/FROM GUESS AREA
  this.animateCenterMove=function(animationImage,thisIndex,toArea,topSpace,totalLets){
    animationImage.stop();
    animationImage.css('z-index',25);
    var gotoTop=toArea.position().top+topSpace;
    if(totalLets<4){
      var gotoLeft=toArea.position().left+(me.areaWidth-3*me.lettWidth)/2+(thisIndex-1)*me.lettWidth;
    }else{
      var gotoLeft=toArea.position().left+(me.areaWidth-totalLets*me.lettWidth)/2+(thisIndex-1)*me.lettWidth;
    }
    var dist=Math.sqrt(Math.pow(animationImage.position().top-gotoTop,2)
        +Math.pow(animationImage.position().left-gotoLeft,2));
    animationImage.animate({
      top:gotoTop,
      left:gotoLeft,
      'z-index':10,
    },{
      duration: (dist/me.lettWidth)*95+30,
      easing: 'easeOutQuad'
    });
  }


  //*** FUNCTION: ANIMATE TWIST LETTER MOVEMENT
  this.animateTwistMove=function(animationImage, start, end){
    //animationImage.stop();
    var endLeft=end*me.lettWidth+me.lettSpace+me.lettersAreaPos.left;//ending left loc
    var startLeft=start*me.lettWidth+me.lettSpace+me.lettersAreaPos.left;//starting left loc
    var randomDir=Math.floor(Math.random()+0.5)*2-1;
    animationImage.animate({
      left:endLeft
    },{
      duration: Math.abs(startLeft-endLeft)/me.lettWidth*70+100,
      easing: 'linear',
      progress:function(animation,prog){
        animationImage.css('top', (me.lettersAreaPos.top+me.lettAreaTopSpace)
          +(1-Math.pow((prog*2)-1,2))*(Math.floor((startLeft-endLeft)/5)+5)*randomDir);
      }
    });
  }


  //*** FUNCTION: ANIMATE CAPTURED LETTER MOVEMENT
  this.animateCorrectMove=function(animationImage, terminus){
    animationImage.stop();
    var loc=terminus.position();
    var loc2=me.gotArea.position();
    var dist=Math.abs(animationImage.offset().left-terminus.offset().left);
    me.bonusAnimations(1);
    //me.throwPoints(0, me.lettBonusTime, 4, me.mlettWidth, me.mlettWidth*3.5, {left:loc.left+loc2.left, top:loc.top+loc2.top});
    animationImage.animate({
      top:loc.top+loc2.top+1,
      left:loc.left+loc2.left-1,
      'font-size':me.mlettFontSize+'px',
      height: me.mlettHeight+'px',
      width: me.mlettWidth+'px',
      'border-radius': me.mlettBorderRadius+'px',//bookmark
      'line-height':me.mlettHeight+'px'
    },{
      duration: (dist/me.lettWidth)*155+405,
      easing: 'easeOutQuad',
      start:function(){
      },
      complete:function(){
        terminus.toggleClass('ungot got');
        animationImage.remove();
      }
    });
  }


  //*** FUNCTION: ANIMATE LETTER DISSIPATION
  this.animateDissipation=function(animationImage){
    animationImage.css("z-index", "1")
    .css("opacity", "1")
    .animate({
      top:'+='+me.lettHeight/2,
      left:'+='+me.lettWidth/2,
      'font-size':'1px',
      height: '1px',
      width: '1px',
      'border-radius': '1px',
      'line-height':'1px',
      opacity:0.8
    },{
      duration: 850,
      easing: 'easeOutCubic',//easeOutQuad
      start:function(){
      },
      complete:function(){
        animationImage.remove();
      }
    });
  }


  //*** FUNCTION: ANIMATE LETTER EXPLOSION
  this.lettExplosion=function(thisImage,w,h){
    thisImage.addClass('prepare');
    var eTop=Math.floor(Math.random()*h/2);
    eTop*=(Math.floor(Math.random()*2)*2-1);
    //eTop-=50;
    var eLeft=Math.floor(Math.random()*w/2);
    eLeft*=(Math.floor(Math.random()*2)*2-1);
    //eLeft-=50;
    var distPercent = Math.sqrt(h*h+w*w)/Math.sqrt(eTop*eTop+eLeft*eLeft);
    
    thisImage.animate({
      top:'+='+eTop,
      left:'+='+eLeft,
      'font-size':16*distPercent+'px',
      height: 20*distPercent+'px',
      width: 17*distPercent+'px',
      'line-height':  20*distPercent+'px',
      'border-radius': 5*distPercent+'px'
    },{
      duration:1700,
      easing:'linear',
      progress:function(animation,prog){
        thisImage.css('opacity', 1-(prog*prog*prog+.06));
      },
      complete:function(){
        $(this).remove();
      }
    });
  }


  //*** FUNCTION: ANIMATE LETTER BLASTED OFF
  this.lettBlast=function(thisImage,w,h){
    thisImage.addClass('prepare');
    var eTop=Math.floor(Math.random()*(h*.01)+h*1.5);
    //eTop*=(Math.floor(Math.random()*2)*2-1);
    //eTop-=50;
    var eLeft=Math.floor(Math.random()*(w/1.25));
    eLeft*=(Math.floor(Math.random()*2)*2-1);
    //eLeft-=50;
    var distPercent = Math.sqrt(h*h+w*w)/Math.sqrt(eTop*eTop+eLeft*eLeft);
    //console.log("eTop/top: "+eTop+"/"+h+" eLeft/left: "+eLeft+"/"+w)
    thisImage.animate({
      top:'-='+eTop,
      left:'+='+eLeft,
    },{
      duration:Math.sqrt(eTop*eTop+eLeft*eLeft)*3.9+175,
      easing:'easeOutQuad',
      progress:function(animation,prog){
        thisImage.css('opacity', 1-(prog*prog*prog*prog*prog));
      },
      complete:function(){
        $(this).remove();
      }
    });
  }


  //*** FUNCTION: ANIMATE BUTTON CLICK
  this.lettButtonDarken=function(myButton){
    myButton.stop(true,true);
    myButton.css('backgroundColor', 'rgb(60,110,163)')//rgb(68,122,179)
    myButton.animate({backgroundColor: me.myButtonColor},500);
  }

}
//*********************************************************************************************
//*************************  END  *************************************************************
//*********************************************************************************************

