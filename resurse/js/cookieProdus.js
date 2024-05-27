function setCookie(nume, val, timpExpirare){
    d=new Date();
    d.setTime(d.getTime()+timpExpirare)
    document.cookie=`${nume}=${val}; path=/ ;expires=${d.toUTCString()}`;
}

function getCookie(nume){
    vectorParametri=document.cookie.split(";") 
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume+"=")){
        

            return param.split("=")[1]
        }
            
    }
    return null;
}

function deleteCookie(nume){
    console.log(`${nume}; expires=${(new Date()).toUTCString()}`)
    document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`;
}

window.addEventListener("load", function(){
    if(this.window.location.pathname.startsWith("/produs")){
    if (getCookie("ultimulProdus")){
       console.log("era deja setat")
    }

    
    setCookie("ultimulProdus",window.location.pathname,100000);
    }else{
       
        console.log(getCookie("ultimulProdus"))
        if (getCookie("ultimulProdus")){
            
          let p =  document.createElement("p");
          p.textContent = "Ultima pagina accesata este: "
          let a =  document.createElement("a");
          a.textContent = getCookie("ultimulProdus")
          a.setAttribute("href",getCookie("ultimulProdus"))
          p.appendChild(a)
          let main = document.querySelector("main")
         console.log(
           
        main.insertBefore(p,main.children[0]))
        }
    }
})
