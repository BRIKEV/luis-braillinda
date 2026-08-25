/**
 * Who Louis Braille was — the chapter the source book closes with, plus the
 * dated summary the landing page shows.
 *
 * `chapter` is transcribed from pages 40-44 of
 * `sources/luis y braillinda te cuentan como es el braille1.pdf`, one string per
 * paragraph, one line per string so a paragraph is never split across a diff.
 * Two slips in the printed text are corrected here: it spells the village
 * "Coupvay" the second time, and writes "no se limita a una realizar una
 * modificación".
 */

/** A year the chapter states outright, and what happened in it. */
export interface Milestone {
  year: string;
  event: string;
}

/* Only years the chapter actually names. Louis lost his sight "a la edad de tres
   años" and the book gives no year for it, so that belongs in the prose above
   this list rather than as a date arithmetic invented from his birthday. */
export const timeline: Milestone[] = [
  { year: "1809", event: "Nace en Coupvray, a unos cuarenta kilómetros de París." },
  { year: "1819", event: "Entra interno en la escuela para ciegos de París, con diez años." },
  {
    year: "1821",
    event: "El capitán Barbier lleva a la escuela su «escritura nocturna»: doce puntos por signo.",
  },
  {
    year: "1827",
    event: "Publica su método. Seis puntos, y un alfabeto que además se puede escribir.",
  },
  { year: "1840", event: "El sistema braille se acepta oficialmente." },
  { year: "1852", event: "Muere en París, de tuberculosis, a los 43 años." },
  { year: "1878", event: "Un congreso internacional decide promoverlo en el mundo entero." },
];

/** The chapter itself, one string per paragraph. */
export const chapter: string[] = [
  "Louis Braille, el inventor del sistema de lectura y escritura que lleva su nombre, no nació ciego. A la edad de tres años pierde la vista en un accidente que ha sido contado de distinta manera por quienes se han ocupado de su biografía, dado que no existen documentos que nos informen fehacientemente del mismo.",
  "Su padre, Simón-René, era talabartero en el pueblo de Coupvray (distante unos 40 kilómetros al este de París). Se cuenta que un día, jugando en el taller familiar, Louis se clava una lezna en un ojo. Parece que la herida se infectó y, por simpatía, pierde también el otro ojo quedándose totalmente ciego, como ya dijimos a la edad de tres años.",
  "Se trataba de un chico vivaz e inteligente, que contó con un gran apoyo familiar (sorprendente para la época) lo que le permitió seguir desarrollando sus habilidades.",
  "Cuando Louis cuenta con ocho años, su padre consigue que el maestro del pueblo lo acepte en sus clases y allí demuestra sus dotes como alumno aunque sólo podía seguir las clases de forma oral.",
  "Más tarde, el maestro tiene noticias de que existe una escuela para ciegos en París. Como la familia no disponía de recursos, le consiguen una beca y es así como el 15 de febrero de 1819, a la edad de diez años, Louis parte de su pueblo natal para residir en el colegio como interno.",
  "En ese colegio, se enseñaba a leer con lo que se conoce como método Haüy, que consistía en imprimir en alto relieve y sobre un papel resistente, las letras comunes que usan las personas que ven. Aunque Louis aprendió rápidamente a leer con ese sistema, el mismo presentaba dos graves inconvenientes: en primer lugar, con él no se podía escribir y en segundo lugar, la lectura resultaba muy trabajosa, dado que era necesario utilizar tipos grandes para ser percibidos por el tacto y, su tamaño, entonces, requería el lento reconocimiento de cada letra antes de pasar a la siguiente.",
  "Un día del año 1821 se presenta en la escuela Charles Barbier de la Serré. Se trataba de un capitán de artillería del ejército de Luis XVIII quien sostiene haber creado un sistema que permite a los ciegos leer. El director del colegio, de entre todos los profesores y alumnos, convoca a Louis para que valore las posibilidades del invento de Barbier.",
  "La sorpresa y hasta el «mosqueo» del militar fueron, según parece, mayúsculos. Louis contaba con doce años de edad y, el capitán no estaba dispuesto a que su gran invento fuera juzgado y analizado por quien él consideraba un «mocoso».",
  "Louis, en cambio, se sintió maravillado. Sus dedos podían percibir perfectamente esos signos y, además, con ellos ¡se podía escribir!",
  "El sistema de Barbier, que él denominaba con dos nombres (escritura nocturna o sonografía), consistía en unos signos formados por la combinación de doce puntos, distribuidos en dos filas verticales de seis cada una. La presencia o ausencia de puntos generaba cada una de las grafías.",
  "Barbier lo desarrolló para que los soldados pudieran comunicarse en la oscuridad y de ahí el nombre de «escritura nocturna». Se podía escribir con una pauta y un punzón sobre un papel resistente y se leía con las yemas de los dedos.",
  "Presentaba dos graves inconvenientes rápidamente detectados por el joven Louis: los signos resultaban demasiado grandes, con lo cual no se podían percibir, en su totalidad, de una vez, con la yema de los dedos y, por otra parte, no constituía un alfabeto sino una «sonografía». Es decir, representaba los sonidos, pero no la ortografía de cada palabra.",
  "Louis aporta a ese mecanismo dos modificaciones esenciales: por un lado reduce su tamaño (de 12 a 6 puntos como máximo para cada signo, colocados en dos filas verticales de tres puntos cada una) y lo transforma o mejor dicho, inventa un alfabeto.",
  "El capitán Barbier, sólo al final de su vida, y a regañadientes, acepta dichas modificaciones.",
  "El propio Braille, al publicar el método, en el cual expone su sistema, en 1827, señala que se ha limitado a adaptar la sonografía de Barbier.",
  "Nosotros pensamos que Louis era demasiado modesto (que lo era, sin duda, además de sufrir muchas presiones) porque no se limita a realizar una modificación sino que crea algo nuevo partiendo de una idea.",
  "Y no sólo inventa el alfabeto: lo adapta a las matemáticas y a las ciencias, desarrolla un sistema de abreviaturas y, lo que resulta más interesante, lo adecúa también para la música. La llamada «musicografía» braille es, realmente, muy inteligente ya que transforma la escritura musical, de vertical, en otra horizontal y consecutiva. Hasta entonces, las personas ciegas debían aprender las partituras de memoria y exclusivamente «de oído», ya que los intentos de Haüy por ponerla en relieve, resultaron (igual que hoy) infructuosos.",
  "El sistema braille y su inventor chocaron con múltiples actitudes de rechazo. En primer lugar del capitán Barbier que se negó, durante años a aceptar modificaciones, en segundo lugar de los seguidores de Haüy que no estaban dispuestos a cederle terreno y, en tercer lugar de las personas con vista que consideraban que el braille aislaba a los ciegos dado que ellos no podían leerlo (cosa que no es cierta, ya que cualquier persona que ve, a poco que se lo proponga, puede leerlo con la vista).",
  "Durante varios años, el propio Louis Braille y sus compañeros ciegos, lo utilizaron a escondidas dentro de los muros del Instituto, dado que llegó a estar prohibido.",
  "Braille, además, inventó una pauta para escribir con su sistema y un aparato llamado Rafígrafo (este último en colaboración con Foucault, otro ciego ilustre) por medio del cual se podían escribir las letras comunes con puntos en relieve y que les permitía comunicarse con las personas que ven.",
  "En el año 1840 se acepta oficialmente el sistema braille y, en 1878, un congreso internacional decide promoverlo en el mundo entero al considerarlo el mejor sistema para el tacto.",
  "Louis Braille, que había nacido el 4 de enero de 1809, murió de tuberculosis en París, a la edad de 43 años y fue enterrado en Coupvray, su pueblo natal. Hoy día sus restos descansan en el Panteón de Hombres Ilustres no muy lejos del edificio (inaugurado en 1844) que aún ocupa el Instituto de Jóvenes Ciegos donde falleciera el 6 de enero de 1852.",
  "Su casa natal es un museo. También en su pueblo se ha erigido un monumento a su memoria y sus manos se conservan en una urna en el cementerio de Coupvray.",
];

/** How the book signs off, on its very last page. */
export const commemoration =
  "Edición conmemorativa del ciento cincuenta aniversario de la muerte de Louis Braille. " +
  "Madrid, mayo 2002.";
