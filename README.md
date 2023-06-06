# InfoVis
Primo progetto di Visualizzazione delle Informazioni di Davide Molitierno. 

## Obiettivo
Crea un file json con dei dati trivariati: ci sono 10 data-case e ogni data-case ha tre variabili quantitative, tutte positive. Prima disegna questo dataset tramite uno bubble chart (una serie di cerchi su un piano) in cui la prima variabile quantitativa v1 è utilizzata per le x e la seconda variabile quantitativa v2 è utilizzata per le y e la terza variabile quantitativa v3 è utilizzata per la grandezza del cerchio. Facendo click con il pulsante sinistro del mouse sull'asse delle x o delle y, supponi quello delle x, la variabile quantitativa utilizzata per la grandezza del cerchio (in questo momento la terza variabile quantitativa v3) prende il posto della variabile quantitativa utilizzata in quell'asse, supponi v1. Continuando a fare click sugli assi le variabili si scambiano ancora di ruolo con la stessa regola. Fai in modo che le transizioni siano progressive e non a salti. Usa le scale di D3.js per mappare il dominio delle variabili (che è arbitrario) nel range dei valori che ti servono, che invece è determinato dalla tua interfaccia.

## Contenuto Repository
Questo repository contiene i seguenti elementi:
* [dataset](dataset/) contenente il file utilizzato per generare il dataset e il dataset stesso.
* [lib](lib/) contenente la libreria d3.js necessaria per il funzionamento dell'applicazione.
* [bubbleChart](bubbleChart/) contenente tutti i file utili realizzati per il progetto.
