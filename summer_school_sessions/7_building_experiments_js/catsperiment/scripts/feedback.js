
// log a message on the console to make sure this script has loaded properly

$( document ).ready(
  function(){

  //the e argument is just an object that holds information about this event (a key press)
  $(document).keypress(function(e) {

    // log e to see what it looks like - coding is easier if you know what you're dealing with

    // to find out which key was pressed, just access the 'which' attribute of 'e' i.e. e.which
    // log it to the console

    // now make the message more informative
    // google 'javascript key codes'
    // find out of they responded 'happy' or 'sad' and log a message appropriately

    // (more advanced - if you have time - make an alert that announces their choice IF they press 'f' or 'j')

  });

});
