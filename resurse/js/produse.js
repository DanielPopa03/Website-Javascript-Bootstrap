let lastChecked;

window.addEventListener("load",function(){
//Bonus afisare produs pret minim pe categorie
function getMinim() {
   console.log("getMin")
    document.querySelectorAll('.produs.red-aura').forEach(item => item.classList.remove('red-aura'));

    let produs = document.querySelectorAll('.produs');
    let minPrices = {}; // Use an object for faster lookups

   
    produs.forEach((item, index) => {
        let categorie = item.querySelector('.val-categorie').textContent.trim();
        let pret = parseFloat(item.querySelector('.val-pret').textContent.trim());

        // Update the minimum price for the category
        if (!minPrices[categorie] || pret < minPrices[categorie].pret) {
            minPrices[categorie] = { index: index, pret: pret };
        }
    });

    // Apply "red-aura" class to the products with the minimum price in their category
    Object.values(minPrices).forEach(min => {
        produs[min.index].classList.add('red-aura');
    });
}

getMinim();

//Cerinta Individuala Etapa 7
    function startProdusAnimation(){
       let produs  = document.getElementsByClassName("produs");
       let i = 0
       let length = produs.length
       function addProdusAnimation(){
         if(i < length){
            //console.log(produs[i])
            produs[i].classList.add("animationProdus")
            i += 1;
            setTimeout(addProdusAnimation, 1000)
         }
        else{
            for(let j = 0 ; j <length; j++){
                produs[j].classList.remove("animationProdus")
            }
        }
       }
        addProdusAnimation()
    }
    startProdusAnimation()



//Bonus Oferta



    function parseDate(dateString) {
        var [datePart, timePart] = dateString.split(", "); // Splitting date and time parts
        var [datePartSplit, ampm] = datePart.split(" "); // Splitting date and AM/PM parts
        var [month, day, year] = datePartSplit.split("/"); // Splitting date into day, month, year
        var [hour, minute, second] = timePart.split(/:| /); // Splitting time into hour, minute, second, and AM/PM
        
        // Convert hour to 24-hour format if it's PM
        if (ampm === "PM" && hour !== "12") {
            hour = String(Number(hour) + 12);
        } else if (ampm === "AM" && hour === "12") {
            hour = "0";
        }

        // Creating a new Date object
        return new Date(year, month - 1, day, hour, minute, second);
    }
    // function deleteOferte(oferta){
    //         // Data to send in the POST request (if needed)
        

    //     // Options for the fetch request
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: {
    //         'Content-Type': 'application/json', // Specify the content type as JSON
    //         },
    //         mode:'cors',
    //         cache:'default',
    //         body: JSON.stringify(postData), // Convert the data to JSON string
    //     };
    
    //     // Make the POST request
    //         fetch('/deleteOferte', requestOptions)
    //         .then(response => {
                
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json(); // Parse the JSON response
    //         })
    //         .then(newOffer => {
    //         // Handle the response from the server
    //         console.log('New offer generated:', newOffer);
    //         // Update UI or do something with the new offer data
    //         })
    //         .catch(error => {
    //         console.error('Error making POST request:', error);
    //         // Handle errors
    //         });
        
    // }
    function startTemporizator(element, endTime) {
        
        function updateTemporizator(element, endTime) {
            
            let data = new Date();
            let now = parseDate(data.toLocaleString());
            let timeRemaining = Math.max((endTime - now) / 1000, 0);
            
            let hours = Math.floor(timeRemaining / 3600);
            let minutes = Math.floor((timeRemaining % 3600) / 60);
            let seconds = Math.floor(timeRemaining % 60);
    
            element.textContent = `${hours}h ${minutes}m ${seconds}s`;
            
            
            if (timeRemaining <= 10) {
                element.style.color = 'red';
                // Adaugă un efect sonor dacă este necesar
                // new Audio('path/to/sound.mp3').play();
            }
    
            if (timeRemaining > 0) {
                setTimeout(()=>{updateTemporizator(element, endTime)}, 1000);
            }else{
               let pret = element.parentElement.nextElementSibling.querySelector(".pret");
               let firstSpanText = pret.querySelector('span').textContent;
               let spansWithoutClass = document.querySelectorAll('span:not([class])');
                spansWithoutClass.forEach(function(span) {
                    span.parentNode.removeChild(span);
                });
               let valPret = pret.querySelector(".val-pret")
               valPret.textContent = firstSpanText
               element.parentElement.remove();

            }
        }
        updateTemporizator(element, endTime)
    }
    async function generateOferte(){
            // Data to send in the POST request (if needed)
        const postData = {
            // Add any data you need to send in the request body
        };
        
        // Options for the fetch request
        const requestOptions = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
            },
            mode:'cors',
            cache:'default',
            body: JSON.stringify(postData), // Convert the data to JSON string
        };
    
        // Make the POST request
        await fetch('/genereazaOferta', requestOptions)
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // console.log(response.json())
            return response; // Parse the JSON response
            })
            .then(newOffer => {
            // Handle the response from the server
            console.log('New offer generated:', newOffer);
            // Update UI or do something with the new offer data
            })
            .catch(error => {
            console.error('Error making POST request:', error);
            // Handle errors
            });
  
    }
    async function loadOferte(produse){
        console.log("Load Oferta")
        await generateOferte();
        let oferte;
        await fetch('/getOferte')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(oferta => {
            // Extracted data from the promise result
            let oferte =oferta.oferte;
            let data = new Date();
            let dataCurenta = parseDate(data.toLocaleString());
            let produse = document.getElementsByClassName("produs");
            console.log(dataCurenta)
            for(let i = 0; i < oferte.length; i++){
            
                 let dataMin = parseDate(oferte[i].data_incepere);
                 let dataMax = parseDate(oferte[i].data_finalizare);
                 
                console.log(oferte[i].categorie)
                console.log(dataCurenta >= dataMin && dataCurenta <= dataMax)
                 if(dataCurenta >= dataMin && dataCurenta <= dataMax){
                    
                    for (let j = 0; j < produse.length; j++) {
                        var produs = produse[j];
                        var valCategorie = produs.querySelector('.val-categorie').textContent;
                        var valPret = produs.querySelector('.val-pret').textContent;
                        // Output the content of the <span> element
                        // console.log(valCategorie, oferte[i].categorie)
                        if (valCategorie == oferte[i].categorie) {
                           
                            var paragraphElement = document.createElement("p");
                            paragraphElement.textContent = "Oferta ";
                            const spanElement = document.createElement('span');
                            const spanElement2 = document.createElement('span');
                            // Set the text content of the span
                            spanElement.textContent = `${produs.querySelector('.val-pret').textContent}`;
                            spanElement2.textContent =   " "+`${oferte[i].reducere}%` + " ";
                            spanElement.style.textDecoration = "line-through";
                            
                            
                            let aux = produs.querySelector('.val-pret')
                            console.log(aux.parentNode.insertBefore(spanElement, aux), aux.parentNode.insertBefore(spanElement2, aux),
                            
                            produs.querySelector('.val-pret').textContent = `${valPret * (1 - oferte[i].reducere/100)}` );
                           
                            // Insert the <p> element before the target element
                            produs.parentNode.insertBefore(paragraphElement, produs);
                            // Adaugă temporizatorul în elementul <p>
                            let temporizatorSpan = document.createElement("span");
                            temporizatorSpan.classList.add('temporizator');
                            paragraphElement.appendChild(temporizatorSpan);

                            // Pornește temporizatorul
                            startTemporizator(temporizatorSpan, dataMax);
                        }
                    }
                
                }
            } 
            // getMinim();
        })
        .catch(error => console.error('Error fetching oferte:', error));
        
    }
    loadOferte(document.getElementsByClassName("produs"));
    setInterval(()=>{
        loadOferte(document.getElementsByClassName("produs"))
    },120000)
//
    document.getElementById("inp-pret").onchange = function(){
        document.getElementById("infoRange").innerHTML = `(${this.value})`;
    }


    
    document.getElementById("filtrare").onclick = function(){
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();

        var radioCalorii = document.getElementsByName("gr_rad");
        let inpCalorii;
        for(let rad of radioCalorii){
            if(rad.checked){
                inpCalorii=rad.value;
                break;
            }
        }
        let minCalorii, maxCalorii;
        if(inpCalorii != "toate"){
            vCal = inpCalorii.split(":");
            minCalorii = parseInt(vCal[0]);
            maxCalorii = parseInt(vCal[1]);
        }

        var inpPret =parseInt(document.getElementById("inp-pret").value);

        var inpCategorie = document.getElementById("inp-categorie").value.toLowerCase().trim();

        var produse = document.getElementsByClassName("produs");
        for(let produs of produse){

            let valNume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            
            let cond1 = valNume.startsWith(inpNume);

            let valCalorii = parseInt(produs.getElementsByClassName("val-calorii")[0].innerHTML);

            let cond2 = (inpCalorii == "toate" || (minCalorii <= valCalorii && valCalorii < maxCalorii));

            let valPret = parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);

            let cond3 = (valPret>inpPret);

            let valCategorie = produs.getElementsByClassName("val-categorie")[0].innerHTML.toLowerCase().trim();

            let cond4 = (inpCategorie == valCategorie || inpCategorie == "toate");

            if(cond1 && cond2 && cond3 && cond4){
                produs.style.display = "block";

            }else{
                produs.style.display = "none";
            }

        }
    }

    function sorteaza (semn){
        var produse=document.getElementsByClassName("produs");
        let v_produse=Array.from(produse)
        v_produse.sort(function(a,b){
            let pret_a=parseInt(a.getElementsByClassName("val-pret")[0].innerHTML)
            let pret_b=parseInt(b.getElementsByClassName("val-pret")[0].innerHTML)
            if (pret_a==pret_b){
                let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML
                let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(pret_a-pret_b);
        })
        
        for (let prod of v_produse){
            prod.parentNode.appendChild(prod)
        }

    }

    document.getElementById("sortCrescNume").onclick = function(){
        sorteaza(1);
    }

    document.getElementById("sortDescrescNume").onclick = function(){
        sorteaza(-1);
    }

    document.getElementById("resetare").onclick= function(){
                
        document.getElementById("inp-nume").value="";
        
        document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
        document.getElementById("inp-categorie").value="toate";
        document.getElementById("i_rad4").checked=true;
        var produse=document.getElementsByClassName("produs");
        document.getElementById("infoRange").innerHTML="(0)";
        for (let prod of produse){
            prod.style.display="block";
        }
    }

    function validateTextarea() {
        const textarea = document.getElementById('inp-nume');
        const textareaLabel = document.getElementById('textarea-label'); // Define textareaLabel
        const value = textarea.value.trim();
        const containsNumbers = /\d/.test(value); // Check if value contains numbers
      
        // Apply or remove the 'is-invalid' class based on validation result
        if (containsNumbers) {
            textareaLabel.classList.add('is-invalid');
        } else {
            textareaLabel.classList.remove('is-invalid');
        }
        
        return !containsNumbers; // Return true if value doesn't contain numbers
    }

    const textarea = document.getElementById('inp-nume');
    textarea.addEventListener('input', validateTextarea);

    const radioButtons = document.querySelectorAll('.btn-group-toggle input[type="radio"]');
    
    radioButtons.forEach(button => {
        if(button.checked) lastChecked = button;
        button.addEventListener('change', function() {
            if (this.checked) {
                // console.log('Button unchecked:', lastChecked.value);
                lastChecked.parentElement.classList.remove("btn-primary")
                lastChecked.parentElement.classList.add("btn-outline-primary")
                button.parentElement.classList.remove("btn-outline-primary")
                button.parentElement.classList.add("btn-primary")
                lastChecked = button;
                // console.log('Button checked:', this.value);

            } else {
                // console.log('Button unchecked:', input.value);
               
            }
        });
    })



})

window.onkeydown = function(e){
    if(e.key == "c" && e.altKey){
        // console.log("ghedwl")
        let suma = 0;
        var produse = document.getElementsByClassName("produs");
        for(let produs of produse){
            var stil = getComputedStyle(produs)
            if(stil.display != "none"){
                suma += parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);
            }
        }
        if(document.getElementById("produse")){
            // console.log("ghedwl")
            let p = document.createElement("p");
            p.innerHTML = suma;
            p.id = "par_suma";
            container = document.getElementById("produse")
            container.insertBefore(p, container.children[0])
            setTimeout(function(){
                let pgf = document.getElementById("par_suma")
                if(pgf)
                    pgf.remove()
            },10000)
        }
    }
}

