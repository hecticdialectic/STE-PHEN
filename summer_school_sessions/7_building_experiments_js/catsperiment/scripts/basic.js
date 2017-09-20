
// This is a JS comment.

console.log("Hi! I'm here in your basic.js script");

// Event handler: what to do if the mouse hovers over an image

$( 'img' ).hover(

  //What to do when mouse enters
 function(){
   console.log('on image');
 },

 //What to do when mouse leaves
 function(){
   console.log('off image');
 }

);
