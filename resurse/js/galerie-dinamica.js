let galerieDinamica; let _index = 0; let numberOfElements = 0; let firstElement;
console.log("aaaaa")
document.addEventListener("DOMContentLoaded", function() {
    var boxes = document.querySelectorAll('.boxy');
    
    // Convert NodeList to array and reverse it
    var boxesArray = Array.from(boxes).reverse();
    galerieDinamica = boxesArray;
    
    var numberOfBoxes = boxes.length;
    numberOfElements = numberOfBoxes;
    // console.log(galerieDinamica)
    // console.log(numberOfElements)
    function startAnimation(box) {
      if(_index == 0)
      galerieDinamica.forEach(function(element) {
        element.classList.remove('op');
      });
      console.log(box)
      box.classList.add('animated');
      box.classList.remove('op');
      
      _index ++;
    }
   
    function restartAnimation(box) {
      console.log("restart"+_index)
      console.log(box)
      box.classList.add('op');
      box.classList.remove('animated');
      // setTimeout(function() {
      //   if(_index < numberOfBoxes ){
      //     startAnimation(galerieDinamica[_index]);
      //   }else{
      //     _index = 0;
      //     startAnimation(galerieDinamica[0]);
      //   }
      // }, timeOfAnimation); 
      if(_index < numberOfBoxes ){
        startAnimation(galerieDinamica[_index]);
      }else{
        _index = 0;
        startAnimation(galerieDinamica[0]);
      }
    }
    // Restart the animation for each box after each iteration
    galerieDinamica.forEach(function(box) {
      box.addEventListener('animationiteration', function() {
        restartAnimation(box);
      });
    });
   
    if(numberOfElements != 0){
      firstElement = galerieDinamica[0].cloneNode(true); 
      galerieDinamica[numberOfElements-1].parentNode.insertBefore(firstElement, galerieDinamica[numberOfElements-1]);
      firstElement = galerieDinamica[0];
      startAnimation(galerieDinamica[0]);
      console.log(galerieDinamica)
    }
  
    
  
});