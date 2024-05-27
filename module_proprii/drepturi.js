
/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe  pagina cu tabelul de utilizatori.
 @property {Symbol} gestionareUtilizatori Dreptul de a gestiona utilizatori, schimbarea parolei, a emailului etc...
 @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator
 @property {Symbol} cumparareProduse Dreptul de a cumpara
 @property {Symbol} adaugareOferte Dreptul de a adauga oferte
 @property {Symbol} adaugareProduse Dreptul de a adauga oferte
 @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari
 */


/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */
const Drepturi = {
	vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
	gestionareUtilizatori: Symbol("gestionareUtilizatori"),
	stergereUtilizatori: Symbol("stergereUtilizatori"),
	cumparareProduse: Symbol("cumparareProduse"),
	adaugareOferte: Symbol("adaugareOferte"),
	adaugareProduse: Symbol("adaugareProduse"),
	vizualizareGrafice: Symbol("vizualizareGrafice")
}

module.exports=Drepturi;