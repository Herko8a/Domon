// Domon HTML5, js, css
// Version 0.1 Septiembre 2015
// Héctor Ochoa
// Hercoka Games

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

$(document).ready(main);

var fichas;
var fondo;
var pos;
var teclado = {};
var statusJuego = 'Detenido';
var jugadorGanador = 0;


function main(){
	fondo = new Image();
	ftfichas = new Image();
	hzfichas = new Image();

	fondo.src = 'img/fondo.png';
	ftfichas.src = 'img/ftFichas.png'
	hzfichas.src = 'img/hzFichas.png'

	fondo.onload = function(){
		var intervalo = window.setInterval(frameLoop, 100);
		var intervalo2 = window.setInterval(detectaTecla, 120);
	}

	agregarEventosTeclado();
}

function agregarEventosTeclado(){

	agregarEventos(document, "keydown", function(e){
		teclado[e.keyCode] = true;
	});

	agregarEventos(document, "keyup", function(e){
		teclado[e.keyCode] = false;
	});

	function agregarEventos(elemento, nombreEvento, funcion){
		if(elemento.addEventListener)
		{
			elemento.addEventListener(nombreEvento, funcion, false);
		}
		else if(elemento.attachEvent){
			elemento.attachEvent(nombreEvento, funcion);
		}
	}
}

function frameLoop(){
	dibujaGame();
}


function dibujaGame(){
	dibjarFondo();

	switch (statusJuego)
	{
		case 'Detenido':
			dibujaInicioJuego();
			break;
		case 'Jugando':
			fichas.dibujarFichas();
			dibujaDatos();
			dibujaPartida();
			break;
		case 'JuagoTerminadoGanador':
			dibujaFinJuegoGanador();
			break;
		case 'JuegoCerrado':
			dibujaJuegoCerrado();
			break;
	}
}

function detectaTecla(){
	// F2
	if ((statusJuego == 'Detenido') || 
		(statusJuego == 'JuagoTerminadoGanador') ||
		(statusJuego == 'JuegoCerrado'))
	{
		if (teclado[113]) {
			iniciarJuego();
			statusJuego = 'Jugando';
			fichas.calculaSiguienteTurno();
		}
	}
	// F4
	else if (statusJuego == 'Jugando')
	{
		if (teclado[115]) {
			fichas.calculaSiguienteTurno();
		}
	}
}

function iniciarJuego(){
	fichas = Fichas();
	fichas.generarFichas();
	fichas.reparteFichas();
}

function dibjarFondo(){
	ctx.drawImage(fondo, 0, 0);
}

function dibujaInicioJuego(){
	var mensaje = 'Presiona F2 para iniciar.'
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.font = '.75em Verdana';
	ctx.fillText(mensaje, 325, 200);
	ctx.restore();
}

function dibujaFinJuegoGanador(){
	var mensaje1 = 'Gano el jugador ' + jugadorGanador;
	var mensaje2 = 'Presiona F2 para iniciar.'
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.font = '.75em Verdana';
	ctx.fillText(mensaje1, 340, 200);
	ctx.fillText(mensaje2, 325, 220);
	ctx.restore();	
}

function dibujaJuegoCerrado(){
	var mensaje1 = 'El juego quedo cerrado sin un ganador';
	var mensaje2 = 'Presiona F2 para iniciar.'
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.font = '.75em Verdana';
	ctx.fillText(mensaje1, 300, 200);
	ctx.fillText(mensaje2, 325, 220);
	ctx.restore();	
}

function dibujaDatos(){
	var mensaje1 = 'Turno: ' + fichas.tirada;
	var mensaje2 = 'Turno Jugador: ' + fichas.turnoJugador;
	var mensaje3 = '[' + fichas.lado2 + ':' + fichas.lado1 + ']';

	ctx.save();
	ctx.fillStyle = 'white';
	ctx.font = '.75em Verdana';
	ctx.fillText(mensaje1, 610, 430);
	ctx.fillText(mensaje2, 610, 445);
	ctx.fillText(mensaje3, 610, 460);
	ctx.restore();
}

function dibujaPartida(){
	pos = {
		pxD: 390,
		pyD: 185,
		dirD: 'H',
		pxI: 390,
		pyI: 185,
		dirI: 'H'
	};


	lstFT = fichas.fichas.filter(function(ficha){
		return ficha.turno != 0;
	});

	lstFT.sort(function(a, b){
		return ((b['turno']-a['turno']) * -1);
	});

	for (var i = 0; i < lstFT.length; i++) {
		var ficha = lstFT[i];
		dibujaTuplaTab(ficha);
	};

}

function dibujaTuplaTab(ficha){
	var lng = 20;
	var lngImg = 40;
	var lngEsp = 2;
	var px1;
	var py1;
	var px2;
	var py2;	
	var imgSel;

	if (ficha.tipoFicha == 1) {imgSel = hzfichas;}
	else {imgSel = ftfichas;}

	if (ficha.lado == 'C')
	{
		px1 = pos.pxD;
		py1 = pos.pyD - 10;
		px2 = pos.pxD;
		py2 = pos.pyD + 10;
		pos.pxD += (lng + lngEsp);
		pos.pxI -= ((lng * 2) + lngEsp);
	}
	else if (ficha.lado == 'D')
	{
		if (ficha.tipoFicha == 1)
		{
			px1 = pos.pxD;
			py1 = pos.pyD;
			px2 = (pos.pxD + lng);
			py2 = pos.pyD;
			pos.pxD += ((lng * 2) + lngEsp);
		}
		else
		{
			px1 = pos.pxD;
			py1 = pos.pyD - 10;
			px2 = pos.pxD;
			py2 = pos.pyD + 10;
			pos.pxD += (lng + lngEsp);
		}		
	}
	else if (ficha.lado == 'I')
	{
		if (ficha.tipoFicha == 1)
		{
			px1 = pos.pxI;
			py1 = pos.pyI;
			px2 = (pos.pxI + lng);
			py2 = pos.pyI;			
			pos.pxI -= ((lng * 2) + lngEsp);
		}
		else
		{
			pos.pxI += lng;
			px1 = pos.pxI;
			py1 = pos.pyI - 10;
			px2 = pos.pxI;
			py2 = pos.pyI + 10;
			pos.pxI -= ((lng * 2)  + lngEsp);
		}			
	}

	ctx.drawImage(imgSel, (lngImg * ficha.valor1), 0, lngImg, lngImg, px1, py1, lng, lng);
	ctx.drawImage(imgSel, (lngImg * ficha.valor2), 0, lngImg, lngImg, px2, py2, lng, lng);
}


/***********************************************************************
  Funciones Basicas
************************************************************************/

function Fichas()
{
	return {
		tirada: 1,
		turnoJugador: 0,
		lado1: 0,
		lado2: 0,
		fichas: [],
		calculaSiguienteTurno: function(){

			if (this.tirada == 1)
			{
				lstFJ1 = this.fichas.filter(function(ficha){
					return (ficha.valor1 == 6 && ficha.valor2 == 6);
				});

				this.turnoJugador = lstFJ1[0].owner;
				this.jugadorAutomatico();
			}
			else
			{

				do
				{
					var vueltas = 0;
					this.turnoJugador++;
					if (this.turnoJugador > 4){
						this.turnoJugador = 1;
						vueltas++;
						if (vueltas>2) 
						{
							statusJuego = 'JuegoCerrado';
							jugadorGanador = 0;
							return;
						}
					}

					var NoJug = this.turnoJugador;
					var L1 = this.lado1;
					var L2 = this.lado2;

					lstNext = this.fichas.filter(function(ficha){
						return	(
									(ficha.owner == NoJug) &&
									(
										(ficha.valor1 == L1 || ficha.valor2 == L1) ||
										(ficha.valor1 == L2 || ficha.valor2 == L2)
									)
								);
					});
				}
				while (lstNext.length == 0);
				this.jugadorAutomatico();
			}

		},
		jugadorAutomatico: function()
		{

			if (this.tirada == 1)
			{
				lstFJ1 = this.fichas.filter(function(ficha){
					return (ficha.valor1 == 6 && ficha.valor2 == 6);
				});

				lstFJ1[0].turno = 1;
				lstFJ1[0].owner = 5;
				lstFJ1[0].lado = 'C';
				this.lado1 = 6;
				this.lado2 = 6;
				this.tirada++;
			}
			else
			{

				var NoJug = this.turnoJugador;
				var L1 = this.lado1;
				var L2 = this.lado2;

				lstNext = this.fichas.filter(function(ficha){
					return	(
								(ficha.owner == NoJug) &&
								(
									(ficha.valor1 == L1 || ficha.valor2 == L1) ||
									(ficha.valor1 == L2 || ficha.valor2 == L2)
								)
							);
				});

				var f = Math.floor((Math.random() * lstNext.length) + 1) -1;
				lstNext[f].turno = this.tirada;
				lstNext[f].owner = 5;
				lstNext[f].lado = (	(lstNext[f].valor1 ==L1) ||
								   		(lstNext[f].valor2 ==L1)
								 	  ) ? 'D': 'I';

				if ((lstNext[f].lado == 'D') && (lstNext[f].tipoFicha == 1) && (L1 == lstNext[f].valor2))
				{
					var tmp = lstNext[f].valor2;
					lstNext[f].valor2 = lstNext[f].valor1;
					lstNext[f].valor1 = tmp;
				}

				if ((lstNext[f].lado == 'I') && (lstNext[f].tipoFicha == 1) && (L2 == lstNext[f].valor1))
				{
					var tmp = lstNext[f].valor1;
					lstNext[f].valor1 = lstNext[f].valor2;
					lstNext[f].valor2 = tmp;
				}


				if (lstNext[f].lado == 'D'){
					this.lado1 = lstNext[f].valor2;
				}
				else if (lstNext[f].lado == 'I'){
					this.lado2 = lstNext[f].valor1;
				}

				this.tirada++;
			}

			for (var i = 1; i <= 4 ; i++) {
				
				var lstJ = this.fichas.filter(function(ficha){
					return ficha.owner == i;
				});

				if (lstJ.length == 0)
				{
					jugadorGanador = i;
					statusJuego = 'JuagoTerminadoGanador';
					return;
				}
			};		

		},
		generarFichas: function(){
			var cnt = 0;
			for (var i = 0; i < 7; i++) {
				for (var j = i; j < 7; j++) {
					
					cnt++;
					var tf = (j==i) ? 2 : 1;
					var ficha = this.agregaFicha(cnt, i, j, tf, 0);
					this.fichas.push(ficha);
				};
			};
		},
		agregaFicha: function(Id, Val1, Val2, TipoFicha, Own)
		{
			return {
				id: Id,
				turno: 0,
				valor1: Val1,
				valor2: Val2,
				tipoFicha: TipoFicha,
				owner: Own,
				lado: ''
			}
		},
		reparteFichas: function(){
			for (var i = this.fichas.length - 1; i >= 0; i--) {
				var jd;

				do{
					jd = Math.floor((Math.random() * 4) + 1);
					lstFichas = this.fichas.filter(function(ficha){
						return ficha.owner == jd;
					});
				}
				while (lstFichas.length >= 7)
					
				this.fichas[i].owner = jd;
			
			};

			this.fichas.sort(function(a, b){
				return a.owner-b.owner;
			});
		},
		dibujarFichas: function(){

			for (var i=1; i<=5 ; i++) {
				var lstFichas;

				if (i < 5)
				{
					lstFichas = this.fichas.filter(function(ficha){
						return ficha.owner == i;
					});
				}
				else if (i == 5)
				{
					lstFichas = this.fichas.filter(function(ficha){
						return ficha.owner == 5;
					});

					lstFichas.sort(function(a, b){
						return b['turno']-a['turno'];
					});
				}

				for (var j = 0; j<lstFichas.length; j++) {
					var ficha = lstFichas[j];
					var mensaje = '';
					var posH = 300 + ((i-1) * 85);
					var PosVIni = i<5 ? 240: 60;
					var posV = PosVIni + ((j+1) * 20);

					if (i==5){
						mensaje += 'T:' + ficha.turno;
					}
					mensaje +=' J:' + ficha.owner + ':[' + ficha.valor1 + ':' + ficha.valor2 + ']';
					if (i==5){
						mensaje += ' ' + ficha.lado;
					}

					ctx.save();
					ctx.fillStyle = 'black';
					ctx.font = '.75em Verdana';
					ctx.fillText(mensaje, posH, posV);
					ctx.restore();

				};

			};

			// Dibuja Jugador Principal

			var lstFJ1 = this.fichas.filter(function(ficha){
				return ficha.owner == 1;
			});

			for (var i = lstFJ1.length-1; i>=0; i--) 
			{
				var ficha = lstFJ1[i];
				this.dibujaFicha(ficha, 20 + (40 * i), 420);
			};

			// Dibuja Jugador Dos
			var lstFJ2 = this.fichas.filter(function(ficha){
				return ficha.owner == 2;
			});

			for (var i = lstFJ2.length-1; i>=0; i--) 
			{
				ctx.drawImage(ftfichas, 0, 0, 40, 40, 770, 60 + (40 * i), 10, 30);	
			};

			// Dibuja Jugador Tres
			var lstFJ3 = this.fichas.filter(function(ficha){
				return ficha.owner == 3;
			});			

			for (var i = lstFJ3.length-1; i>=0; i--) 
			{
				ctx.drawImage(ftfichas, 0, 0, 40, 40, 60 + (40 * i), 20, 30, 10);	
			};			

			// Dibuja Jugador Cuatro
			var lstFJ4 = this.fichas.filter(function(ficha){
				return ficha.owner == 2;
			});

			for (var i = lstFJ4.length-1; i>=0; i--) 
			{
				ctx.drawImage(ftfichas, 0, 0, 40, 40, 20, 60 + (40 * i), 10, 30);	
			};

		},
		dibujaFicha: function(ficha, px, py)
		{
			this.dibujaValor(ficha.valor1, px, py);
			this.dibujaValor(ficha.valor2, px, py+30);
		},
		dibujaValor: function(Valor, px, py)
		{
			var sx = (Valor * 40);
			ctx.drawImage(ftfichas, sx, 0, 40, 40, px, py, 30, 30);
		}		
	}
}



