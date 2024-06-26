function updateTheme(switchTeme){
    let value = parseInt(switchTeme.value, 10); // Convert to an integer
   
    let body = document.querySelector("body");
    console.log(body)
    if (value === 1) {
      localStorage.setItem("themeValue","1")
      switchTeme.classList.remove('tgl-off', 'tgl-def');
      switchTeme.classList.add('tgl-on');
      
      while (body.classList.length > 0) {
        body.classList.remove(body.classList.item(0));
        } body.classList.add("orange-theme")
    } else if (value === 2) {
      localStorage.setItem("themeValue","2")
      switchTeme.classList.remove('tgl-on', 'tgl-off');
      switchTeme.classList.add('tgl-def');
      
      while (body.classList.length > 0) {
        body.classList.remove(body.classList.item(0));
        }
       
    } else if (value === 3) {
      localStorage.setItem("themeValue","3")
      switchTeme.classList.remove('tgl-def', 'tgl-on');
      switchTeme.classList.add('tgl-off');
      
      while (body.classList.length > 0) {
        body.classList.remove(body.classList.item(0));
        }
       body.classList.add("dark-theme")
    }
}


  function setDynamicValue() {
    const switchTeme = document.getElementById('custom-toggle');
    let c = localStorage.getItem("themeValue")
    let nr = parseInt(c)
    switchTeme.value = nr;
    let body = document.querySelector("body");
    if (nr === 1) {
      
      switchTeme.classList.remove('tgl-off', 'tgl-def');
      switchTeme.classList.add('tgl-on');
      
      while (body.classList.length > 0) {
        body.classList.remove(body.classList.item(0));
        } body.classList.add("orange-theme")
    } else if (nr === 2) {
      
      switchTeme.classList.remove('tgl-on', 'tgl-off');
      switchTeme.classList.add('tgl-def');
      
      while (body.classList.length > 0) {
        body.classList.remove(body.classList.item(0));
        }
       
    } else if (nr === 3) {
    
      switchTeme.classList.remove('tgl-def', 'tgl-on');
      switchTeme.classList.add('tgl-off');
      
      while (body.classList.length > 0) {
        body.classList.remove(body.classList.item(0));
        }
       body.classList.add("dark-theme")
    }
  } 
  setDynamicValue();


