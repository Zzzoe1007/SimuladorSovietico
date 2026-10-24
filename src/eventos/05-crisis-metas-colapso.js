/* ============================================================================
 * EVENTOS · 05 — CRISIS, GRAN META Y COLAPSO
 * Crisis recurrentes (invierno, inspección, enfermedad), el evento que elige
 * la gran meta a los 18 y el cierre de la URSS en 1991.
 * ==========================================================================*/

addEvents([

/* ================================ CRISIS ================================ */

{
  id: 'crisis_winter',
  title: 'El invierno se adelanta',
  stamp: 'Defensa civil · Aviso meteorológico',
  minAge: 18,
  cooldown: 3,
  weight: 6,
  text: "Llega una ola de frío y las tuberías del barrio se hielan. La calefacción central funciona a medias y en la tienda no hay carbón ni leña. El médico avisa de que la gripe está saturando el ambulatorio. Tienes que decidir cómo pasar las próximas semanas.",
  options: [
    {
      label: 'Comprar leña y medicinas en el mercado',
      sub: 'Cuesta 220 ₽.',
      req: (s) => s.rubles >= 220,
      reqText: '220 ₽',
      fx: { rubles: -220, health: 8, morale: 4 },
      outcome: "Pagas de más, pero la casa se mantiene caliente y tienes aspirinas. El invierno pasa sin visitas al hospital."
    },
    {
      label: 'Pedir ayuda a la red de contactos',
      sub: 'Requiere 12 de blat.',
      req: (s) => s.stats.blat >= 12,
      reqText: 'Blat 12',
      fx: { blat: -12, health: 4, morale: 3, flag: 'winter_helped' },
      outcome: "Un contacto del almacén te guarda carbón y un radiador de aceite. Le deberás otra. En este país, el calor también se paga con favores."
    },
    {
      label: 'Aguantar con mantas y agua caliente',
      fx: { health: -10, morale: -4, rubles: 20 },
      outcome: "Duermes vestido. La tos se queda tres semanas. Al final del invierno, has perdido peso y paciencia."
    }
  ]
},

{
  id: 'crisis_kgb',
  title: 'La citación',
  stamp: 'KGB · Citación oficial',
  minAge: 18,
  cooldown: 4,
  weight: 7,
  cond: (s) => s.stats.loyalty < 38 || s.flags.risk || s.flags.dissident,
  text: "Un oficial de la KGB te espera en el portal. No hay detención: solo una «conversación» en una oficina del distrito. Sobre la mesa hay una carpeta con tu nombre, fotos de conocidos y un informe que no puedes leer. Te ofrecen té.",
  options: [
    {
      label: 'Colaborar y dar nombres',
      fx: { loyalty: 12, blat: -8, morale: -14, risk: -1, flag: 'collaborator' },
      outcome: "Das dos nombres que ya conocían. El oficial toma notas y sonríe. Sales con la sensación de haber firmado algo sin firma."
    },
    {
      label: 'Negarlo todo y pedir un abogado',
      fx: { loyalty: -6, morale: 6, health: -4, risk: 1, flag: 'interrogated' },
      outcome: "Te dicen que no hace falta abogado para hablar con un camarada. La conversación dura cuatro horas. No te detienen, pero no te olvidan."
    },
    {
      label: 'Avisar a un contacto del comité',
      sub: 'Requiere 30 de blat y 250 ₽.',
      req: (s) => s.stats.blat >= 30 && s.rubles >= 250,
      reqText: 'Blat 30 · 250 ₽',
      fx: { blat: -28, rubles: -250, morale: 4, risk: -1, loyalty: 2 },
      outcome: "Tu contacto hace una llamada. La citación se «archiva por falta de pruebas». Debes dos favores y sabes que uno de ellos no se pagará con dinero."
    }
  ]
},

{
  id: 'crisis_health',
  title: 'El cuerpo pasa factura',
  stamp: 'Hospital del distrito · Ingreso',
  minAge: 25,
  cooldown: 3,
  weight: 6,
  cond: (s) => s.stats.health < 40,
  text: "Te despiertas en el suelo de la cocina. El médico dice que es agotamiento y algo más que no quiere nombrar delante de tu familia. Te ofrece ingresar en el hospital del distrito, donde hay camas en los pasillos, o seguir tratándote en casa.",
  options: [
    {
      label: 'Ingresar y seguir el tratamiento público',
      fx: { health: 16, morale: -4, rubles: -60, loyalty: 3 },
      outcome: "Pasas dos semanas en una sala con seis camas. La comida es mala, las enfermeras están agotadas, pero el tratamiento funciona. Vuelves a casa más delgado y más vivo."
    },
    {
      label: 'Pagar una clínica mejor por la vía privada',
      sub: 'Cuesta 400 ₽.',
      req: (s) => s.rubles >= 400,
      reqText: '400 ₽',
      fx: { rubles: -400, health: 24, morale: 6, flag: 'private_care' },
      outcome: "Una habitación individual, un médico que te escucha y comida comestible. La sanidad es gratuita; la dignidad, a veces, no."
    },
    {
      label: 'Volver al trabajo y aguantar',
      fx: { health: -12, morale: -6, rubles: 120 },
      outcome: "Firmas el alta voluntaria. Al mes siguiente vuelves a caer. El cuerpo tiene menos paciencia que el Estado."
    }
  ]
},

{
  id: 'crisis_money',
  title: 'El mes sin fondo',
  stamp: 'Caja de ahorros · Descubierto',
  minAge: 18,
  cooldown: 4,
  weight: 5,
  cond: (s) => s.rubles < 120,
  text: "No llega para el recibo de la luz ni para el pan de la semana. En la cocina, tu familia hace cuentas en voz alta. El vecino ofrece un préstamo; la empresa, un anticipo; el mercado, una oportunidad que no quieres mirar demasiado.",
  options: [
    {
      label: 'Pedir un anticipo a la empresa',
      fx: { rubles: 150, loyalty: 4, morale: -4, flag: 'advance' },
      outcome: "El sindicato te adelanta parte del sueldo. Firmas un papel y te descuentan el resto durante tres meses."
    },
    {
      label: 'Vender algo de la casa',
      sub: 'El televisor, si aún lo tienes.',
      req: (s) => s.items.includes('tv'),
      reqText: 'Televisor',
      fx: { rubles: 220, morale: -6, removeItem: 'tv' },
      outcome: "Vendes el televisor en el mercado de koljós. La casa se queda más silenciosa y la nevera, menos llena."
    },
    {
      label: 'Pedir prestado al vecino',
      fx: { rubles: 100, blat: -8, morale: 2 },
      outcome: "El vecino te da el dinero sin preguntar. Le devuelves la mitad al mes siguiente. La deuda queda en el rellano, entre los dos."
    }
  ]
},

/* =============================== GRAN META =============================== */

{
  id: 'great_goal',
  title: 'La gran meta',
  stamp: 'Expediente personal · Hoja de ruta',
  age: 18,
  milestone: true,
  weight: 20,
  text: "Cumples dieciocho años. El Estado te considera adulto y tu expediente pide un propósito. No es una elección definitiva —la vida cambia—, pero marcará las próximas décadas: a qué dedicas los ahorros, los favores y las horas. El comité de tu centro te mira mientras decides.",
  options: [
    {
      label: 'Un techo propio',
      sub: 'Apartamento de dos habitaciones. Ahorro + lista de espera + contactos.',
      fx: { goal: 'flat' },
      outcome: "Eliges la vivienda. Abres una cartilla de ahorro y empiezas a preguntar por la lista del comité. La kommunalka se te queda pequeña antes de tiempo."
    },
    {
      label: 'La élite protegida',
      sub: 'Ciencia o deporte de alto rendimiento. Requiere intelecto 45.',
      req: (s) => s.stats.intellect >= 45,
      reqText: 'Intelecto 45',
      fx: { goal: 'star' },
      outcome: "Eliges el camino del talento. El Estado necesita héroes de laboratorio y de estadio. Tú quieres ser uno de ellos."
    },
    {
      label: 'El mercado negro',
      sub: 'Fartsovka y favores. Requiere 10 de blat.',
      req: (s) => s.stats.blat >= 10,
      reqText: 'Blat 10',
      fx: { goal: 'black' },
      outcome: "Eliges el segundo país, el que no aparece en los periódicos. Tienes contactos, olfato y una lista de cosas que la gente necesita."
    },
    {
      label: 'La carrera del Partido',
      sub: 'Nomenklatura. Requiere lealtad 25.',
      req: (s) => s.stats.loyalty >= 25,
      reqText: 'Lealtad 25',
      fx: { goal: 'party' },
      outcome: "Eliges el aparato. Te dan una carpeta, una agenda y la dirección de la escuela del partido. A partir de hoy, tus opiniones serán actas."
    }
  ]
},

/* --------------------------- Progreso: vivienda -------------------------- */

{
  id: 'g_flat_wait',
  title: 'La lista del comité de vivienda',
  stamp: 'Comité de vivienda · Solicitud',
  minAge: 19, maxAge: 75,
  cond: (s) => s.goal && s.goal.id === 'flat' && !s.flags.waitlist,
  weight: 8,
  text: "El comité de vivienda de la empresa abre el plazo para inscribirse en la lista. Hay que presentar el certificado de trabajo, la composición familiar y una solicitud manuscrita. La secretaria advierte de que la lista es larga y de que no todos los papeles se mueven solos.",
  options: [
    {
      label: 'Presentar la solicitud y esperar tu turno',
      fx: { waitlist: true, morale: 4, loyalty: 3 },
      outcome: "Te inscriben con el número 312. La secretaria te dice que la lista avanza «según las circunstancias». Guardas el resguardo en un sobre."
    },
    {
      label: 'Acelerar el trámite con un sobre',
      sub: 'Cuesta 250 ₽ y 10 de blat.',
      req: (s) => s.rubles >= 250 && s.stats.blat >= 10,
      reqText: '250 ₽ · Blat 10',
      fx: { rubles: -250, blat: -10, waitlist: true, flatBoost: 8, morale: 6, risk: 1 },
      outcome: "El sobre desaparece en un cajón. Tu solicitud pasa al montón de «casos sociales prioritarios». El número sigue siendo el 312, pero avanza más rápido."
    },
    {
      label: 'Pedir al sindicato que avale tu caso',
      sub: 'Requiere 45 de lealtad.',
      req: (s) => s.stats.loyalty >= 45,
      reqText: 'Lealtad 45',
      fx: { waitlist: true, flatBoost: 5, loyalty: 2, morale: 3 },
      outcome: "El delegado sindical firma un aval. No es dinero, pero el comité lo lee como una señal de que eres un trabajador que cumple."
    }
  ]
},

{
  id: 'g_flat_push',
  title: 'El expediente de la vivienda',
  stamp: 'Comité de vivienda · Revisión',
  minAge: 21, maxAge: 80,
  cond: (s) => s.goal && s.goal.id === 'flat' && s.flags.waitlist,
  cooldown: 4,
  weight: 5,
  text: "Tu expediente de vivienda lleva años en el mismo archivador. Ha habido dos reasignaciones y ninguna te incluyó. Un miembro del comité te sugiere que «refresques» la documentación y que, si conoces a alguien, lo hagas saber.",
  options: [
    {
      label: 'Refrescar papeles y visitar al comité cada mes',
      fx: { flatBoost: 6, morale: -2, health: -2, blat: -3 },
      outcome: "Vas cada mes con una carpeta nueva. La secretaria acaba conociéndote por el nombre. Tu expediente se mueve tres puestos."
    },
    {
      label: 'Invitar a cenar al presidente del comité',
      sub: 'Cuesta 300 ₽ y 12 de blat.',
      req: (s) => s.rubles >= 300 && s.stats.blat >= 12,
      reqText: '300 ₽ · Blat 12',
      fx: { rubles: -300, blat: -12, flatBoost: 10, morale: 4, risk: 1 },
      outcome: "Cena, vodka y una conversación sobre el plan quinquenal. Al despedirse, el presidente dice que «lo mirará». Lo mira."
    },
    {
      label: 'Esperar sin mover nada',
      fx: { morale: -4, health: 1 },
      outcome: "Dejas el expediente donde está. La lista avanza sola, muy despacio. Tú sigues pagando el alquiler de la kommunalka."
    }
  ]
},

/* ---------------------------- Progreso: élite ---------------------------- */

{
  id: 'g_star_train',
  title: 'El centro de entrenamiento',
  stamp: 'Sociedad deportiva / Instituto',
  minAge: 18, maxAge: 55,
  cond: (s) => s.goal && s.goal.id === 'star',
  cooldown: 2,
  weight: 8,
  text: "El instructor te propone un ciclo intensivo: seis días a la semana, dieta controlada y controles médicos. El Estado paga la instalación y el material. A cambio, espera resultados y discreción. Tu cuerpo y tu expediente van en el mismo paquete.",
  options: [
    {
      label: 'Entregarte al entrenamiento intensivo',
      fx: { training: 2, health: -8, morale: 4, loyalty: 4 },
      outcome: "Te levantas a las cinco y terminas agotado. El cronómetro mejora. También empeora todo lo demás."
    },
    {
      label: 'Mantener un ritmo sostenible',
      fx: { training: 1, health: -2, morale: 2, intellect: 2 },
      outcome: "Entrenas sin destrozarte. Avanzas más despacio, pero llegas al invierno sin lesiones."
    },
    {
      label: 'Saltarte el ciclo y descansar',
      fx: { morale: 5, health: 4, training: -1 },
      outcome: "Faltas al entrenamiento. El instructor no dice nada, pero tu nombre baja en la lista de seguimiento."
    }
  ]
},

{
  id: 'g_star_comp',
  title: 'La competición clasificatoria',
  stamp: 'Federación · Convocatoria',
  minAge: 20, maxAge: 55,
  cond: (s) => s.goal && s.goal.id === 'star',
  cooldown: 4,
  weight: 6,
  text: "Hay una competición clasificatoria para el equipo nacional o una plaza en el instituto cerrado. Los seleccionadores miran el cronómetro, la ficha médica y el expediente ideológico. En el vestuario, alguien ofrece unas ampollas que «ayudan a recuperar».",
  options: [
    {
      label: 'Competir limpio y aceptar el resultado',
      fx: { training: 1, health: -6, rubles: 200, morale: 6, loyalty: 4, starRep: 8, flag: 'fair_competitor' },
      outcome: "Quedas cuarto. No entras en el equipo, pero el médico destaca tu resistencia. El seleccionador te apunta para la próxima."
    },
    {
      label: 'Aceptar las ampollas del vestuario',
      fx: { training: 2, health: -14, morale: -4, risk: 2, starRep: 12, flag: 'doping' },
      outcome: "Ganas dos segundos y una tos que no se va. El control antidopaje no existe todavía. Tu cuerpo sí."
    },
    {
      label: 'Retirarte antes de la prueba',
      fx: { training: -1, morale: -6, health: 2, blat: -2 },
      outcome: "Dices que estás lesionado. El seleccionador no te cree. La lista de candidatos se cierra sin tu nombre."
    }
  ]
},

/* --------------------------- Progreso: mercado --------------------------- */

{
  id: 'g_black_contact',
  title: 'El contacto del aeropuerto',
  stamp: 'Aduanas · Sin registro',
  minAge: 20, maxAge: 70,
  cond: (s) => s.goal && s.goal.id === 'black' && !s.flags.black_network,
  weight: 7,
  text: "Un conocido te presenta a un hombre que trabaja en el aeropuerto. Controla equipajes, conoce a las azafatas y sabe qué vuelos traen mercancía. Quiere un socio con contactos en la ciudad y discreción. La conversación ocurre en una sauna pública.",
  options: [
    {
      label: 'Aceptar la sociedad',
      fx: { blat: 12, deals: 1, morale: 4, risk: 1, flag: 'black_network' },
      outcome: "Cerráis el trato con un apretón de manos húmedo. En dos semanas recibes tu primer paquete de discos y medias. El negocio empieza."
    },
    {
      label: 'Colaborar solo en una operación puntual',
      fx: { rubles: 250, blat: 4, risk: 1 },
      outcome: "Haces una entrega y desapareces. El hombre no insiste. Guardas su número en un papel que escondes en el forro del abrigo."
    },
    {
      label: 'Rechazar y denunciarlo',
      fx: { loyalty: 10, blat: -8, morale: -8, flag: 'informer' },
      outcome: "Das su nombre a la milicia. La sauna cierra una semana por «inspección sanitaria». Tú vuelves a tu vida, con una reputación nueva y peligrosa."
    }
  ]
},

{
  id: 'g_black_deal',
  title: 'El paquete bajo el asiento',
  stamp: 'Operación no registrada',
  minAge: 20, maxAge: 75,
  cond: (s) => s.goal && s.goal.id === 'black',
  cooldown: 2,
  weight: 8,
  text: "Un contacto te pide transportar un paquete desde la estación hasta un piso del centro. No debes abrirlo ni preguntar. Paga bien y adelanta la mitad. En el andén hay dos milicianos y un perro que huele las maletas.",
  options: [
    {
      label: 'Aceptar y hacer la entrega',
      fx: { rubles: 400, deals: 1, blat: 6, risk: 2, morale: 2 },
      outcome: "El paquete pesa poco y huele a plástico. Lo entregas en un portal sin luz. Nadie te pregunta nada. La mitad del dinero ya está en tu bolsillo."
    },
    {
      label: 'Aceptar solo encargos pequeños',
      fx: { rubles: 150, deals: 1, blat: 3, risk: 1, health: -1 },
      outcome: "Llevas cartones de tabaco y discos. Ganas menos, pero el riesgo también es menor. En este negocio, la prudencia es capital."
    },
    {
      label: 'Devolver el paquete y romper el contacto',
      fx: { morale: 4, blat: -6, loyalty: 3 },
      outcome: "Dejas el paquete en el sitio acordado y no vuelves. El contacto te borra de su agenda. Tú respiras."
    }
  ]
},

/* --------------------------- Progreso: partido --------------------------- */

{
  id: 'g_party_school',
  title: 'La escuela del partido',
  stamp: 'Escuela superior del PCUS',
  minAge: 20, maxAge: 65,
  cond: (s) => s.goal && s.goal.id === 'party' && !s.flags.party_school,
  weight: 7,
  text: "Te proponen un curso de la escuela del partido: historia del movimiento obrero, economía política y «cuestiones de actualidad». Al final hay un examen y una evaluación política. Aprobar abre la puerta a los puestos de responsabilidad.",
  options: [
    {
      label: 'Estudiar el temario y aprobar por méritos',
      fx: { intellect: 8, rank: 1, loyalty: 4, health: -3, flag: 'party_school' },
      outcome: "Apruebas con un notable. El profesor destaca tu «claridad ideológica». Empiezas a recibir invitaciones a reuniones que no aparecen en la agenda."
    },
    {
      label: 'Comprar los apuntes y el favor del evaluador',
      sub: 'Cuesta 300 ₽ y 8 de blat.',
      req: (s) => s.rubles >= 300 && s.stats.blat >= 8,
      reqText: '300 ₽ · Blat 8',
      fx: { rubles: -300, blat: -8, rank: 1, morale: -3, flag: 'party_school' },
      outcome: "El evaluador te da los temas y una sonrisa. Apruebas sin sudar. En el pasillo, otro alumno te mira como si supiera exactamente lo que has hecho."
    },
    {
      label: 'Rechazar el curso y seguir en tu puesto',
      fx: { morale: 3, loyalty: -6, rank: -1 },
      outcome: "Dices que prefieres el trabajo de base. El secretario apunta tu negativa. Tu carrera se detiene en el escalón donde estaba."
    }
  ]
},

{
  id: 'g_party_rival',
  title: 'El rival en la terna',
  stamp: 'Comité de cuadros · Terna',
  minAge: 24, maxAge: 65,
  cond: (s) => s.goal && s.goal.id === 'party' && (s.flags.rank || 0) >= 1,
  weight: 6,
  text: "Se abre una vacante en el comité regional. Hay tres candidatos: tú y dos compañeros. Uno de ellos tiene un informe antiguo sobre un familiar en el extranjero. El secretario te pregunta, con toda la intención, si crees que ese detalle es relevante.",
  options: [
    {
      label: 'Señalar el informe y quedarte con la vacante',
      fx: { rank: 2, loyalty: 4, morale: -10, risk: 1, flag: 'rival_destroyed' },
      outcome: "El comité «toma nota». Tu rival retira su candidatura por «motivos personales». Tú ocupas su despacho. La silla está fría."
    },
    {
      label: 'Defender a tu rival y retirarte de la terna',
      fx: { rank: 1, morale: 10, blat: 6, loyalty: -4, flag: 'loyal_rival' },
      outcome: "Dices que el informe no tiene relación con el trabajo. El secretario frunce el ceño. Tu rival obtiene la vacante y te debe una."
    },
    {
      label: 'No decir nada y dejar que decida el comité',
      fx: { morale: -2, rank: 1, loyalty: 2 },
      outcome: "Te quedas callado. La vacante va a parar a un tercero que no estaba en la terna. Los dos salís perdiendo."
    }
  ]
},

{
  id: 'g_party_post',
  title: 'El despacho con teléfono',
  stamp: 'Nomenclatura · Nombramiento',
  minAge: 26, maxAge: 70,
  cond: (s) => s.goal && s.goal.id === 'party' && (s.flags.rank || 0) >= 2,
  cooldown: 4,
  weight: 6,
  text: "Se ha liberado un puesto en el comité ejecutivo. Tu padrino político puede empujar tu candidatura, pero quiere algo a cambio: apoyo en la próxima votación interna. Por otro lado, tu historial de trabajo habla por sí solo.",
  options: [
    {
      label: 'Aceptar el apoyo del padrino',
      sub: 'Requiere 15 de blat.',
      req: (s) => s.stats.blat >= 15,
      reqText: 'Blat 15',
      fx: { blat: -15, rank: 1, loyalty: 4, morale: -4, flag: 'patron' },
      outcome: "Obtienes el puesto y un teléfono en el despacho. En la votación apoyas a tu padrino sin leer la propuesta. La deuda política no se amortiza."
    },
    {
      label: 'Presentarte por tu historial',
      sub: 'Requiere 65 de lealtad.',
      req: (s) => s.stats.loyalty >= 65,
      reqText: 'Lealtad 65',
      fx: { rank: 1, loyalty: 6, health: -4, morale: 4, flag: 'merit_post' },
      outcome: "El comité valora tus años de servicio y tu expediente impecable. Te dan el puesto sin padrino. Nadie te protege, pero nadie te cobra."
    },
    {
      label: 'Rechazar el ascenso y quedarte donde estás',
      fx: { morale: 4, loyalty: -4, health: 3 },
      outcome: "Dices que estás bien donde estás. El comité respeta la modestia. Tu carrera, en cambio, se queda quieta."
    }
  ]
},

/* ============================ COLAPSO DE 1991 ============================ */

{
  id: 'collapse_1991',
  title: 'Diciembre de 1991',
  stamp: 'Acta de disolución · Último pleno',
  year: 1991,
  minAge: 16,
  milestone: true,
  weight: 30,
  text: "El 8 de diciembre, los líderes de tres repúblicas firman el fin de la Unión. El 25, la bandera roja baja del Kremlin. En tu ciudad, la gente hace cola para cambiar rublos por lo que sea. Los archivos se abren, los precios se disparan y el país en el que naciste deja de existir en el mapa.",
  options: [
    {
      label: 'Adaptarte: buscar trabajo, socio o mercado nuevo',
      fx: { morale: 6, rubles: -200, blat: 6, flag: 'collapse_adapt' },
      outcome: "Conviertes tu red de contactos en algo parecido a un negocio. El país nuevo no te debe nada, pero tú sabes moverte."
    },
    {
      label: 'Guardar lo que puedas y esperar tiempos mejores',
      fx: { morale: -4, rubles: 300, health: 2, flag: 'collapse_save' },
      outcome: "Cambias tus ahorros por dólares si puedes, o por bienes si no. No es heroico. Es lo que hace la mayoría."
    },
    {
      label: 'Quedarte mirando cómo se va el país',
      fx: { morale: -10, health: -4, loyalty: 6, flag: 'collapse_grief' },
      outcome: "Ves la bandera bajar por televisión y no te mueves. Parte de tu vida se queda en ese mástil. La otra parte tiene que seguir."
    }
  ]
}

]);
