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

function generaTablero() {

    //reseteaTablero(0);

    //Hago una limpieza inicial de los "hijos" del DIV matriz siempre que genero un Tablero para evitar que se creen varios uno debajo de otro
    var list = document.getElementById("matriz");
    list.removeChild(list.childNodes[0]);

    //Capturamos la dimension del Tablero dada por el usuario
    dimension = document.getElementById("dimension").value;

    //Llamamos primero a validarDatos para comprobar que el numero esta entre 4 y 10
    if (validarDatos()) {
        document.getElementById("datos").style.display = "none";
        document.getElementById("juego").style.display = "block";

        //Iniciamos todos los valores del Tablero a 0 para poder usarlos despues cuando juguemos
        reseteaTablero(dimension);

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
        // Una vez aqui seguimos a traves de la funcíon de "realizaJugada" asociada a cada boton
    }
}

function reseteaTablero(dim) {
    //Inicializamos el array Tablero todo con valores 0 en base a la dimension dada
    Tablero = new Array(dimension);
    for (var i = 0; i < dimension; i++) {
        Tablero[i] = new Array(dimension);
        for (var j = 0; j < dimension; j++) {
            Tablero[i][j] = "0";
        }
    }
    esTurno = "";
    jugadas = 0;
}

//Validamos que los datos que nos da el usuario son adecuados
function validarDatos() {
    if (dimension > 10 || dimension < 4) {
        window.alert("Numero incorrecto, teclee un numero que este entre 4 y 10");
        document.getElementById("dimension").value = "";
        reseteaTablero(1);
        return false;
    } else {
        return true;
    }
}

function volverEmpezar() {

    document.getElementById("datos").style.display = "block";
    document.getElementById("juego").style.display = "none";
    document.getElementById("dimension").value = "";

    //reseteamos el Tablero
    reseteaTablero(1);
}


function realizaJugada(boton, fila, columna) {
    //Para el botón que sido pulsado se comprueba si ya ha sido pulsado previamente
    //En caso de que se haya realizado una jugada en el btón pulsado se emite un mensaje de aviso
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
            window.alert("El jugador ${Turno} ha ganado");
            reseteaTablero();
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

//Esta función se invoca después de cada jugada para comprobar si el jugador del turno actual
//ha realizado una jugada ganadora. En cada jugada se conoce el botón que ha sido pulsado y
//únicamente se comprueban las posibles jugadas ganadoras en la fila, columna y diagonal implicadas
function compruebaJugada(fila, columna) {

    var jugadaGanadora = 0;

    //Recorre el array comprobando si la FILA implicada es jugada ganadora
    for (var i = 0; i < dimension; i++) {
        if (Tablero[fila][i] == esTurno) {
            //window.alert("Tablero [" + fila + "] [" + i + "]: " + Tablero[fila][i]);
            jugadaGanadora++;
            //window.alert("Valor JugadaGanadora Fila: " + jugadaGanadora);

            // si jugadaGanadora es 4 quiere decir que ha
            if (jugadaGanadora >= 4)
                return true;
        } else {
            jugadaGanadora = 0;
        }
    }

    //Recorre el array comprobando si la COLUMNA implicada es jugada ganadora
    for (var i = 0; i < dimension; i++) {
        if (Tablero[i][columna] == esTurno) {
            //window.alert("Tablero [" + i + "] [" + columna + "]: " + Tablero[i][columna]);
            jugadaGanadora++;
            //window.alert("Valor JugadaGanadora Columna: " + jugadaGanadora);

            // si jugadaGanadora es 4 quiere decir que ha
            if (jugadaGanadora >= 4)
                return true;
        } else {
            jugadaGanadora = 0;
        }
    }

    //comprueba las diagonales buscando una jugada ganadora
    //El botón pulsado está en la diagonal principal del array

    //window.alert("Fila: " + fila + " , Columna: " + columna);

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
        //window.alert("rest: " + rest);
        for (var i = 0; i < dimension; i++) {
            //window.alert("Tablero[" + i + "][" + (rest - i) + "]: ");
            if (Tablero[i][rest - i] == esTurno) {
                //window.alert("dentro if");
                jugadaGanadora++;
            } else
                jugadaGanadora = 0;

            if (jugadaGanadora >= 4)
                return true;
        }
    }

    //estamos en el cuadrante de DEBAJO de la Diagonal PRINCIPAL - LISTO
    if (fila > columna) {
        jugadaGanadora = 0;
        var resta = fila - columna;
        var j = 0;
        for (var i = resta; i < dimension; i++) {
            //window.alert("Tablero[" + i + "][" + j + "]: "); // +Tablero[i][i-1] + " ,esTurno: "+esTurno);
            if (Tablero[i][j] == esTurno) {
                jugadaGanadora++;
                if (jugadaGanadora >= 4)
                    return true;
            } else
                jugadaGanadora = 0;
            j++;
        }
    }

    //estamos en el cuadrante de ARRIBA de la diagonal PRINCIPAL --POR HACER

    if (fila < columna) {
        jugadaGanadora = 0;
        var resta2 = columna - fila;
        var i = 0;
        //window.alert("Fila - Columna: " + resta2);
        for (var j = resta2; j < dimension; j++) {
            //window.alert("Tablero[" + i + "][" + j + "]: "); // +Tablero[i][i-1] + " ,esTurno: "+esTurno);
            if (Tablero[i][j] == esTurno) {
                //window.alert("dentro if");
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
    //estamos en el cuadrante de ARRIBA de la diagonal SECUNDARIA --POR HACER
    if (total < dimension) {
        jugadaGanadora = 0;
        var j=0;
        for (var i = total; i >= 0; i--) {
            //window.alert("Tablero[" + i + "][" + j + "]: ");
            if (Tablero[i][j] == esTurno) {
                jugadaGanadora++;
                if (jugadaGanadora >= 4)
                    return true;
            } else
                jugadaGanadora = 0;
            j++;
        }
        
    }
    //estamos en el cuadrante de ABAJO de la diagonal SECUNDARIA --POR HACER
    if (total > dimension) {
        jugadaGanadora = 0;
        var i=dimension;

        // Falta explicar el porque de esta formula con la matriz
        var j = fila + columna - dimension + 1;

        for (var i = dimension-1; j < dimension; j++) {
            //window.alert("Tablero[" + i + "][" + j + "]: ");
            if (Tablero[i][j] == esTurno) {
                jugadaGanadora++;
                if (jugadaGanadora >= 4)
                    return true;
            } else
                jugadaGanadora = 0;
            i--;
        }
    }

   //si no se ha retornado antes es que no se ha encontrado ninguna juagada ganadora
   return false;
}
