/* ============================================================================
 * EVENTOS · 01 — INFANCIA, ESCUELA Y GUERRA (0–17 años)
 * Hambre de 1933, escuela, purgas vistas desde niño, la Gran Guerra Patria,
 * la posguerra y el primer trabajo. Aquí se forman los atributos iniciales.
 * ==========================================================================*/

addEvents([

/* ---------------------------------------------------------------- 1932-34 */
{
  id: 'child_famine_1933',
  title: 'El pan de la aldea',
  stamp: 'Comité de aldea · 1933',
  from: 1932, to: 1934,
  minAge: 4, maxAge: 7,
  cond: (s) => s.birthYear <= 1930,
  weight: 4,
  text: "Tienes cinco años. En la aldea de tu abuela, la colectivización dejó los graneros vacíos y el pan se hace con corteza y salvado. Tu madre raciona la harina y cuenta las cucharadas. En el invierno de 1933, algunas puertas de la calle ya no se abren.",
  options: [
    {
      label: 'Compartir tu ración con la viuda del vecino',
      sub: 'Ella ya no puede caminar hasta el pozo.',
      fx: { health: -6, morale: 12, blat: 6, flag: 'shared_bread' },
      outcome: "Le dejas media rebanada en el marco de la puerta. No os miráis. Esa primavera ella sigue viva; tú aprendes que la decencia también pesa."
    },
    {
      label: 'Guardar tu pan y no mirar al otro lado',
      sub: 'Sobrevivir primero.',
      fx: { health: 5, morale: -10 },
      outcome: "Comes despacio, mirando la pared. El hambre se va; algo más se queda. Años después todavía recordarás el ruido de esa puerta."
    },
    {
      label: 'Salir a rebuscar grano en los rastrojos',
      sub: 'Los mayores dicen que aún queda algo bajo la nieve.',
      fx: { health: -8, blat: 7, rubles: 15, intellect: 3 },
      outcome: "Vuelves con los bolsillos llenos de espigas y las manos cortadas. Tu abuela no pregunta de dónde salen. Compartes la mitad y te guardas la otra."
    }
  ]
},

/* ---------------------------------------------------------------- 4 años */
{
  id: 'child_kindergarten',
  title: 'El jardín de infancia',
  stamp: 'Comité de educación · Forma 3',
  minAge: 4, maxAge: 5,
  weight: 3,
  text: "El jardín de infancia del barrio huele a sopa de col y a jabón. La maestra cuelga un retrato junto a la ventana y os enseña una canción sobre el futuro. Los niños que no saben la letra se quedan sin el pan de media tarde.",
  options: [
    {
      label: 'Aprender la canción y recitarla delante de todos',
      fx: { loyalty: 8, intellect: 4, morale: 3 },
      outcome: "Cantas sin desafinar. La maestra te pone una estrella de papel en el pecho y te nombra ayudante de la semana."
    },
    {
      label: 'Escaparte al patio a jugar con los mayores',
      fx: { health: 6, morale: 7, loyalty: -4 },
      outcome: "Descubres un agujero en la valla y el barro del descampado. Vuelves con las rodillas sucias y sin estrella, pero con la tarde entera en la memoria."
    },
    {
      label: 'Quedarte callado y observar a la maestra',
      fx: { intellect: 6, loyalty: -2, morale: -2 },
      outcome: "Notas que la maestra mira la puerta antes de hablar de algunas cosas. Aprendes a leer a los adultos antes que los libros."
    }
  ]
},

/* ---------------------------------------------------------------- 7 años */
{
  id: 'child_school',
  title: 'Primer día de escuela',
  stamp: 'Escuela № 14 · Matrícula',
  minAge: 7, maxAge: 8,
  weight: 4,
  text: "Te dan un uniforme marrón que te queda grande y un cuaderno con las tapas grises. La maestra escribe la fecha en la pizarra y explica que la educación es gratuita y obligatoria. En la fila, un niño dice que su padre ha conseguido zapatos nuevos; otro no dice nada.",
  options: [
    {
      label: 'Sentarte en primera fila y estudiar cada lección',
      sub: 'El camino largo: el instituto.',
      fx: { intellect: 9, health: -2, loyalty: 2 },
      outcome: "Vuelves a casa con las manos manchadas de tinta y la lección sabida. Tu madre guarda el cuaderno como si fuera un documento."
    },
    {
      label: 'Hacerte amigo de los hijos de los funcionarios',
      fx: { blat: 8, intellect: 2, morale: -1 },
      outcome: "Compartes el bocadillo con el hijo del director de la fábrica. No sabes todavía que esa amistad valdrá más que muchas notas."
    },
    {
      label: 'Faltar a clase para ayudar en casa',
      fx: { health: 3, rubles: 20, intellect: -5, morale: 4, flag: 'school_absences' },
      outcome: "Tu madre necesita manos y el pan no espera. Aprendes a contar kilos y deudas antes que ecuaciones."
    }
  ]
},

/* ---------------------------------------------------------------- 10 años */
{
  id: 'child_pioneer',
  title: 'La insignia de pionero',
  stamp: 'Organización de Pioneros · Acta',
  minAge: 9, maxAge: 11,
  weight: 3,
  text: "En el patio forman a todos los niños de tu edad. Un hombre con traje gris explica que los pioneros son los hijos del país y que el deber empieza temprano. Te entregan un pañuelo rojo y una insignia con la llama. Detrás, dos maestras toman nota de quién levanta la mano.",
  options: [
    {
      label: 'Juráis en voz alta y dar un paso al frente',
      fx: { loyalty: 10, blat: 3, morale: 2 },
      outcome: "Tu voz suena más fuerte de lo que esperabas. La insignia pesa poco, pero notas las miradas de los adultos."
    },
    {
      label: 'Cumplir el acto sin creerte nada',
      fx: { intellect: 4, loyalty: -2, morale: 1 },
      outcome: "Repites la fórmula mirando al suelo. Nadie lo nota. Empiezas a separar lo que se dice de lo que se piensa."
    },
    {
      label: 'Preguntar por qué el pañuelo es rojo',
      fx: { intellect: 6, loyalty: -7, morale: 3, flag: 'curious_child' },
      outcome: "La maestra sonríe y no responde. Esa noche, tu padre te dice en la cocina que hay preguntas que es mejor hacer en voz baja."
    }
  ]
},

/* ---------------------------------------------------------------- 1941 */
{
  id: 'child_war_father',
  title: '22 de junio de 1941',
  stamp: 'Oficina de reclutamiento',
  year: 1941,
  minAge: 3, maxAge: 16,
  weight: 10,
  text: "La radio repite la palabra «voiná» entre chasquidos. Tu padre saca una maleta pequeña del armario y tu madre cose un nombre en el forro de tu chaqueta, por si acaso. En la calle, los hombres se abrazan en silencio. Alguien dice que durará dos semanas.",
  options: [
    {
      label: 'Ir con él hasta el camión de reclutamiento',
      fx: { morale: 6, loyalty: 5, health: -2, flag: 'saw_father_off' },
      outcome: "Le agarras la manga hasta que un oficial te separa. Él no se gira. Esa es la última imagen nítida que conservarás de su cara."
    },
    {
      label: 'Quedarte en casa cuidando de los pequeños',
      fx: { morale: -3, health: -3, blat: 4 },
      outcome: "Esa noche hierves sopa para tres con lo que hay. Tu madre no habla. Tú decides que alguien tiene que mantener la casa en pie."
    },
    {
      label: 'Correr a la fábrica a ofrecerte para lo que haga falta',
      fx: { loyalty: 7, health: -5, rubles: 30, flag: 'child_worker' },
      outcome: "El capataz te mira y te pone a recoger virutas. Desde ese día, el olor del aceite de máquina será el olor de la guerra."
    }
  ]
},

/* ---------------------------------------------------------------- 1941-42 */
{
  id: 'child_evacuation',
  title: 'El tren hacia el este',
  stamp: 'Comisariado de evacuación',
  from: 1941, to: 1942,
  minAge: 3, maxAge: 10,
  cond: (s) => s.birthYear >= 1934,
  weight: 8,
  text: "Cargan a las familias en vagones de mercancías. Tu madre lleva un hatillo con documentos, una olla y una foto. El tren avanza de noche sin luces, y en las estaciones la gente ofrece pan por una manta. No sabes cuánto va a durar el viaje.",
  options: [
    {
      label: 'Ayudar a tu madre a cuidar a los niños del vagón',
      fx: { morale: 8, health: -4, blat: 5, loyalty: 2 },
      outcome: "Repartes agua y cantas bajito para que los pequeños duerman. Una mujer te da un trozo de azúcar y te llama «pequeño soldado»."
    },
    {
      label: 'Guardar tus fuerzas y dormir todo lo posible',
      fx: { health: 5, morale: -4 },
      outcome: "Duermes contra la pared del vagón. Cuando despiertas, el paisaje ya no tiene iglesias y tu madre tiene los ojos rojos."
    },
    {
      label: 'Cambiar tu abrigo por comida en una parada',
      fx: { rubles: 40, health: -7, blat: 3, morale: -2 },
      outcome: "El hombre del andén te da pan duro y una lata. El invierno llegará antes que tu abrigo."
    }
  ]
},

/* ---------------------------------------------------------------- 1942-44 */
{
  id: 'child_war_work',
  title: 'Turno en la fábrica',
  stamp: 'Planta № 3 · Parte de trabajo',
  from: 1942, to: 1944,
  minAge: 9, maxAge: 16,
  weight: 6,
  text: "La fábrica produce casquillos y piezas de motor. Tienes turnos de diez horas y un trozo de pan con grasa. El capataz dice que cada pieza cuenta. En el taller hay carteles con nombres de los que se fueron al frente y no volvieron.",
  options: [
    {
      label: 'Cumplir el turno completo sin quejarte',
      fx: { loyalty: 8, health: -7, rubles: 45, flag: 'war_labor' },
      outcome: "Al final del mes te dan una ración extra y tu nombre aparece en el tablón. Duermes de pie en el tranvía."
    },
    {
      label: 'Aprender a manejar el torno con el viejo Stepán',
      fx: { intellect: 7, health: -4, blat: 4, flag: 'lathe' },
      outcome: "Stepán te enseña a leer el metal y a no tener miedo al ruido. «Un buen tornero nunca pasa hambre», dice, aunque él pase."
    },
    {
      label: 'Escurrirte para hacer recados en el mercado',
      fx: { rubles: 70, blat: 8, loyalty: -5, health: -2, flag: 'risk' },
      outcome: "Cambias jabón por patatas y tabaco por sal. Aprendes el precio real de las cosas, el que no aparece en los periódicos."
    }
  ]
},

/* ---------------------------------------------------------------- 1943-45 */
{
  id: 'child_war_letter',
  title: 'El sobre con sello militar',
  stamp: 'Correo de campaña',
  from: 1943, to: 1945,
  minAge: 6, maxAge: 17,
  cond: (s) => s.flags.saw_father_off || s.birthYear <= 1938,
  weight: 5,
  text: "El cartero deja un sobre arrugado. Dentro no hay carta: hay una hoja impresa que dice «desaparecido en combate» y una firma ilegible. Tu madre lo lee dos veces, lo dobla y lo guarda en el costurero. Luego vuelve a la cocina y enciende el fuego.",
  options: [
    {
      label: 'Abrazar a tu madre y no decir nada',
      fx: { morale: -6, health: 2, flag: 'father_dead' },
      outcome: "Os quedáis así mucho rato. No hay palabras que no suenen falsas. Esa noche ella duerme por primera vez en semanas."
    },
    {
      label: 'Guardar el sobre y jurar que averiguarás qué pasó',
      fx: { intellect: 5, morale: -10, flag: 'father_missing', loyalty: -3 },
      outcome: "Escondes el papel entre las páginas de un libro. Tardarás décadas en saber que la fosa común está a cuarenta kilómetros de la aldea."
    },
    {
      label: 'Ir a la oficina del comisariado a preguntar',
      fx: { loyalty: 3, morale: -4, blat: 3, health: -2 },
      outcome: "Un funcionario busca en un archivador y dice que no consta. Te da un formulario para solicitar información. Nunca recibirás respuesta."
    }
  ]
},

/* ---------------------------------------------------------------- 1944-46 */
{
  id: 'child_victory',
  title: 'El día de la victoria',
  stamp: 'Radio Moscú · 9 de mayo',
  year: 1945,
  minAge: 5, maxAge: 17,
  weight: 9,
  text: "A las dos de la mañana, la voz de la radio anuncia la capitulación de Alemania. La gente sale a la calle en pijama y abrigo, se abraza con desconocidos y llora. En el patio, alguien saca una botella escondida desde 1941. También hay silencios en los portales.",
  options: [
    {
      label: 'Salir a la calle y celebrar con el barrio',
      fx: { morale: 14, health: -2, loyalty: 4 },
      outcome: "Bailas con una vecina y gritas hasta quedarte sin voz. Por unas horas, el país entero parece haber sobrevivido."
    },
    {
      label: 'Buscar entre la multitud a los que volvieron',
      fx: { morale: 6, blat: 5, intellect: 2 },
      outcome: "Encuentras a dos vecinos con medallas y a uno sin pierna. Te cuentan cosas que no saldrán en el periódico."
    },
    {
      label: 'Quedarte en casa, junto a la mesa vacía',
      fx: { morale: -5, health: 3, flag: 'quiet_victory' },
      outcome: "Escuchas los gritos desde la ventana. La silla de tu padre sigue en su sitio. La victoria también es una forma de duelo."
    }
  ]
},

/* ---------------------------------------------------------------- 12-13 */
{
  id: 'teen_hobby',
  title: 'El círculo de después de clase',
  stamp: 'Casa de pioneros · Inscripción',
  minAge: 12, maxAge: 13,
  weight: 3,
  text: "En la Casa de Pioneros hay tres carteles: un círculo de radio, una sección de boxeo y una biblioteca con libros aprobados. El instructor de radio dice que quien sepa montar una válvula nunca pasará hambre. El de boxeo dice que un hombre que aguanta un golpe aguanta un invierno.",
  options: [
    {
      label: 'Inscribirte en el círculo de radio',
      fx: { intellect: 9, health: -1, flag: 'radio_club' },
      outcome: "Aprendes a soldar y a escuchar ondas cortas. Una noche, girando el dial, oyes una emisora que habla de otro país. No lo comentas."
    },
    {
      label: 'Entrenar en la sección de boxeo',
      fx: { health: 9, morale: 5, intellect: -2, blat: 2 },
      outcome: "Vuelves a casa con la nariz hinchada y una seguridad nueva en los hombros. El instructor dice que tienes manos rápidas."
    },
    {
      label: 'Refugiarte en la biblioteca',
      fx: { intellect: 7, morale: 4, loyalty: -2 },
      outcome: "Lees novelas de aventuras y un manual de astronomía. La bibliotecaria te deja pasar al depósito si la ayudas a ordenar fichas."
    }
  ]
},

/* ---------------------------------------------------------------- 14-16 */
{
  id: 'teen_komsomol',
  title: 'El carné del Komsomol',
  stamp: 'Liga de la Juventud Comunista',
  minAge: 14, maxAge: 16,
  weight: 4,
  text: "El secretario del Komsomol te llama al despacho. Dice que tu expediente es bueno y que la juventud necesita gente seria. Un carné abre puertas en el instituto y en la fábrica; también significa reuniones, cuotas y miradas.",
  options: [
    {
      label: 'Firmar y comprometerte con las actividades',
      fx: { loyalty: 11, blat: 5, morale: -2, flag: 'komsomol' },
      outcome: "Recibes el carné y la primera tarea: organizar la colecta de papel usado. Descubres que la organización también sirve para conocer gente útil."
    },
    {
      label: 'Firmar sin implicarte demasiado',
      fx: { loyalty: 4, blat: 2, intellect: 2 },
      outcome: "Asistes a las reuniones y firmas lo que hay que firmar. Nadie te considera un problema; nadie te considera un aliado."
    },
    {
      label: 'Alegar que prefieres centrarte en los estudios',
      fx: { loyalty: -8, intellect: 6, morale: 4, flag: 'refused_komsomol' },
      outcome: "El secretario toma nota con una sonrisa fina. «Madurez», dice. Sabes que esa palabra no significa lo mismo para los dos."
    }
  ]
},

/* ---------------------------------------------------------------- 17 */
{
  id: 'teen_school_end',
  title: 'El último examen',
  stamp: 'Comisión de instrucción pública',
  age: 17,
  milestone: true,
  weight: 12,
  text: "Terminas la escuela con un certificado en la mano y tres caminos delante. El instituto promete una plaza si las notas alcanzan; la escuela técnica garantiza un oficio en tres años; la fábrica paga desde el primer mes. El comisario militar, en el pasillo, tiene otra lista.",
  options: [
    {
      label: 'Solicitar plaza en la universidad',
      sub: 'Requiere intelecto 55.',
      req: (s) => s.stats.intellect >= 55,
      reqText: 'Intelecto 55',
      fx: { intellect: 6, tier: 1, job: 'Estudiante', study: 5, flag: 'uni', loyalty: 2 },
      outcome: "Te aceptan en la facultad. Cinco años de beca exigua, apuntes prestados y un futuro que, por primera vez, parece depender de ti."
    },
    {
      label: 'Entrar en la escuela técnica',
      sub: 'Requiere intelecto 35. Tres años.',
      req: (s) => s.stats.intellect >= 35,
      reqText: 'Intelecto 35',
      fx: { intellect: 4, tier: 1, job: 'Estudiante técnico', study: 3, flag: 'tech', blat: 2 },
      outcome: "Eliges el torno y el plano. En tres años serás técnico, con delantal limpio y un sueldo algo mejor que el de tu padre."
    },
    {
      label: 'Empezar a trabajar en la fábrica',
      sub: 'Sueldo inmediato. La guerra también recluta.',
      fx: { tier: 2, job: JOBS[2], rubles: 120, health: -3, loyalty: 5, flag: 'factory' },
      outcome: "Te asignan a la línea de montaje. El primer sueldo lo entregas en casa; tu madre lo cuenta dos veces antes de guardarlo."
    },
    {
      label: 'Alistarte voluntario en el Ejército',
      sub: 'Solo hombres. Si hay guerra, irás al frente.',
      req: (s) => s.sex === 'hombre',
      reqText: 'Solo hombres',
      fx: { tier: 2, job: 'Soldado', health: 4, loyalty: 8, blat: 3, study: 2, flag: 'army', morale: 2 },
      outcome: "Firmas el alistamiento. El sargento te corta el pelo y te da una pala. Durante dos años, el país será un patio de instrucción."
    }
  ]
}

]);
