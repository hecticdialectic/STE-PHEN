
// This is a JS comment.

console.log("Hi! I'm here in your basic.js script");

var hoverCounter = 0;

// Add some functionality once the document is loaded
$( document ).ready(
  function(){

    // Event handler: what to do if the mouse hovers over an image
    $( 'img' ).hover(

     //What to do when mouse enters
     function(){
       console.log('on image');
       hoverCounter+=1;
       $( '.myDiv' ).html(hoverCounter);

       console.log(hoverCounter);
     },

     //What to do when mouse leaves
     function(){
       console.log('off image');
     }

    );
});
