export interface Content {
  message: string;
  author: string;
  solution: string | null;
  exercise: boolean;
}


export const bookContent: Content[] = [
  {
    message: 'Las hadas leen el presente sobre las aguas quietas, en los remansos de los ríos.',
    author: 'Luis',
    solution: null,
    exercise: false
  },
  {
    message: 'Leen el futuro, en primavera, sobre los pétalos de las amapolas.',
    author: 'Luis',
    solution: null,
    exercise: false
  },
  {
    message: 'Y en otoño, descifran el porvenir sobre las primeras gotas de rocío, agrandándolas con una enorme lupa a través de la cual las gotas parecen lagunas de esperanza.',
    author: 'Luis',
    solution: null,
    exercise: false
  },
  {
    message: 'Pero Braillinda era ciega',
    author: 'Luis',
    solution: null,
    exercise: false
  },
  {
    message: '¡Fantástico! -se alegró Braillinda. Y enseguida preguntó-: ¿Y cómo será la «b»? A lo que Luis respondió que debajo de la "a" colocarían otro puntito.',
    author: 'Luis',
    solution: null,
    exercise: false
  },
  {
    message: 'Así: <BRAILLE>ba</BRAILLE> y de esta manera <BRAILLE>a</BRAILLE>',
    author: 'Luis',
    solution: null,
    exercise: false
  },
  {
    message: '¡¡Qué fácil! -exclamó Braillinda, y agregó-: Ya puedo escribir',
    author: 'Luis',
    solution: null,
    exercise: false
  },
  {
    message: '<BRAILLE>BABA</BRAILLE>',
    author: 'Tu turno',
    solution: 'baba',
    exercise: true
  },

  {
    message: 'Luis le explicó entonces que ahora iban a inventar la "ele", agregándole otro puntito a la «b»:',
    author: 'Narraor',
    solution: null,
    exercise: false
  },
];
