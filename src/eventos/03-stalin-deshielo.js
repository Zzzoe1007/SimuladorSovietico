/* ============================================================================
 * EVENTOS · 03 — ERA DE STALIN Y DESHIELO (1922–1964)
 * Colectivización, purgas, guerra, muerte de Stalin, deshielo, espacio.
 * Fechas reales; los dilemas concretos son ficción documentada.
 * ==========================================================================*/

addEvents([

/* ================================ STALIN ================================ */

{
  id: 'stalin_1937_child',
  title: 'La furgoneta negra',
  stamp: 'NKVD · Orden de detención',
  from: 1937, to: 1938,
  minAge: 6, maxAge: 15,
  weight: 8,
  text: "Llaman a la puerta a las tres de la mañana. Dos hombres con abrigo de cuero preguntan por tu padre. Él se viste sin miraros, firma un papel y sube a una furgoneta negra. Tu madre corre tras el vehículo hasta la esquina. En el patio, las vecinas apagan las luces una a una.",
  options: [
    {
      label: 'Decir en la escuela que tu padre es un enemigo del pueblo',
      fx: { loyalty: 12, morale: -16, blat: -4, flag: 'family_repressed', flags: { renounced_father: true } },
      outcome: "La maestra te acaricia la cabeza y te sienta en primera fila. En casa, tu madre no te mira durante tres días. Has comprado seguridad con la única moneda que tenías."
    },
    {
      label: 'Guardar su foto y no hablar del tema',
      fx: { morale: -6, intellect: 4, loyalty: -4, flag: 'family_repressed' },
      outcome: "Escondes la foto entre las páginas de un atlas. Aprendes a decir «no lo sé» con una calma que te asusta."
    },
    {
      label: 'Ir a la comisaría a preguntar por él',
      fx: { loyalty: -8, morale: -4, health: -3, blat: 4, flag: 'family_repressed' },
      outcome: "Un funcionario te dice que no hay expediente y que no vuelvas. Una vecina te lleva de vuelta a casa. Tu madre te castiga sin cenar, pero esa noche duerme abrazada a ti."
    }
  ]
},

{
  id: 'stalin_1937_purge',
  title: 'La lista del taller',
  stamp: 'NKVD · Lista de depuración',
  from: 1936, to: 1938,
  minAge: 16, maxAge: 75,
  weight: 7,
  text: "El secretario del partido convoca una reunión extraordinaria. Sobre la mesa hay una lista con ocho nombres del taller; tres son compañeros tuyos. Se pide «apoyo del colectivo» para aprobar las detenciones. El que no firma, dicen, demuestra tener algo que ocultar.",
  options: [
    {
      label: 'Firmar la lista sin leerla entera',
      fx: { loyalty: 12, blat: 5, morale: -14, flag: 'signed_list' },
      outcome: "Firmas el tercero. Los tres hombres desaparecen esa semana. Uno de ellos te había prestado una herramienta que nunca devolviste."
    },
    {
      label: 'Advertir a uno de ellos esa misma noche',
      fx: { morale: 10, loyalty: -12, blat: 6, risk: 2, flag: 'warned_purge' },
      outcome: "Le avisas en la escalera. Huye a casa de un pariente en otra ciudad. La lista se aprueba igual. Meses después, alguien pregunta quién le avisó."
    },
    {
      label: 'Alegar que no conoces bien a esas personas',
      fx: { loyalty: -4, morale: -4, blat: -3, intellect: 2 },
      outcome: "El secretario toma nota de tu duda. No firmas, pero tampoco protestas. Los nombres se aprueban por unanimidad menos uno: el tuyo."
    }
  ]
},

{
  id: 'stalin_1939_pact',
  title: 'El pacto con Berlín',
  stamp: 'Pravda · 24 de agosto',
  year: 1939,
  minAge: 14, maxAge: 80,
  weight: 8,
  text: "Los periódicos publican la noticia con titulares grandes: la URSS y Alemania firman un pacto de no agresión. En la fábrica, algunos lo celebran como una jugada brillante; otros recuerdan los discursos contra el fascismo del año pasado. Nadie sabe qué decir en voz alta.",
  options: [
    {
      label: 'Defender el pacto como una jugada de paz',
      fx: { loyalty: 10, intellect: 2, morale: 2 },
      outcome: "Repites el argumento del periódico y te quedas tranquilo. En el fondo, no entiendes por qué los tanques alemanes están en Polonia."
    },
    {
      label: 'Preguntar en el taller qué significa para la guerra',
      fx: { intellect: 7, loyalty: -5, blat: 3, flag: 'skeptic' },
      outcome: "Un viejo obrero te dice en voz baja que los pactos se rompen. Dos años después, recordarás su cara."
    },
    {
      label: 'Callar y seguir trabajando',
      fx: { morale: -2, health: 1, loyalty: 1 },
      outcome: "No dices nada. El turno termina igual. En casa, tu padre escucha la radio con el volumen bajo."
    }
  ]
},

{
  id: 'stalin_1941_mobilization',
  title: 'La orden de movilización',
  stamp: 'Comisariado de Defensa',
  year: 1941,
  minAge: 17, maxAge: 40,
  weight: 12,
  text: "La guerra ha empezado de verdad. Tu oficina de reclutamiento funciona día y noche. Te dan dos horas para presentarte con una bolsa, una muda y la cartilla militar. En la plaza, las mujeres hacen cola para despedir a los hombres. El oficial dice que el enemigo está a menos de trescientos kilómetros.",
  options: [
    {
      label: 'Presentarte voluntario esa misma tarde',
      fx: { loyalty: 14, health: -6, morale: 6, flag: 'volunteered', army: true },
      outcome: "Te cortan el pelo, te dan un fusil de 1891 y te suben a un tren. Nadie te explica dónde está el frente. El tren avanza hacia el oeste."
    },
    {
      label: 'Esperar tu turno y despedirte de la familia',
      fx: { morale: 4, health: -2, loyalty: 4, flag: 'called_up', army: true },
      outcome: "Pasas dos días en casa. Tu madre cose un amuleto en el forro. Cuando llega la citación, ya no queda pan en la alacena."
    },
    {
      label: 'Buscar un destino en la retaguardia por medio del blat',
      sub: 'Requiere 30 de blat.',
      req: (s) => s.stats.blat >= 30,
      reqText: 'Blat 30',
      fx: { blat: -25, loyalty: -8, morale: -6, health: 2, risk: 1, flag: 'draft_dodger' },
      outcome: "Un conocido del comisariado te asigna a un almacén de intendencia. Tus vecinos van al frente; tú cuentas latas. Cada carta del frente te deja sin dormir."
    }
  ]
},

{
  id: 'stalin_1942_front',
  title: 'El frente, en invierno',
  stamp: 'Informe de unidad',
  from: 1942, to: 1944,
  minAge: 18, maxAge: 45,
  cond: (s) => s.flags.army || s.flags.volunteered,
  weight: 9,
  text: "La trinchera está a treinta metros de la línea alemana. Hay nieve, piojos y un teniente que no ha dormido en tres días. La orden es tomar una altura que no aparece en tu mapa. El sargento te mira y dice que mañana puede que no haya mañana.",
  options: [
    {
      label: 'Cumplir la orden y avanzar con tu escuadra',
      fx: { health: -14, loyalty: 12, morale: 5, item: 'medals', flag: 'combat_veteran' },
      outcome: "La altura se toma y se pierde dos veces. Sobrevives con metralla en el muslo y el nombre de dos amigos que no volvieron. Te dan una medalla que no sabes dónde guardar."
    },
    {
      label: 'Quedarte cubriendo el flanco con la ametralladora',
      fx: { health: -8, loyalty: 6, blat: 4, flag: 'combat_veteran' },
      outcome: "Disparas hasta que el cañón quema. La posición aguanta. Cuando llega el relevo, no recuerdas cuánto tiempo ha pasado."
    },
    {
      label: 'Simular una herida para salir del frente',
      fx: { health: -3, loyalty: -14, morale: -10, risk: 2, flag: 'self_inflicted' },
      outcome: "El médico de campaña no te cree, pero te evacua igual. En el hospital te llaman cobarde con la mirada. Nadie te lo dice en voz alta."
    }
  ]
},

{
  id: 'stalin_1945_victory',
  title: 'El 9 de mayo, otra vez',
  stamp: 'Orden del Comandante Supremo',
  year: 1945,
  minAge: 17, maxAge: 65,
  weight: 10,
  text: "La guerra termina en Europa. En Moscú hay fuegos artificiales y gente que llora en las plazas. En tu casa, la victoria se mezcla con las sillas vacías. El país ha perdido veintisiete millones de personas; tú conoces a varias por su nombre.",
  options: [
    {
      label: 'Brindar por los que volvieron y por los que no',
      fx: { morale: 10, health: -2, loyalty: 4, flag: 'victory_toast' },
      outcome: "Bebes de un vaso de hojalata. Nombras a los ausentes uno por uno. Alguien apunta sus nombres en una libreta para que no se pierdan."
    },
    {
      label: 'Apuntarte a la reconstrucción de la ciudad',
      fx: { health: -6, loyalty: 8, rubles: 120, blat: 3, flag: 'rebuilder' },
      outcome: "Levantas paredes sobre escombros. Cada ladrillo es una forma de decir que sigues aquí. Te pagan poco y te dan una medalla de hojalata."
    },
    {
      label: 'Hacer negocio con los objetos traídos del frente',
      fx: { rubles: 500, blat: 8, loyalty: -6, risk: 1, flag: 'trophies' },
      outcome: "Relojes, cámaras, telas. Los vendes en el mercado de koljós a precios que nadie pregunta. La guerra también deja mercancía."
    }
  ]
},

{
  id: 'stalin_1947_reform',
  title: 'La reforma monetaria',
  stamp: 'Banco Estatal · Decreto',
  year: 1947,
  minAge: 16, maxAge: 80,
  weight: 9,
  text: "El gobierno anuncia la reforma monetaria: los billetes viejos se cambian a razón de diez por uno, y solo hasta mil rublos por persona. Los precios de la cartilla bajan; los del mercado libre, no. En las colas, la gente calcula en voz baja cuánto va a perder.",
  options: [
    {
      label: 'Cambiar todos tus ahorros el primer día',
      fx: { rublesPct: -35, morale: -6, loyalty: 3, flag: 'reform_lost' },
      outcome: "Sales del banco con un fajo mucho más delgado. El Estado dice que la medida castiga a los especuladores. Tú no eres especulador, pero también pierdes."
    },
    {
      label: 'Comprar bienes antes de que cierre el cambio',
      sub: 'Requiere 300 ₽ y algo de olfato.',
      req: (s) => s.rubles >= 300,
      fx: { rubles: -300, item: 'boots', morale: 6, intellect: 4, flag: 'reform_smart' },
      outcome: "Compras botas, tela y azúcar. No es una inversión, pero tu casa pasa el invierno con más abrigo que la del vecino."
    },
    {
      label: 'Guardar los billetes viejos escondidos',
      fx: { rublesPct: -85, morale: -10, intellect: 2 },
      outcome: "Los escondes en el colchón por si acaso. Meses después ya no valen casi nada. Tu madre dice que tu abuelo hizo lo mismo en 1922."
    }
  ]
},

{
  id: 'stalin_1949_cosmopolitan',
  title: 'La campaña contra el cosmopolitismo',
  stamp: 'Comité Central · Circular',
  from: 1949, to: 1953,
  minAge: 18, maxAge: 80,
  weight: 7,
  text: "Una circular denuncia a los «cosmopolitas sin patria» en la ciencia y la cultura. En tu instituto o tu oficina, alguien empieza a revisar apellidos y viajes. Un compañero judío es apartado de su cátedra. La reunión pide que cada uno exprese su posición.",
  options: [
    {
      label: 'Apoyar la campaña en la reunión',
      fx: { loyalty: 12, morale: -12, blat: 4, flag: 'cosmopolitan_supporter' },
      outcome: "Hablas de «pureza ideológica». El compañero recoge sus libros y no vuelve. Te ascienden a su despacho y heredas su lámpara."
    },
    {
      label: 'Firmar una carta de apoyo a tu compañero',
      fx: { loyalty: -12, morale: 10, blat: 5, risk: 2, flag: 'defended_colleague' },
      outcome: "Recoges tres firmas. La carta no se publica. A tu compañero lo trasladan a una escuela de provincias; a ti te llaman «poco maduro»."
    },
    {
      label: 'Callar y no firmar nada',
      fx: { morale: -4, loyalty: -2, health: -1 },
      outcome: "Bajas la cabeza cuando pasa la lista. No firmas ni protestas. Esa noche te descubres ensayando una excusa por si te preguntan."
    }
  ]
},

{
  id: 'stalin_gulag_letter',
  title: 'Carta desde el norte',
  stamp: 'Correo censurado · Sin remite',
  from: 1939, to: 1953,
  minAge: 18, maxAge: 80,
  cond: (s) => s.stats.loyalty < 65 || s.flags.family_repressed,
  cooldown: 5,
  weight: 3,
  text: "Llega un sobre con matasellos de un lugar que no aparece en los mapas. Dentro, una hoja cuadriculada: tu tío está en un campo de trabajo, condenado por «actividad antisoviética». Pide tabaco, jabón y que no le olvidéis. La carta ha pasado por tres censuras.",
  options: [
    {
      label: 'Enviar un paquete con lo que pide',
      sub: 'Cuesta 120 ₽.',
      req: (s) => s.rubles >= 120,
      reqText: '120 ₽',
      fx: { rubles: -120, morale: 8, loyalty: -4, blat: 6, flag: 'helped_prisoner' },
      outcome: "Preparas un paquete con tabaco, jabón y una foto. Tarda cuatro meses en llegar. Recibes una respuesta de dos líneas: «Vivo. Gracias»."
    },
    {
      label: 'No responder y destruir la carta',
      fx: { morale: -10, loyalty: 3, health: -2 },
      outcome: "Quemas la carta en la estufa. Durante semanas te preguntas si alguien te vio leerla. El silencio también es una forma de miedo."
    },
    {
      label: 'Denunciar el contacto ante la oficina del partido',
      fx: { loyalty: 10, morale: -14, blat: 3, flag: 'informer' },
      outcome: "Entregas el sobre y explicas que no tienes relación con el preso. Te dan las gracias por escrito. Tu tío no vuelve a escribir."
    }
  ]
},

{
  id: 'stalin_1953_death',
  title: 'La muerte del camarada Stalin',
  stamp: 'Radio Moscú · Comunicado',
  year: 1953,
  minAge: 8, maxAge: 90,
  weight: 12,
  text: "El 5 de marzo, la radio anuncia que Stalin ha muerto. Las calles se llenan de gente que llora y de gente que no sabe qué hacer con la cara. En la plaza, la multitud se aprieta tanto que algunos caen. En las cocinas, otros hablan por primera vez en años.",
  options: [
    {
      label: 'Ir a la plaza y llorar con la multitud',
      fx: { loyalty: 8, morale: -4, health: -3, blat: 2 },
      outcome: "Pasas horas en el gentío. Ves a una mujer caer y no puedes llegar hasta ella. Vuelves a casa con los zapatos rotos y una extraña sensación de vacío."
    },
    {
      label: 'Quedarte en casa y sentir un alivio que no te atreves a decir',
      fx: { morale: 8, loyalty: -6, intellect: 4, flag: 'relieved_1953' },
      outcome: "Cierras la puerta y escuchas el silencio. Por primera vez en años, no tienes miedo de que alguien lea tu cara. No lo comentas con nadie."
    },
    {
      label: 'Preguntarte qué pasará ahora con el país',
      fx: { intellect: 6, morale: -2, loyalty: 2, flag: 'political_animal' },
      outcome: "Sigues las noticias de la sucesión. Beria, Malenkov, Jrushchov. Entiendes que el poder no muere con un hombre; solo cambia de manos."
    }
  ]
},

/* ================================ DESHIELO ================================ */

{
  id: 'thaw_1956_secret',
  title: 'El discurso secreto',
  stamp: 'XX Congreso · Sesión cerrada',
  year: 1956,
  minAge: 16, maxAge: 85,
  weight: 11,
  text: "En el XX Congreso, Jrushchov lee un informe sobre los crímenes de Stalin. La noticia circula primero en susurros y luego en reuniones cerradas. En tu fábrica, el secretario del partido lee un resumen y pide que nadie lo comente fuera. Alguien pregunta en voz alta si lo que dijo es verdad.",
  options: [
    {
      label: 'Aceptar la crítica y creer en la rectificación',
      fx: { loyalty: -4, intellect: 8, morale: 8, flag: 'believed_thaw' },
      outcome: "Escuchas con atención. Por primera vez, el partido admite que se equivocó. Te aferras a la idea de que el socialismo puede corregirse."
    },
    {
      label: 'Defender a Stalin en la reunión',
      fx: { loyalty: 6, morale: -8, blat: -4, flag: 'stalinist' },
      outcome: "Dices que el informe es una exageración. Varios compañeros te miran con desprecio; otros, con alivio. Te etiquetan para siempre."
    },
    {
      label: 'Guardar silencio y buscar el texto completo',
      fx: { intellect: 10, loyalty: -7, morale: 4, flag: 'read_secret_speech', risk: 1 },
      outcome: "Consigues una copia mecanografiada a través de un conocido del instituto. La lees de noche, con la lámpara baja. Hay nombres, fechas y cifras que no olvidarás."
    }
  ]
},

{
  id: 'thaw_1956_hungary',
  title: 'Budapest, noviembre',
  stamp: 'TASS · Nota oficial',
  year: 1956,
  minAge: 16, maxAge: 85,
  weight: 8,
  text: "La revolución húngara termina con los tanques soviéticos en Budapest. El periódico habla de «elementos contrarrevolucionarios» y de «ayuda fraterna». En la facultad, un profesor suspende la clase y no dice por qué. Un estudiante propone enviar una carta de protesta.",
  options: [
    {
      label: 'Apoyar la intervención soviética',
      fx: { loyalty: 10, morale: -6, blat: 4 },
      outcome: "Firmas el comunicado de apoyo. En la cena, tu padre dice que los húngaros querían otra cosa. Tú respondes que la unidad del campo socialista está primero."
    },
    {
      label: 'Firmar la carta de protesta',
      fx: { loyalty: -14, morale: 12, intellect: 4, risk: 3, flag: 'dissident' },
      outcome: "Firmas con otros doce estudiantes. La carta no se publica; la lista de firmantes sí circula. Durante meses, alguien revisa tu expediente."
    },
    {
      label: 'No firmar ni opinar',
      fx: { morale: -4, loyalty: 2, intellect: 2 },
      outcome: "Te quedas al margen. En la sala de profesores se habla de otra cosa. Tú recuerdas las imágenes de los tanques durante años."
    }
  ]
},

{
  id: 'thaw_1957_sputnik',
  title: 'El pitido sobre el cielo',
  stamp: 'Academia de Ciencias',
  year: 1957,
  minAge: 12, maxAge: 85,
  weight: 10,
  text: "El 4 de octubre, la URSS pone en órbita el primer satélite artificial. Por la noche, la gente sale a los patios a escuchar el pitido en la radio. En la escuela, la maestra llora de orgullo. En el instituto, abren una convocatoria para jóvenes técnicos.",
  options: [
    {
      label: 'Apuntarte al círculo de física y radio',
      fx: { intellect: 12, loyalty: 5, health: -2, flag: 'sputnik_generation' },
      outcome: "Pasas los sábados montando circuitos. El país acaba de demostrar que puede llegar al cielo; tú quieres entender cómo."
    },
    {
      label: 'Celebrar en la calle con tus vecinos',
      fx: { morale: 10, loyalty: 6, blat: 3 },
      outcome: "Bailas en el patio con desconocidos. Por una noche, el país es grande y tú formas parte de algo que no decepciona."
    },
    {
      label: 'Pensar en lo que cuesta ese satélite',
      fx: { intellect: 7, loyalty: -7, morale: -3, flag: 'skeptic' },
      outcome: "Calculas en voz baja cuántos apartamentos se podrían construir con ese presupuesto. Tu compañero de mesa te dice que no lo repitas."
    }
  ]
},

{
  id: 'thaw_1961_gagarin',
  title: 'El primer hombre',
  stamp: 'TASS · 12 de abril',
  year: 1961,
  minAge: 8, maxAge: 85,
  weight: 11,
  text: "«Poyejali!». Yuri Gagarin da una vuelta a la Tierra y se convierte en el rostro del siglo. Las calles se llenan de carteles, los niños juegan a ser cosmonautas y en las fábricas se improvisan mítines. En la radio, la voz del locutor tiembla.",
  options: [
    {
      label: 'Presentarte voluntario para el programa espacial',
      sub: 'Requiere salud 75 e intelecto 55.',
      req: (s) => s.stats.health >= 75 && s.stats.intellect >= 55,
      reqText: 'Salud 75 · Intelecto 55',
      fx: { loyalty: 10, health: -6, intellect: 6, flag: 'space_candidate', blat: 5 },
      outcome: "Pasas las primeras pruebas y te incluyen en una lista de reserva. No volarás al espacio, pero durante años entrenarás como si fueras a hacerlo."
    },
    {
      label: 'Celebrar con la familia y ponerle Yuri a tu hijo',
      cond: (s) => s.children > 0,
      fx: { morale: 12, loyalty: 6, flag: 'named_yuri' },
      outcome: "Tu hijo se llamará Yuri. En el patio, todos los niños quieren ser cosmonautas. Él también, hasta que descubre que no le gustan las alturas."
    },
    {
      label: 'Verlo por televisión y volver al trabajo',
      fx: { morale: 4, loyalty: 2, rubles: 40, intellect: 2 },
      outcome: "Ves las imágenes en el televisor del club. Luego vuelves al turno. El país ha ganado el cielo; tú tienes que terminar la pieza antes de las seis."
    }
  ]
},

{
  id: 'thaw_1961_housing',
  title: 'La llave de la khrushchiovka',
  stamp: 'Comité de vivienda · Orden',
  from: 1958, to: 1964,
  minAge: 22, maxAge: 75,
  cond: (s) => s.housing === 'kommunalka' || s.housing === 'room',
  weight: 7,
  text: "El comité de vivienda te ofrece una khrushchiovka: un bloque de paneles, una habitación y cocina propia en un quinto piso sin ascensor. Es pequeña, con techos bajos y paredes finas, pero la puerta se cierra por dentro. Piden una contribución para la cooperativa.",
  options: [
    {
      label: 'Aceptar y pagar la contribución',
      sub: 'Cuesta 900 ₽.',
      req: (s) => s.rubles >= 900,
      reqText: '900 ₽',
      fx: { rubles: -900, housing: 'khrushchyovka', morale: 16, health: 5, flag: 'own_flat' },
      outcome: "Recibes las llaves un viernes. Pintas la cocina de verde y compras una mesa. La primera noche duermes sin oír a los vecinos discutir."
    },
    {
      label: 'Rechazarla y esperar algo más grande',
      fx: { morale: -6, blat: 4, flag: 'waiting_flat' },
      outcome: "El comité pasa tu turno a otra familia. Te quedas en la kommunalka, con una solicitud abierta que quizá no vuelva a moverse."
    },
    {
      label: 'Ofrecer un sobre al presidente del comité',
      sub: 'Cuesta 400 ₽ y 10 de blat.',
      req: (s) => s.rubles >= 400 && s.stats.blat >= 10,
      reqText: '400 ₽ · Blat 10',
      fx: { rubles: -400, blat: -10, housing: 'khrushchyovka', morale: 12, health: 4, flag: 'own_flat', risk: 1 },
      outcome: "El sobre cambia de manos en un pasillo. Dos semanas después te llaman: hay una khrushchiovka en el tercero, con balcón. Nadie pregunta cómo."
    }
  ]
},

{
  id: 'thaw_1962_prices',
  title: 'El precio de la carne',
  stamp: 'Comité Central · Decreto',
  year: 1962,
  minAge: 16, maxAge: 85,
  weight: 9,
  text: "El 1 de junio suben los precios de la carne y la mantequilla un treinta por ciento. En Novocherkassk, los obreros se concentran ante el comité de la ciudad y la protesta es reprimida a tiros. El periódico no lo cuenta. En tu fábrica, el descontento se masca en los pasillos.",
  options: [
    {
      label: 'Firmar una carta colectiva de queja',
      fx: { loyalty: -10, morale: 10, blat: 5, risk: 2, flag: 'protested_prices' },
      outcome: "Recoges firmas con cuidado, en papel sin membrete. La carta llega al comité local y desaparece. Durante semanas, alguien vigila quién habla con quién."
    },
    {
      label: 'Aceptar la subida y ajustar el presupuesto',
      fx: { morale: -6, rubles: -80, health: -2, loyalty: 3 },
      outcome: "Recortas la carne y compras más patatas y pan. El Estado dice que es temporal. Tu carnicero dice que todo es temporal."
    },
    {
      label: 'Buscar carne en el mercado de koljós',
      fx: { rubles: -150, health: 4, morale: 3, blat: 4, risk: 1 },
      outcome: "Pagas el triple, pero llenas la nevera. El vendedor te advierte de que la milicia está revisando bolsas a la salida."
    }
  ]
},

{
  id: 'thaw_1962_cuba',
  title: 'Trece días de octubre',
  stamp: 'Defensa Civil · Instrucción',
  year: 1962,
  minAge: 14, maxAge: 85,
  weight: 8,
  text: "La crisis de los misiles en Cuba tiene al mundo al borde de la guerra nuclear. En la escuela se ensayan refugios antiaéreos; en la radio se habla de «provocación imperialista». Durante trece días, nadie sabe si mañana habrá ciudad.",
  options: [
    {
      label: 'Donar parte de tus ahorros al fondo de defensa',
      sub: 'Cuesta 150 ₽.',
      req: (s) => s.rubles >= 150,
      reqText: '150 ₽',
      fx: { rubles: -150, loyalty: 10, morale: 4, flag: 'cuba_donor' },
      outcome: "Entregas el dinero en la oficina del sindicato y recibes un recibo. Cuando la crisis termina, el recibo queda en un cajón como una reliquia."
    },
    {
      label: 'Preparar un plan para salir de la ciudad',
      fx: { intellect: 5, morale: -6, blat: 5, health: -2, flag: 'crisis_planner' },
      outcome: "Dibujas rutas, guardas agua y una bolsa con documentos. No la usas, pero durante años la bolsa sigue junto a la puerta."
    },
    {
      label: 'Seguir con tu vida y no pensar en la bomba',
      fx: { morale: 2, health: 1, loyalty: -2 },
      outcome: "Vas al cine y al trabajo. La crisis termina un domingo por la mañana. Te enteras por la radio, mientras desayunas."
    }
  ]
},

{
  id: 'thaw_1964_ouster',
  title: 'La caída de Jrushchov',
  stamp: 'Pleno del Comité Central',
  year: 1964,
  minAge: 16, maxAge: 85,
  weight: 9,
  text: "En octubre, Jrushchov es destituido «por motivos de salud» y edad. Brézhnev ocupa su lugar. En la fábrica, el secretario lee la decisión sin explicar nada. Quien había criticado a Stalin ahora desaparece sin juicio, y la vida sigue.",
  options: [
    {
      label: 'Aprobar el relevo como una muestra de madurez del partido',
      fx: { loyalty: 8, morale: 1, blat: 2 },
      outcome: "Asientes en la reunión. El nuevo secretario promete continuidad y estabilidad. La palabra «estabilidad» sonará durante veinte años."
    },
    {
      label: 'Lamentar la pérdida del Deshielo',
      fx: { morale: -6, intellect: 5, loyalty: -4, flag: 'thaw_nostalgia' },
      outcome: "Recuerdas los años en que se podía discutir en voz alta. Ahora el país vuelve a hablar bajo. Guardas los recortes de periódico de 1956."
    },
    {
      label: 'No opinar: los cambios de arriba no te conciernen',
      fx: { morale: 2, health: 1, blat: 1 },
      outcome: "Sigues con tu turno y tu cola. En la cocina, la radio anuncia el nuevo liderazgo y tu madre cambia de emisora."
    }
  ]
}

]);
