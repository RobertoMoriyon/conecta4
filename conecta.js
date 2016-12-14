//VARIABLES GLOBALES
//Se lleva la cuenta de las jugadas realizadas
var jugadas = 0;
//Para contabilizar los turnos
var esTurno;
var tno;
//Variable Global para la dimensión del tablero
var dimension;
//Definimos el Tablero
var Tablero;
// display del div de Juego a none para que no se muestre cuando se cargue la pagina
document.getElementById("juego").style.display = "none";

//FUNCIONES

//Validamos que los datos que nos da el usuario son adecuados
function validarDatos() {

    //miramos el valor del input para saber la dimensión de la matriz que quiere el usuario
    dimension = document.getElementById("dimension").value;

    if (dimension > 10 || dimension < 4) {
        window.alert("Numero incorrecto, teclee un numero que este entre 4 y 10");
        //Ponemos el valor a 'vacio' si el usuario se equivoca y asi puede teclear uno nuevo sin necesidad de borrar el anterior
        document.getElementById("dimension").value = "";
        return false;
    } else {
        //Si el numero esta bien, entonces tenemos que general el tablero
        generaTablero(dimension);
    }
}

function generaTablero(dim) {

    //Siempre que generamos un tablero hacemos un reseteo inicial
    reseteaTablero(dim);

    // Al generar el tablero ocultamos la parte de datos y nos quedamos solo con el tablero.
    document.getElementById("datos").style.display = "none";
    document.getElementById("juego").style.display = "block";

    //Miramos el Turno para ver quien empieza
    esTurno = document.getElementById("tur").value;

    //creamos primero el DIV donde meteremos los botones del tablero dentro del DIV matriz. Lo hago asi para despues poder eliminarlo cuando queramos
    var recipiente = document.getElementById("matriz");
    var div = document.createElement("div");
    div.setAttribute("id", "tablero");
    div.setAttribute("class", "tablero"); //pongo esta parte por si le doy formato mas adelante
    recipiente.appendChild(div);

    //Creamos la etiqueta P que nos ira mostrando el turno de quien juega. Al inicio pone el turno del seleccionado por el usuario
    tno = document.createElement("p");
    tno.setAttribute("id", "turno");
    tno.innerHTML = "TURNO: " + esTurno;
    div.appendChild(tno);

    //Insertamos la matriz de botones en función de la dimensión dada por el usuario
    for (var i = 0; i < dimension; i++) {
        for (var j = 0; j < dimension; j++) {
            var btn = document.createElement("INPUT");
            btn.setAttribute("type", "button");
            btn.setAttribute("class", "boton"); // le damos formato al boton con css y la hoja de estilos.css
            btn.setAttribute("onclick", "realizaJugada(this," + i + "," + j + ")");
            div.appendChild(btn);
        }
        var mybr = document.createElement("br");
        div.appendChild(mybr);
    }

}

function reseteaTablero(dim) {

    //Hago una limpieza inicial de los "hijos" del DIV matriz siempre que genero un Tablero para evitar que se creen varios uno debajo de otro
    var list = document.getElementById("matriz");
    list.removeChild(list.childNodes[0]);

    //Inicializamos el array Tablero todo con valores 0 en base a la dimension dada
    Tablero = new Array(dim);
    for (var i = 0; i < dim; i++) {
        Tablero[i] = new Array(dim);
        for (var j = 0; j < dim; j++) {
            Tablero[i][j] = "0";
        }
    }
    esTurno = "";
    jugadas = 0;

    document.getElementById("dimension").value = "";
}

function volverEmpezar() {

	//para volver a empezar, ocultamos la parte de juego y nos quedamos con los datos.
    document.getElementById("datos").style.display = "block";
    document.getElementById("juego").style.display = "none";
    document.getElementById("dimension").value = "";
}

function realizaJugada(boton, fila, columna){
	//window.alert("Fila: " + fila + " Columna: " + columna);
	if (boton.value != "")
        window.alert("Esta casilla ya ha sido utilizada. No es posible hacer esta jugada");
   	//Se realiza la jugada
    else {
        boton.value = esTurno; //realiza la jugada
        Tablero[fila][columna] = esTurno; //actualiza la jugada en el array
        jugadas++; //Actualiza el número de jugadas realizadas

        //Miramos si es una jugada ganadora
        if (!compruebaJugada(fila, columna)) {
            //cambia el turno para el siguiente jugador si no ha habido jugada ganadora
            cambiaTurno();
        } else {
            window.alert("El jugador "+ esTurno+" ha ganado");
            return 0; //Finaliza
        }
    }
}

function cambiaTurno() {
    if (esTurno == "X") {
        esTurno = "O";
        tno.innerHTML = "TURNO: " + esTurno;
    } else {
        esTurno = "X";
        tno.innerHTML = "TURNO: " + esTurno;
    }
}

function compruebaJugada(fila, columna) {
	//contabilizamos las jugadas ganadoras y en tablas metemos el total de posibles jugadas para ver cuando es tablas.
	var jugadaGanadora = 0;
	var tablas = dimension * dimension;

	//Recorre el array comprobando si la FILA implicada es jugada ganadora
    for (var i = 0; i < dimension; i++) {
        if (Tablero[fila][i] == esTurno) {
            jugadaGanadora++;
            if (jugadaGanadora >= 4)
                return true;
        } else {
            jugadaGanadora = 0;
        }
    }

    //Recorre el array comprobando si la COLUMNA implicada es jugada ganadora
    for (var i = 0; i < dimension; i++) {
        if (Tablero[i][columna] == esTurno) {
            jugadaGanadora++;
            if (jugadaGanadora >= 4)
                return true;
        } else {
            jugadaGanadora = 0;
        }
    }

    //comprueba las DIAGONALES buscando una jugada ganadora
    //DIAGONAL PRINCIPAL
    if (fila == columna) {
        jugadaGanadora = 0;
        for (var i = 0; i < dimension; i++) {
            if (Tablero[i][i] == esTurno) {
                jugadaGanadora++;
            } else
                jugadaGanadora = 0;
            if (jugadaGanadora >= 4)
                return true;
        }
    }

    //DIAGONAL SECUNDARIA
    var rest = dimension - 1;
    if (fila + columna == rest) {
        jugadaGanadora = 0;
        for (var i = 0; i < dimension; i++) {
            if (Tablero[i][rest - i] == esTurno) {
                jugadaGanadora++;
            } else
                jugadaGanadora = 0;
            if (jugadaGanadora >= 4)
                return true;
        }
    }

    //estamos en el cuadrante de DEBAJO de la Diagonal PRINCIPAL
    if (fila > columna) {
        jugadaGanadora = 0;
        var resta = fila - columna;
        var j = 0;
        for (var i = resta; i < dimension; i++) {
            if (Tablero[i][j] == esTurno) {
                jugadaGanadora++;
                if (jugadaGanadora >= 4)
                    return true;
            } else
                jugadaGanadora = 0;
            j++;
        }
    }

    //estamos en el cuadrante de ARRIBA de la diagonal PRINCIPAL

    if (fila < columna) {
        jugadaGanadora = 0;
        var resta2 = columna - fila;
        var i = 0;
        for (var j = resta2; j < dimension; j++) {
            if (Tablero[i][j] == esTurno) {
                jugadaGanadora++;
                if (jugadaGanadora >= 4)
                    return true;
            } else
                jugadaGanadora = 0;
            i++;
        }
    }

    // DIAGONALES SECUNDARIAS SIN SER LA PRINCIPAL
    var total = fila + columna;
    //estamos en el cuadrante de ARRIBA de la diagonal SECUNDARIA 
    if (total < dimension) {
        jugadaGanadora = 0;
        var j=0;
        for (var i = total; i >= 0; i--) {
            if (Tablero[i][j] == esTurno) {
                jugadaGanadora++;
                if (jugadaGanadora >= 4)
                    return true;
            } else
                jugadaGanadora = 0;
            j++;
        }
    }

    //estamos en el cuadrante de ABAJO de la diagonal SECUNDARIA 
    if (total >= dimension) {
        jugadaGanadora = 0;
        var j = fila + columna - dimension+1;
        // vamos siempre desde dimension - 1 hasta (fila + columna - dimension + 1)
        for (var i = dimension-1; j < dimension; j++) {
            if (Tablero[i][j] == esTurno) {
                jugadaGanadora++;
                if (jugadaGanadora >= 4)
                    return true;
            } else
                jugadaGanadora = 0;
            i--;
        }
    }

	if (jugadas==tablas)
		window.alert("TABLAS");
	return false;
}