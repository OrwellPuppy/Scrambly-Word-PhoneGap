
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
 //this somehow checks for a mobile browser
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
if(jQuery.browser.mobile){
  console.log('MOBILE BROWSER');
}else{console.log('NON-MOBILE BROWSER');}


/* this swallows backspace keys on any non-input element.
* stops backspace -> back*/
$(function(){
  var rx = /INPUT|SELECT|TEXTAREA/i;
  $(document).bind("keydown keypress", function(e){
    if( e.which == 8 ){ // 8 == backspace
      if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
        e.preventDefault();
      }
    }
  });
});

//**********************************************************************************************
//**********************************  MAIN GAME CODE  ******************************************
//**********************************************************************************************
$(document).ready(function(){
  //navigator.splashscreen.hide();
  main = $('#main');
  pane = $('#pane');
  s={};
  throwIntro();
});


//************************************************************************************
//*********************************  FUNCTIONS  **************************************
//************************************************************************************

 //*** FUNCTION: THROW UP INTRO SCREEN
function throwIntro(){
  main.css('background-color','rgb(0,0,0)');
  isStorageSupported();
  pane.empty(); //***for case of restart***
  pane.append($(
        "<title class='test titleFont2'>Scrambly Word</title>"
        +"<h1 class='test titleFont'>a quick word game</h1>"
        +"<h2 class='test smallHeader titleFont'>- HOW TO PLAY -</h2>"
        +"<h3 class='test smallHeader titleFont'>Construct words from a pool of 8 random letters before time runs out. Extra time is awarded for longer words and for the first use of each letter in the alphabet. Additional time is awarded once all letters of the alphabet have been used. <i>NOVICE</i> is given twice as much time as <i>EXPERT</i>.</h3>"
    ));
  ($(
    "<div id='introMenu' class='test'>"
      +"<div id='noviceButton' class='skillButton'>NOVICE</div>"
      +"<div id='expertButton' class='skillButton'>EXPERT</div>"
    +"</div>"
  ).insertAfter('h1'));
  var noviceButton=$('#noviceButton');
  var expertButton=$('#expertButton');
  var skillButtons=$('.skillButton');
  pane.fadeTo(400,1,'easeInQuad');
  resizeIntroScreen();
  $(window).off('resize');
  $(window).resize(resizeIntroScreen);
  setTimeout(resizeIntroScreen,50);
  s = new gameState(10, 3, 10, 1, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "Expert");
  startButtonEvent=function(event){
      skillButtons.unbind('touchstart');
      skillButtons.unbind('mousedown');
    if(event.target.id=='noviceButton'){
      s.lettButtonDarken(noviceButton);
      s.gameTime=20;
      s.alphaBonusTime=20;
      s.lettBonusTime=2;
      s.skill="Novice";
    }else{
      s.lettButtonDarken(expertButton);
    }
    startGame();
  }
  setTimeout(function(){
    skillButtons=$('.skillButton').bind('touchstart', clickFunc=function(e){
      startButtonEvent(e);
      e.stopPropagation();
      e.preventDefault();
    });
    skillButtons.bind('mousedown', clickFunc=function(e){
      startButtonEvent(e);
    });
  },400);
}


//*** FUNCTION: START GAME ON CLICK
function startGame(){
  myButtonEvent=function(event){
    if(event.target.id=='enterLabel'){
      s.lettButtonDarken(s.enterLabel);
      s.checkGuess();
    }
    else if(event.target.id=='mixLabel'){
      s.lettButtonDarken(s.mixLabel);
      s.twist();
    }
    else{
      s.lettButtonDarken(s.title1);
      s.clearEvents();
      pane.fadeTo(400,0,'easeOutQuad',function(){
        throwIntro();
      });
    }
  }  
  pane.fadeTo(400,0,'easeOutQuad',function(){
    pane.empty();
    s.initHTML1(8);
    pane.fadeTo(400,1,'easeInQuad');
    setTimeout(function(){
      s.initGame();
      controlButtons=$('.controlButton').bind('touchstart', clickFunc=function(e){
        myButtonEvent(e);
        e.stopPropagation();
        e.preventDefault();
      });
      controlButtons.bind('mousedown', clickFunc=function(e){
        myButtonEvent(e);
      });
    },515);
  });
}


function resizeIntroScreen(){
  console.log("intro resized");
  var paneHeight=main.height();
  var paneWidth=main.width();
  pane.css('width',paneWidth);
  pane.css('height',paneHeight);
  //if it's not a mobile, make it smaller
  if(!jQuery.browser.mobile){
    if(paneWidth>450){
      paneWidth=450+(paneWidth-450)*.05;
      pane.css('width',paneWidth);
    }    
  }
  expertButton = $('#expertButton');
  //Set font sizes
  var titleFontSize=Math.floor(Math.min(paneWidth,paneHeight)/10);
  $('title').css('font-size',titleFontSize);//titleFontSize);
  //$('title').html(jQuery.browser.mobile+" "+titleFontSize);//titleFontSize);

  $('h1').css('font-size',titleFontSize*.50);
  //$('h1').html(titleFontSize*.60);
  //document.getElementById('noviceButton').style.fontSize=titleFontSize*.7;
  //document.getElementById('expertButton').style.fontSize=titleFontSize*.7;
  $('.skillButton').css('font-size',titleFontSize*.70);
  $('.skillButton').css('line-height',expertButton.height() +'px');
  $('.smallHeader').css('font-size',titleFontSize*.40);
  //$('#introMenu').fadeTo(800,1);
  var topMargin=paneHeight*.08;
  if(paneWidth<paneHeight){topMargin=paneHeight*.10}
  $('title').css('margin-top',topMargin)
  $('h1').css('margin-bottom',paneHeight*0.05);
  $('h2').css('margin-top',paneHeight*0.05);
  $('h2').css('margin-bottom',paneHeight*0.01);
}
function isStorageSupported() {
  if (typeof(localStorage) === "undefined" || typeof(sessionStorage) === "undefined") {
    alert("Web Storage is not supported ...");
    return false;
  }
  return true;
}


/*
****TO DO LIST****

combine w/ AS into one app?? shared functions??

Make so that if you twist with only two letters available, it always swaps them

maybe add the "desktop" spacing to the very first menu so it doesnt move down on start..

update button border radius dynamically,
  perhaps button min-height as well for final replay menu on high res screens

main start button height is mess up in IE

*/