const express = require('./resurse/node_modules/express');

const fs = require('fs');
const path = require('path');
const sharp=require('./resurse/node_modules/sharp');
const sass=require('./resurse/node_modules/sass');
const ejs=require('ejs');
const AccesBD= require("./module_proprii/accesbd.js");

const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js")
const session = require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");
const {Client} = require('./resurse/node_modules/pg');

var client = new Client({database:"Asteroizi",
        user:"dani",
        password:"123456",
        host:"localhost",
        port:5432});
client.connect();

client.query("select * from enum_range(null:categ_produs)", function(err, rez){
    console.log(rez);
    console.log("----------------------------")
})

obGlobal ={
    obErori:null,
    obImagini:null,
    folderScss:path.join(__dirname + "/resurse/scss"),
    folderCss:path.join(__dirname + "/resurse/css"),
    folderBackup:path.join(__dirname,"/backup")
}

vect_foldere = ['temp', 'temp1', "backup"]
for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder)
    if(!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
    }
}

app = express();
app.use(["/deleteOferte","/genereazaOferta"],express.json({limit:'2mb'}));
console.log("Folder proiect", __dirname);
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd());

app.use(session({ // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
  }));

app.set("view engine","ejs");
app.use("/resurse", express.static(__dirname+"/resurse"));
app.use("/resurse/node_modules", express.static(__dirname+"/resurse/node_modules"));
client.query("select * from unnest(enum_range(null::tipuri_produse))", function(err, rezCategorie){ 
    if (err){        console.log(err);

        }    
    else{        obGlobal.optiuniMeniu=rezCategorie.rows;}
});
app.use("/*",function(req, res, next){    
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;    
    res.locals.Drepturi=Drepturi;    
    if (req.session.utilizator){        
        req.utilizator=res.locals.utilizator=new Utilizator(req.session.utilizator);    
    }        
    next();
})

//------------Utilizatori
app.post("/inregistrare",function(req, res){
    console.log("bai")
    var username;
    var poza;
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){
        console.log("Inregistrare:",campuriText);


        console.log(campuriFisier);
        console.log(poza, username);
        var eroare="";


        // TO DO var utilizNou = creare utilizator
        var utilizNou =new Utilizator();
        try{
            utilizNou.setareNume=campuriText.nume[0];
            utilizNou.setareUsername=campuriText.username[0];
            utilizNou.email=campuriText.email[0]
            utilizNou.prenume=campuriText.prenume[0]
           
            utilizNou.parola=campuriText.parola[0];
            utilizNou.culoare_chat=campuriText.culoare_chat[0];
            utilizNou.poza= poza[0];
            Utilizator.getUtilizDupaUsername(campuriText.username[0], {}, function(u, parametru ,eroareUser ){
                if (eroareUser==-1){//nu exista username-ul in BD
                    //TO DO salveaza utilizator
                    utilizNou.salvareUtilizator()
                }
                else{
                    eroare+="Mai exista username-ul";
                }


                if(!eroare){
                    res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})
                   
                }
                else
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
            })
           


        }
        catch(e){
            console.log(e);
            eroare+= "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
        }
   

    });
    formular.on("field", function(nume,val){  // 1
   
        console.log(`--- ${nume}=${val}`);
       
        if(nume=="username")
            username=val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
       
        console.log(nume,fisier);
        //TO DO adaugam folderul poze_uploadate ca static si sa fie creat de aplicatie
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului (variabila folderUser)
        var folderUser=path.join(__dirname, "poze_uploadate", username);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser)
       
        fisier.filepath=path.join(folderUser, fisier.originalFilename)
        poza=fisier.originalFilename;
        //fisier.filepath=folderUser+"/"+fisier.originalFilename
        console.log("fileBegin:",poza)
        console.log("fileBegin, fisier:",fisier)


    })    
    formular.on("file", function(nume,fisier){
        console.log("file");
        console.log(nume,fisier);
    });
});

//http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}
app.get("/cod/:username/:token",function(req,res){    
    /*TO DO parametriCallback: cu proprietatile: request (req) si token (luat din parametrii cererii)       
     setat parametriCerere pentru a verifica daca tokenul corespunde userului    */    
     console.log(req.params);   
      
    try {       
         var parametriCallback = {
            req: req,
            token:req.params.token
         }       
        Utilizator.getUtilizDupaUsername(req.params.username,parametriCallback ,
        function(u,obparam){            
            let parametriCerere = {
                tabel:"utilizatori",
                campuri: {confirmat_mail:true},
                conditiiAnd:[`id = ${u.id}`]
            };            
            AccesBD.getInstanta().update(                
                parametriCerere,                 
        function (err, rezUpdate){                    
            if(err || rezUpdate.rowCount==0){                        
                console.log("Cod:", err);                        
            afisareEroare(res,3);                    
        }                    
    else{                        
        res.render("pagini/confirmare.ejs");                   
     }                
    })        
})   
 }    
catch (e)
{        console.log(e);        
    afisareEroare(res,2);   
 }
})
app.post("/login",function(req, res){ 
       /*TO DO parametriCallback: cu proprietatile: request(req), response(res) si parola        
       testam daca parola trimisa e cea din baza de date       
        testam daca a confirmat mailul    */   
         var username;    console.log("ceva");    
         var formular= new formidable.IncomingForm()   
           
        formular.parse(req, function(err, campuriText, campuriFisier ){ 

            var parametriCallback = {
                req:req,
                res:res,
                parola: campuriText.parola
            }  

            Utilizator.getUtilizDupaUsername (campuriText.username[0],parametriCallback, 
            function(u, obparam, eroare ){
                
                let parolaCriptata = Utilizator.criptareParola(obparam.parola.toString())
                if(u.parola == parolaCriptata && u.confirmat_mail){ 
                 u.poza=u.poza?path.join("poze_uploadate",u.username, u.poza):"";                
                 obparam.req.session.utilizator=u;                               
                 obparam.req.session.mesajLogin="Bravo! Te-ai logat!";                
                 obparam.res.redirect("/index");                           
                }           
                else{                
                 console.log("Eroare logare")                
                 obparam.req.session.mesajLogin="Date logare incorecte sau nu a fost confirmat mailul!";                
                 obparam.res.redirect("/index");            
                }        
            })    
        });    
});
app.post("/profil", function(req, res) {
    console.log("profil");
    if (!req.session.utilizator) {
        afisareEroare(res, 403);
        res.render("pagini/eroare_generala", { text: "Nu sunteti logat." });
        return;
    }
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFile) {
        var parolaCriptata = Utilizator.criptareParola(campuriText.parola[0]);
        AccesBD.getInstanta().updateParametrizat(
            {
                tabel: "utilizatori",
                campuri: ["nume", "prenume", "email", "culoare_chat"],
                valori: [
                    `${campuriText.nume[0]}`,
                    `${campuriText.prenume[0]}`,
                    `${campuriText.email[0]}`,
                    `${campuriText.culoare_chat[0]}`
                ],
                conditiiAnd: [`parola='${parolaCriptata}'`, `username = '${campuriText.username[0]}'`]
            },
            function(err, rez) {
                if (err) {
                    console.log(err);
                    afisareEroare(res, 2);
                    return;
                }
                console.log(rez.rowCount);
                if (rez.rowCount == 0) {
                    res.render("pagini/profil", { mesaj: "Update-ul nu s-a realizat. Verificati parola introdusa." });
                    return;
                } else {
                    // actualizare sesiune
                    console.log("ceva");
                    req.session.utilizator.nume = campuriText.nume[0];
                    req.session.utilizator.prenume = campuriText.prenume[0];
                    req.session.utilizator.email = campuriText.email[0];
                    req.session.utilizator.culoare_chat = campuriText.culoare_chat[0];
                    res.locals.utilizator = req.session.utilizator;
                }
                res.render("pagini/profil", { mesaj: "Update-ul s-a realizat cu succes." });
            }
        );
    });
});

//-------------
////////--------BONUS OFERTE
// app.post('/deleteOferte', (req, res) => {
//     // // Get the offer to delete from the request body
//     const offerToDelete = req.body;
    
//     // console.log(req.body)
   
//     //Read the existing offers from oferte.json
//     fs.readFile(path.join(__dirname, 'resurse/json/oferte.json'), 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error reading file:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//         return;
//       }
  
//       // Parse the JSON data
//       let oferte = JSON.parse(data);
  
      
      
//       // Filter out the offer to delete
//       oferte.oferte = oferte.oferte.filter(offer => !(offer.categorie === offerToDelete.categorie && 
//                                                         offer.data_incepere === offerToDelete.data_incepere && 
//                                                         offer.data_finalizare === offerToDelete.data_finalizare && 
//                                                         offer.reducere === offerToDelete.reducere));
  
                                                       
//       // Write the updated offers back to oferte.json
//       fs.writeFile(path.join(__dirname, 'resurse/json/oferte.json'), JSON.stringify(oferte, null, 2), 'utf8', (err) => {
//         console.log(oferte)
//         if (err) {
//           console.error('Error writing file:', err);
//           res.status(500).json({ error: 'Internal Server Error' });
//           return;
//         }
//         // Send success response
//         res.json({ message: 'Offer deleted successfully' });
//       });
//     });
//   });
app.post('/genereazaOferta', (req, res) => {
    
    
    client.query("select * from unnest(enum_range(null::categ_produs))", function(err, rezOptiuni){   
        if (err) {
            console.log(err);
            afisareEroare(res, 2);
        }
        else{
            categories = rezOptiuni.rows.map(row => row.unnest);
            
            const discounts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
            
        
            const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
            
            // Read the existing offers from oferte.json
            fs.readFile(path.join(__dirname, 'resurse/json/oferte.json'), 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
        
            // Parse the JSON data
            const oferte = JSON.parse(data);
            firstOfferCategory = oferte.oferte[0].categorie;
            
            // Generate random category and discount
            let randomCategory;
            
            do {
            randomCategory = categories[Math.floor(Math.random() * categories.length)];
            } while (randomCategory == firstOfferCategory);
           
            const dataIncepere = new Date();
            const dataFinalizare = new Date(dataIncepere.getTime() + 2 * 60000); 
            // Create a new offer
            const newOffer = {
                categorie: randomCategory,
                data_incepere: dataIncepere.toLocaleString(),
                data_finalizare: dataFinalizare.toLocaleString(),
                reducere: randomDiscount
            };
            
            oferte.oferte =  oferte.oferte.filter(offer => !(newOffer.data_incepere >= offer.data_finalizare ))
            // Add the new offer to the beginning of the offers array
            oferte.oferte.unshift(newOffer);
        
            // Write the updated offers back to oferte.json
            fs.writeFile(path.join(__dirname, 'resurse/json/oferte.json'), JSON.stringify(oferte, null, 2), 'utf8', (err) => {
                if (err) {
                console.error('Error writing file:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
                }
                // Send the newly generated offer as response
                res.json(newOffer);
            });
    });
        }
});
    
});
app.get('/getOferte', (req, res) => {
    // Read the oferte.json file
    fs.readFile(path.join(__dirname, 'resurse/json/oferte.json'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      //console.log(data)
      res.json(JSON.parse(data));
    });
  });
////-----------------
app.get('/suma/:a/:b', function(req,res) {
    var suma = parseInt(req.params.a) + parseInt(req.params.b);
    res.send("" + suma);
});

app.get(['/galerie'], (req, res) => {

    res.render("pagini/galerie-statica", {imagini:obGlobal.obImagini.imagini});
});

app.get(['/','/home','/index'], (req, res) => {

    res.render("pagini/index", {ip: req.ip, imagini:obGlobal.obImagini.imagini});
});

app.get("/*.ejs", (req, res) => {
    afisareEroare(res, 400);

});

app.get(new RegExp('^\/resurse[a-zA-z0-9\/_\s]*\/$'), (req, res) => {
    afisareEroare(res, 403);

});

app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "/resurse/favicon/favicon.ico"));

});

app.get('/despre', (req, res) => {
    res.render('pagini/despre'); // Se afișează pagina despre.ejs
  });

app.get("/produse", function(req, res){    
    console.log(req.query);   
    var conditieQuery="";    
    if (req.query.categorie){        
        conditieQuery=` where categorie='${req.query.categorie}'`   
     }    
    
    client.query("select * from unnest(enum_range(null::categ_produs))", function(err, rezOptiuni){   
        if (err) {
            console.log(err);
            afisareEroare(res, 2);
        }
            client.query(`SELECT * FROM suplimente_alimentare ${conditieQuery}`, function(err, rez){   
                
                if (err){             
                    console.log(err);               
                    afisareEroare(res, 2);            
                }           
                else{
                    let oferte;
                    fs.readFile('D:/As-teroizi/resurse/json/oferte.json', 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error reading the file:', err);
                            return;
                        }
            
                        try {
                            oferte = JSON.parse(data);
    
                        } catch (error) {
                            console.error('Error parsing JSON data:', error);
                        }
                    });              
                    res.render("pagini/produse", {produse: rez.rows, optiuni:rezOptiuni.rows, oferte: oferte})            
                }        
            })   
    });
   
    
})


  app.get('/produs/:id', (req, res) => {
    client.query(`SELECT * FROM suplimente_alimentare WHERE id = ${req.params.id}`, function(err, rez){
        if(err){
            console.log(err);
            afisareEroare(res,err,2);
        }
        else{
            
            res.render('pagini/produs',{prod:rez.rows[0]}); 
        }
    })
    // Se afișează pagina despre.ejs
  });  
//-----------------------------------
app.get('/*', (req, res) => {
    try {
        res.render('pagini' + req.url, (err, rezHTML) => {
            if(err) {    
                if(err.message.startsWith('Failed to lookup view')) {
                    afisareEroare(res, 404);
                    console.log('Nu a gasit: ', req.url);
                }
                else
                    if(err.message.startsWith("Cannot find module")) {
                        afisareEroare(res, 404);
                        console.log("Nu a gasit resursa: ", req.url);
                    }
            }
            else{
                res.send(rezHTML)
            }
        });
    }
    catch(err1) {
        if(err1.message.startsWith('Cannot find module')) {
            afisareEroare(res, 404);
            console.log('Nu a gasit resursa: ', req.url);
        }
        else {
            afisareEroare(res);
            console.log("Eroare: " + err1);
        }
    }
});
////////////----------------------------------------
function initErori() {
    let continut = fs.readFileSync(path.join(__dirname,"/resurse/json/erori.json"));
    obGlobal.obErori = JSON.parse(continut);
    for(let eroare of obGlobal.obErori.info_erori) {
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
        console.log(eroare.imagine);
    }

    obGlobal.obErori.eroare_default = path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine);
   
}

function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare = obGlobal.obErori.info_erori.find(
        (elem) => {
            return elem.identificator == identificator;
        }
    )
    if(!eroare) {
        let eroare_default = obGlobal.obErori.eroare_default;
        
        res.render('pagini/eroare', {
            titlu: titlu || eroare_default.titlu,
            text: text || eroare_defualt.text,
            imagine: imagine || eroare_default.imagine

        }); // al doilea argument este locals
    }
    else {
        if(eroare.status)
            res.status(eroare.identificator);

            res.render('pagini/eroare', {
                titlu: titlu || eroare.titlu,
                text: text || eroare.text,
                imagine: imagine || eroare.imagine
    
            });
    }
}

function initImagini(){    
    var continut= fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");    
    obGlobal.obImagini=JSON.parse(continut);    
    let vImagini=obGlobal.obImagini.imagini;    
    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);    
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");    
    if (!fs.existsSync(caleAbsMediu))        
    fs.mkdirSync(caleAbsMediu);    
//for (let i=0; i< vErori.length; i++ )    
for (let imag of vImagini){    
     
    [numeFis, ext] = imag.cale_imagine.split(".");
    let caleFisAbs=path.join(caleAbs,imag.cale_imagine);        
    let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");        
    sharp(caleFisAbs).resize(400).toFile(caleFisMediuAbs);        
    imag.fisier_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )       
     imag.cale_imagine=path.join("/", obGlobal.obImagini.cale_galerie, imag.cale_imagine )            
    }
}

initImagini();


function compileazaScss(caleScss, caleCss) {
    console.log("cale:", caleCss);

    if (!caleCss) {
        let numeFisExt = path.basename(caleScss);
        let numeFis = numeFisExt.split(".")[0]; // "a.scss" -> ["a","scss"]
        caleCss = numeFis + ".css";
    }

    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss);

    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss);

    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup, { recursive: true });
    }

    // At this point, we have absolute paths in caleScss and caleCss

    // TO DO

    let numeFisCss = path.basename(caleCss);
    if (fs.existsSync(caleCss)) {
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css", numeFisCss)); // +(new Date()).getTime()
    }

    rez = sass.compile(caleScss, { "sourceMap": true });
    fs.writeFileSync(caleCss, rez.css);
    //console.log("Compilare SCSS",rez);
}

// compileazaScss("a.scss");

vFisiere = fs.readdirSync(obGlobal.folderScss);
for (let numeFis of vFisiere) {
    if (path.extname(numeFis) == ".scss") {
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
    console.log(eveniment, numeFis);
    if (eveniment == "change" || eveniment == "rename") {
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }
});

initErori();
app.listen(8080);
console.log("Serverul a pornit");