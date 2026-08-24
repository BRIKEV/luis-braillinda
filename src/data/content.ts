/**
 * The story, one entry per page.
 *
 * Everything a page needs is on its own entry — the line, who says it, where it
 * happens and who is on stage. Nothing is inherited from the entry before it, so
 * you can read any single entry and know exactly what the reader sees. That
 * costs some repetition, which is the deliberate trade: inserting a line here
 * can never shift the staging of the lines after it.
 *
 * `page` in the URL is a 1-based index into this array.
 */

/** The three painted backdrops in `src/images/backgrounds`. */
export type Backdrop = "meadow" | "paris" | "workshop";

/** Characters with sprites in `src/images/characters`. */
export type Who = "braillinda" | "luis" | "abuela";

/** The expressions each character actually has art for. */
export interface ExpressionOf {
  braillinda: "curious" | "delighted" | "cross" | "wistful";
  luis: "explaining" | "pleased" | "asleep" | "surprised";
  abuela: "thoughtful" | "encouraging";
}

/* Pairing the character with their own expressions means `luisAs: "cross"`
   fails to compile — "cross" is art Braillinda has and Luis does not. A flat
   union of every expression would accept it and quietly render nothing. */
type LeftCast =
  | { left: null; leftAs?: never }
  | { left: "luis"; leftAs?: ExpressionOf["luis"] }
  | { left: "abuela"; leftAs?: ExpressionOf["abuela"] }
  | { left: "braillinda"; leftAs?: ExpressionOf["braillinda"] };

type RightCast =
  | { right: null; rightAs?: never }
  | { right: "luis"; rightAs?: ExpressionOf["luis"] }
  | { right: "abuela"; rightAs?: ExpressionOf["abuela"] }
  | { right: "braillinda"; rightAs?: ExpressionOf["braillinda"] };

interface Line {
  /** Shown as the speaker chip. "Narrador" gets none — narration is a
   *  different register, not a character with a name tag. */
  author: "Narrador" | "Braillinda" | "Luis" | "Abuela" | "Tu turno";

  /** Supports two inline forms: `<BRAILLE>texto</BRAILLE>` renders embossed
   *  cells, `<br>` a line break. Only letters the story has already taught. */
  message: string;

  /** Present means this page is an exercise and the reader must type this.
   *  Compared case-insensitively. */
  solution?: string;

  backdrop: Backdrop;
}

/** Stage left faces right, stage right faces left, so they face each other. */
export type Entry = Line & LeftCast & RightCast;

export const bookContent: Entry[] = [
  {
    author: "Narrador",
    message: "El hada Braillinda tenía unas alas hermosas.\nTransparente como gotas de rocío.\nSuaves y aterciopeladas como petalos de rosa.\nEl hada Braillinda estaba muy orgullosa de sus alas, pero no era feliz.\n Estaba muy triste porque no podía leer.",
    backdrop: "meadow",
    left: null,
    right: "braillinda",
    rightAs: "wistful",
  },
  {
    author: "Narrador",
    message: "Las hadas leen el presente sobre las aguas quietas, en los remansos de los ríos.\nLeen el futuro, en primavera, sobre los pétalos de las amapolas.\nY en otoño, descifran el porvenir sobre las primeras gotas de rocío, agrandándolas con una enorme lupa a través de la cual las gotas parecen lagunas de esperanza.\nPero Braillinda era ciega.",
    backdrop: "meadow",
    left: null,
    right: "braillinda",
    rightAs: "wistful",
  },
  {
    author: "Narrador",
    message: "Ella no podía leer en los remansos, ni sobre los pétalos de las amapolas, ni mirar a través de la lupa.\nTenía muchos amigos y todos la querían, pero ella sólo ansiaba una cosa: leer,algún día.",
    backdrop: "meadow",
    left: null,
    right: "braillinda",
    rightAs: "wistful",
  },
  {
    author: "Narrador",
    message: "Una tarde de otoño, su abuela le pidió que le ayudara a soplar las semillas de las amapolas.\nLas hadas se encargan de esta tarea para asegurarse de que tendrán amapolas para leer el futuro, cada año, sobre los pétalos de sus flores.\nBraillinda se ayudaba de sus manos. Buscaba a tientas las cápsulas repletas de pequeñas semillas, las acercaba a su boca y soplaba con todas sus fuerzas.",
    backdrop: "meadow",
    left: null,
    right: "braillinda",
  },
  {
    author: "Narrador",
    message: "De pronto, sus dedos se quedaron embelesados al notar que cada cápsula estaba rodeada de una corona de puntos que ella podía distinguir claramente con la yema de su dedo índice. Entonces exclamó, dirigiéndose a su abuela:",
    backdrop: "meadow",
    left: null,
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "Abuela. Mira qué bien se notan estos puntitos. Con puntos así yo podría leer.",
    backdrop: "meadow",
    left: "abuela",
    right: "braillinda",
  },
  {
    author: "Abuela",
    message: "Pero eso no son letras....",
    backdrop: "meadow",
    left: "abuela",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "En que piensas, abuela?",
    backdrop: "meadow",
    left: "abuela",
    right: "braillinda",
  },
  {
    author: "Abuela",
    message: "En que pienso? en un chico, llamado Luis, que vive en Francia y que es ciego, igual que tú.",
    backdrop: "meadow",
    left: "abuela",
    right: "braillinda",
  },
  {
    author: "Abuela",
    message: "Sé que hace tiempo que está pensando en crear un alfabeto con puntos en relieve. Quizás ese invento le sirva a él y también a ti. ¿Por qué no le haces una visita?",
    backdrop: "meadow",
    left: "abuela",
    right: "braillinda",
    leftAs: "encouraging",
  },
  {
    author: "Braillinda",
    message: "¿Y dónde lo encontraré?",
    backdrop: "meadow",
    left: "abuela",
    right: "braillinda",
  },
  {
    author: "Abuela",
    message: "En Paris, en el instituto de ciegos de la calle de Saint-Victor. Vete a verlo y ayúdale en todo lo que puedas. Estoy segura de que él te ayudará a ti también.",
    backdrop: "meadow",
    left: "abuela",
    right: "braillinda",
    leftAs: "encouraging",
  },
  {
    author: "Narrador",
    message: "Braillinda se despidió de su abuela y se fue a Paris. Al llegar al instituto de ciegos, preguntó por Luis. La señora que la atendió le dijo que estaba en el laboratorio.",
    backdrop: "paris",
    left: null,
    right: "braillinda",
  },
  {
    author: "Narrador",
    message: "Braillinda se acercó al laboratorio y vio a un chico, con una bata blanca, que estaba sentado en una mesa de trabajo durmiendo. Tenía un libro abierto delante de él y un lápiz en la mano. Braillinda se acercó a él y le dio un pequeño empujón.",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    leftAs: "asleep",
  },
  {
    author: "Braillinda",
    message: "¡Despierta, Luis!",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    leftAs: "asleep",
  },
  {
    author: "Luis",
    message: "¿Quién eres tú? ¿Qué haces aquí?",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    leftAs: "surprised",
  },
  {
    author: "Braillinda",
    message: "Soy Braillinda, la hada de las amapolas. He venido a aprender el alfabeto de relieve que estás inventando.",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "¿El alfabeto de relieve?",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Está bien, pero no es un alfabeto. Es un sistema de lectura y escritura para ciegos. Se llama Braille, como yo.",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "¿Y cómo se escribe?",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Ya lo he estado pensando. Se escribe con puntos en relieve, como los que tienes en las cápsulas de las amapolas.\n Y estoy seguro de que con 6 puntos nos bastará para escribir todas las letras del alfabeto.",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "¿Nada más que 6?",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "¡Son muy pocos! Yo quiero que se formen todas las letras",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "¿No te alcanza con 63 signos?",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "Sí... Creo que sí..",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "¡Venga! ¡Manos a la obra! La \"a\" la formaremos con un puntito en la parte superior izquierda de la celda. Así: <BRAILLE>a</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "¡Fantástico! ¿Y cómo será la «b»? ",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Así: <BRAILLE>b</BRAILLE> con otro puntito en la parte derecha.",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "¡¡Qué fácil! Ya puedo escribir",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    rightAs: "delighted",
  },
  {
    author: "Tu turno",
    message: "<BRAILLE>BABA</BRAILLE> ¿Qué es lo que he escrito?",
    solution: "baba",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Ahora vamos a inventar la \"ele\", agregándole otro puntito a la «b»: <BRAILLE>L</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Tu turno",
    message: "<BRAILLE>LA BABA</BRAILLE> ¿Qué es lo que a escrito?",
    solution: "la baba",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "Pone \"la baba\". No me gusta esa palabra. ¿Qué tal esta otra?",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Tu turno",
    message: "<BRAILLE>ALA</BRAILLE> ¿Qué es lo que a escrito?",
    solution: "ALA",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Pone \"ala\". Queda muy bien",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    leftAs: "pleased",
  },
  {
    author: "Braillinda",
    message: "Yo tengo 2 alas. Me gustaría poder escribir la palabra \"alas\".",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Será fácil. A la \"L\" le movemos puntito de arriba a la derecha <BRAILLE>L</BRAILLE> para la s <BRAILLE>S</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "¡Genial! Entonces ya puedo escribir esto:",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    rightAs: "delighted",
  },
  {
    author: "Tu turno",
    message: "<BRAILLE>LAS ALAS</BRAILLE> ¿Qué es lo que a escrito?",
    solution: "LAS ALAS",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "Ahora me gustaría inventar la letra \"d\".",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "La \"d\" será así: <BRAILLE>D</BRAILLE> ¡Queda muy bien!",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    leftAs: "pleased",
  },
  {
    author: "Luis",
    message: "Y si ahora le quito un punto me queda la \"e\". <BRAILLE>E</BRAILLE> Por lo que puedo escribir:",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Tu turno",
    message: "<BRAILLE>LAS ALAS DE</BRAILLE> ¿Qué es lo que a escrito?",
    solution: "LAS ALAS DE",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "O también puedo escribir:",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Tu turno",
    message: "<BRAILLE>DALE LAS ALAS A LALA</BRAILLE> ¿Qué es lo que a escrito?",
    solution: "DALE LAS ALAS A LALA",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "¡Yo no le doy mis alas a nadie!",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    rightAs: "cross",
  },
  {
    author: "Braillinda",
    message: "Mejor inventamos más letras ¡Quiero la \"o\"!",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Ya está la \"o\" será así: <BRAILLE>O</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "¡Fíjate qué guapa me quedó! Ahora puedo escribir:",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Tu turno",
    message: "<BRAILLE>EL SOL SALE AL ALBA EL LOBO LO SABE</BRAILLE> ¿Qué es lo que a escrito?",
    solution: "EL SOL SALE AL ALBA EL LOBO LO SABE",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "Esa frase no me gusta nada. ¡Yo quiero escribir que mis alas son bellas. Así que voy a inventar la «m»!",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    rightAs: "cross",
  },
  {
    author: "Narrador",
    message: "El hada, que era muy cascarrabias, le dio una patada al punto 5 de la \"o\" para subirlo a la posición del punto 4, para formar la \"m\" <BRAILLE>M</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    rightAs: "cross",
  },
  {
    author: "Luis",
    message: "¡Pobre punto! Lo dejaste temblando. Para consolarlo le agregaré el punto 5 y creo la \"n\" de esta manera: <BRAILLE>N</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "A mí la \"n\" me importa poco. Ahora escribiré: \"Mis alas son las más bellas del mundo\".",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    rightAs: "cross",
  },
  {
    author: "Luis",
    message: "No, no, no. No podrás.",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "¿Por qué no?",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Porque no tienes la letra \"i\" y la \"u\".",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "Bueno que esperas. Invéntalas tú.",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "La \"i\" será un espejo de la \"e\". Así: <BRAILLE>I</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "¿Y no me confundiré la una con la \"e\"?",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Pero no, mujer. La «e» se deja «caeeeeer». Así, ¿ves? <BRAILLE>E</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "En cambio a la «i» le gusta subiiiiir, así: <BRAILLE>I</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "En fin... Espero acordarme. La «u» mejor la invento yo. Cojo el punto 5 de la «o» y lo bajo al lugar del 6: <BRAILLE>U</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "Y yo por fin podré escribir:",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Tu turno",
    message: "<BRAILLE>MIS ALAS SON LAS MAS BELLAS DEL MUNDO</BRAILLE> ¿Qué es lo que a escrito?",
    solution: "MIS ALAS SON LAS MAS BELLAS DEL MUNDO",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Narrador",
    message: "Si has seguido con atención el desarrollo de todo lo explicado hasta ahora, podrás leer sin dificultad.<br><br>Repasemos. Hasta el momento conocemos<br> a - b - d - e - i - l - m - n - o - s - u<br><br><BRAILLE>A B D E I L M N O S U</BRAILLE><br>Recuerda que tienes el botón de diccionario en la parte superior para ayudarte a recordar los signos que ya conoces.",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Tu turno",
    message: "Repaso ¿Qué es lo que puedes leer?: <BRAILLE>MIS MANOS SON LINDAS MIS ALAS SON DE SEDA</BRAILLE>",
    solution: "MIS MANOS SON LINDAS MIS ALAS SON DE SEDA",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Narrador",
    message: "Vas genial. Sigamos con la historia y aprendamos más con Luis y Braillinda.",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "Hay algo que no me gusta Luis ¿Cómo haremos con las vocales acentuadas?",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },  {
    author: "Luis",
    message: "Ya lo pensé. Inventaremos nuevos signos. Ya me inventé la «a» tónica o acentuada:<br><BRAILLE>á</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Narrador",
    message: "Luis quiso saber si le gustaba el signo, pero el hada dijo que tenía muchos puntos y que le dejara a ella inventar la «í». Y propuso que fuera una «í» grandoota, así:<br><BRAILLE>í</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Tu turno",
    message: "Y enseguida escribió:<br><BRAILLE>mis alas son así las más bonitas del mundo</BRAILLE><br>¿Qué ha escrito el hada?",
    solution: "mis alas son así las más bonitas del mundo",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "¡Estoy harto de tus alas! ¿Sabes lo que te digo? Que mejor me dedico a inventar la «ú» acentuada. Y será así:<br><BRAILLE>ú</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "¡Qué manía de poner puntos!",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
    rightAs: "cross",
  },
  {
    author: "Luis",
    message: "Me gustan los signos gorditos, con muchos puntitos.",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "Ahora yo invento la «ó» acentuada. Y sólo llevará tres puntos, así:<br><BRAILLE>ó</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Braillinda",
    message: "Mira, mira qué bien quedan estas palabras:<br><BRAILLE>león</BRAILLE> 🦁<br><BRAILLE>salmón</BRAILLE> 🐟<br><BRAILLE>sillón</BRAILLE> 🛋️<br><BRAILLE>limón</BRAILLE> 🍋",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Sólo nos falta la «é» acentuada. Y la invento yo:<br><BRAILLE>é</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
  {
    author: "Luis",
    message: "Pensemos en palabras con «é» tónica:<br>bebé = <BRAILLE>bebé</BRAILLE><br>no sé = <BRAILLE>no sé</BRAILLE>",
    backdrop: "workshop",
    left: "luis",
    right: "braillinda",
  },
];
