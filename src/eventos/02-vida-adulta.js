/* ============================================================================
 * EVENTOS · 02 — VIDA ADULTA COTIDIANA (18+ años)
 * Acontecimientos reutilizables con enfriamiento: trabajo, vivienda, familia,
 * estudio, mercado negro, salud. Sostienen el juego cuando el año no tiene
 * un gran acontecimiento histórico asociado.
 * ==========================================================================*/

addEvents([

/* ---------------------------------------------------------------- 19-22 */
{
  id: 'adult_first_job',
  title: 'El primer destino',
  stamp: 'Departamento de personal',
  minAge: 19, maxAge: 22,
  cond: (s) => !s.flags.uni && !s.flags.tech && !s.flags.army && s.tier <= 2,
  weight: 6,
  text: "La oficina de personal te entrega un papel con un destino y una fecha. No elegiste la fábrica, pero la fábrica te elige a ti. El jefe de taller te mira las manos antes que la cara y dice que empiezas el lunes.",
  options: [
    {
      label: 'Aceptar el destino y aprender el oficio',
      fx: { tier: 3, job: JOBS[3], health: -3, rubles: 60, loyalty: 4, flag: 'skilled_worker' },
      outcome: "En seis meses manejas la máquina mejor que algunos veteranos. El sobre de la paga llega puntual, aunque no siempre alcance."
    },
    {
      label: 'Pedir un traslado a una ciudad mejor por la vía del blat',
      sub: 'Requiere 20 de blat.',
      req: (s) => s.stats.blat >= 20,
      reqText: 'Blat 20',
      fx: { blat: -12, tier: 3, job: JOBS[3], morale: 8, rubles: 40 },
      outcome: "Un primo del jefe de personal firma el traslado. Llegas a una ciudad con tranvía y una tienda donde a veces hay salchicha."
    },
    {
      label: 'Marcharte a las obras del este',
      sub: 'Salario alto, condiciones duras.',
      fx: { tier: 3, job: 'Obrero de construcción', health: -9, rubles: 220, morale: -3, flag: 'virgin_lands' },
      outcome: "Te asignan a un campamento de barracones. El viento no para y el agua se hiela en el cubo. Ganas más dinero del que nunca has tenido."
    }
  ]
},

/* ---------------------------------------------------------------- 21-33 */
{
  id: 'adult_marriage',
  title: 'La habitación de los sábados',
  stamp: 'Oficina del registro civil (ZAGS)',
  minAge: 21, maxAge: 34,
  cond: (s) => !s.spouse,
  weight: 5,
  text: "Llevas meses viendo a la misma persona en el tranvía o en el baile del club. No hay sitio para los dos: una habitación compartida, unos padres que no preguntan y un futuro que el Estado no garantiza. Casarse no resuelve la vivienda, pero cambia el expediente.",
  options: [
    {
      label: 'Casarse con una ceremonia pequeña',
      sub: 'Cuesta 200 ₽ y un vestido prestado.',
      req: (s) => s.rubles >= 200,
      reqText: '200 ₽',
      fx: { rubles: -200, spouse: true, morale: 12, health: 2, flag: 'married' },
      outcome: "Firmáis en una sala con cortinas de terciopelo sintético. La familia bebe champán barato y alguien brinda por un apartamento. Tardará."
    },
    {
      label: 'Ir a vivir juntos sin registrar nada',
      fx: { spouse: true, morale: 7, loyalty: -3, blat: 2 },
      outcome: "El comité de vivienda os niega la solicitud: «no consta el vínculo». Aun así, compartís la cama y las deudas."
    },
    {
      label: 'Esperar. Primero la estabilidad',
      fx: { morale: -5, rubles: 100, intellect: 2 },
      outcome: "Dejas pasar el momento. Ella se casa con un ingeniero dos años después. Tú guardas el billete del tranvía en un cajón."
    }
  ]
},

/* ---------------------------------------------------------------- 23-39 */
{
  id: 'adult_child',
  title: 'La habitación de los niños',
  stamp: 'Consulta de pediatría',
  minAge: 23, maxAge: 40,
  cond: (s) => s.spouse && s.children < 3,
  cooldown: 4,
  weight: 4,
  text: "El médico confirma el embarazo con una libreta y una sonrisa cansada. La sanidad es gratuita; la leche en polvo, no. En casa hay que decidir quién duerme dónde y qué se recorta del presupuesto. Tu madre dice que un hijo nunca llega en buen momento.",
  options: [
    {
      label: 'Tener el hijo y apretarse el cinturón',
      fx: { child: 1, morale: 14, health: -4, rubles: -150, loyalty: 3, flag: 'parent' },
      outcome: "Nace en una sala común, entre gritos y radio. Cuando te lo ponen en brazos, el país entero se vuelve un detalle menor."
    },
    {
      label: 'Esperar a tener vivienda propia',
      fx: { morale: -6, rubles: 250, flag: 'postponed_child' },
      outcome: "El médico asiente y anota algo. Los años pasan. La casa sigue siendo la misma y la decisión también."
    },
    {
      label: 'Pedir ayuda a la empresa para una plaza de guardería',
      sub: 'Requiere 15 de blat.',
      req: (s) => s.stats.blat >= 15,
      reqText: 'Blat 15',
      fx: { blat: -10, child: 1, morale: 10, health: -2, flag: 'parent' },
      outcome: "El sindicato te consigue plaza en la guardería de la fábrica. Tu hijo crecerá entre tornos y carteles, pero estará cuidado."
    }
  ]
},

/* ---------------------------------------------------------------- 18+ */
{
  id: 'adult_queue',
  title: 'La cola de la esquina',
  stamp: 'Comercio estatal · Aviso',
  minAge: 18,
  cooldown: 4,
  weight: 5,
  text: "Corre el rumor de que en la tienda de la esquina han traído conserva de pescado. La cola dobla la manzana. Delante de ti, una mujer dice que ha estado allí desde las cinco; detrás, un hombre asegura que no queda nada. La tienda abre en cuarenta minutos.",
  options: [
    {
      label: 'Quedarte en la cola hasta que abras la puerta',
      fx: { health: -4, morale: -2, rubles: -35, flag: 'food_stock', intellect: 1 },
      outcome: "Sales con dos latas y una bolsa de harina. No era lo que esperabas, pero en casa habrá cena caliente esta semana."
    },
    {
      label: 'Llamar a tu contacto en el almacén',
      sub: 'Requiere 10 de blat.',
      req: (s) => s.stats.blat >= 10,
      reqText: 'Blat 10',
      fx: { blat: -8, rubles: -50, morale: 4, flag: 'food_stock' },
      outcome: "Entras por la puerta de atrás. El almacenero te guarda una caja sin preguntar y cobra lo justo. Los de la cola te ven salir."
    },
    {
      label: 'Renunciar y volver a casa',
      fx: { morale: -4, health: 1 },
      outcome: "La cola se cierra antes de que llegues. Cenas pan con té y escuchas cómo se queja el vecino de arriba."
    }
  ]
},

/* ---------------------------------------------------------------- 20+ */
{
  id: 'adult_vodka',
  title: 'La botella del sábado',
  stamp: 'Club de la fábrica',
  minAge: 20,
  cooldown: 4,
  weight: 4,
  text: "El brigada ha traído una botella de «Moscovskaya» y cuatro vasos. Se celebra el plan cumplido. Uno propone un brindis por el camarada Stalin; otro, más bajo, por los que no volvieron. La conversación se calienta y alguien menciona el precio de la carne.",
  options: [
    {
      label: 'Beber con ellos hasta el final',
      fx: { morale: 7, health: -6, blat: 6, loyalty: 2, flag: 'drinker' },
      outcome: "Cantas, discutes de fútbol y olvidas el turno de mañana. La resaca llega antes que el sol."
    },
    {
      label: 'Brindar y marcharte temprano',
      fx: { morale: 2, blat: -2, health: 1, intellect: 2 },
      outcome: "Dejas el vaso a medias y vuelves a casa. Al día siguiente nadie te lo menciona, pero tampoco te guardan sitio en la mesa."
    },
    {
      label: 'Aprovechar la reunión para hablar de un favor',
      fx: { blat: 6, morale: -2, intellect: 2, flag: 'networker' },
      outcome: "Entre el segundo y el tercer vaso, el jefe de suministros promete algo. Anótalo: los favores borrachos caducan rápido."
    }
  ]
},

/* ---------------------------------------------------------------- 22+ */
{
  id: 'adult_denounce',
  title: 'Una frase en el pasillo',
  stamp: 'Informe interno · Confidencial',
  minAge: 22,
  cooldown: 5,
  weight: 3,
  cond: (s) => s.stats.loyalty < 75,
  text: "En el pasillo de la oficina, un compañero murmura que los precios suben porque los de arriba roban. Te ve y se calla. Al día siguiente, el secretario del partido pregunta si has oído algo «poco sano». Tienes su nombre en la cabeza.",
  options: [
    {
      label: 'Dar el nombre y firmar el informe',
      fx: { loyalty: 12, blat: 4, morale: -12, flag: 'informer' },
      outcome: "Firmas. Dos semanas después, su mesa está vacía y su familia se muda. Te ascienden a un despacho con ventana."
    },
    {
      label: 'Decir que no oíste nada',
      fx: { morale: 4, loyalty: -5, blat: 6, flag: 'protected_colleague' },
      outcome: "El secretario te mira un segundo de más y cierra la carpeta. Esa noche el compañero te espera en la parada y no dice gracias, pero te ofrece tabaco."
    },
    {
      label: 'Advertirle en voz baja de que está en una lista',
      fx: { blat: 8, loyalty: -8, morale: 8, flag: 'risk' },
      outcome: "Le avisas en la escalera de servicio. Al mes dimite por «motivos familiares» y desaparece de la ciudad. Alguien ha preguntado quién habló con él."
    }
  ]
},

/* ---------------------------------------------------------------- 25+ */
{
  id: 'adult_health',
  title: 'El policlínico del distrito',
  stamp: 'Sanidad estatal · Ficha médica',
  minAge: 25,
  cooldown: 4,
  weight: 4,
  text: "Llevas semanas con dolor en el pecho y las manos frías. El policlínico atiende gratis, pero la cola es de tres horas y el especialista pasa consulta dos días por semana. En el pasillo, un hombre ofrece una consulta privada por dinero.",
  options: [
    {
      label: 'Esperar tu turno en la sanidad pública',
      fx: { health: 9, morale: -3, loyalty: 3 },
      outcome: "El médico te ausculta, te manda reposo y unas pastillas. No hay mucho más. Aun así, sales sabiendo que el Estado no te ha dejado caer."
    },
    {
      label: 'Pagar al especialista por la puerta de atrás',
      sub: 'Cuesta 90 ₽.',
      req: (s) => s.rubles >= 90,
      reqText: '90 ₽',
      fx: { rubles: -90, health: 15, morale: 4, flag: 'bribed_doctor' },
      outcome: "Te recibe en veinte minutos. Te explica lo que el otro médico no tuvo tiempo de mirar. La medicina es gratis; el tiempo, no."
    },
    {
      label: 'Aguantar y seguir trabajando',
      fx: { health: -7, rubles: 80, morale: -4 },
      outcome: "Cierras la ficha y vuelves al taller. El dolor se queda contigo, como un compañero silencioso."
    }
  ]
},

/* ---------------------------------------------------------------- 25+ */
{
  id: 'adult_samizdat',
  title: 'El cuaderno mecanografiado',
  stamp: 'Publicación no registrada',
  minAge: 25,
  cooldown: 6,
  weight: 3,
  text: "Un conocido te deja un cuaderno cosido a mano. Son poemas y un ensayo sobre los campos. Te pide que lo leas esa noche y lo pases a otra persona. En la portada no hay editorial, ni censura, ni número de registro.",
  options: [
    {
      label: 'Leerlo y pasarlo a un amigo de confianza',
      fx: { intellect: 10, loyalty: -9, morale: 8, flag: 'samizdat', risk: 1 },
      outcome: "Lees hasta el amanecer. Algunas frases las copias en un papel que luego quemas. El cuaderno sigue su camino y tú ya no eres del todo el mismo."
    },
    {
      label: 'Leerlo y devolverlo sin pasarlo',
      fx: { intellect: 7, loyalty: -2, morale: 3 },
      outcome: "Devuelves el cuaderno con las tapas intactas. Sabes algo más del país y también de sus silencios."
    },
    {
      label: 'Quemarlo en la estufa',
      fx: { loyalty: 6, morale: -6, intellect: -2, flag: 'burned_book' },
      outcome: "El papel arde deprisa. Miras las cenizas y te dices que has hecho lo prudente. La prudencia también deja cicatriz."
    }
  ]
},

/* ---------------------------------------------------------------- 35+ */
{
  id: 'adult_dacha',
  title: 'Seis sotkas de tierra',
  stamp: 'Comité de empresa · Reparto',
  minAge: 35,
  maxAge: 70,
  cond: (s) => !s.items.includes('dacha'),
  weight: 3,
  text: "La empresa reparte parcelas de dacha entre los trabajadores con antigüedad. Son seis «sotkas», una caseta de madera y un pozo compartido. El sindicato pide una contribución para materiales. Tu nombre está en la lista, pero hay una cola.",
  options: [
    {
      label: 'Aceptar la parcela y pagar los materiales',
      sub: 'Cuesta 650 ₽.',
      req: (s) => s.rubles >= 650,
      reqText: '650 ₽',
      fx: { rubles: -650, item: 'dacha', morale: 12, health: 5, flag: 'dacha_owner' },
      outcome: "Plantas patatas, grosellas y dos manzanos. Los domingos huelen a tierra mojada. Es el único lugar donde nadie te pregunta por el plan."
    },
    {
      label: 'Ceder tu turno al jefe de taller',
      fx: { blat: 12, morale: -4 },
      outcome: "El jefe agradece el gesto con una palmada en la espalda. En la próxima evaluación, tu nombre aparece antes que otros."
    },
    {
      label: 'Renunciar: no tienes fuerzas para otra obligación',
      fx: { morale: 2, health: 2 },
      outcome: "Firmas la renuncia. Tus compañeros se van los viernes con azadas y tomates. Tú te quedas en la ciudad, con el ruido del patio."
    }
  ]
},

/* ---------------------------------------------------------------- 25+ */
{
  id: 'adult_promotion',
  title: 'El despacho del segundo piso',
  stamp: 'Dirección de empresa · Propuesta',
  minAge: 26,
  cond: (s) => s.tier >= 2 && s.tier <= 5,
  cooldown: 6,
  weight: 4,
  text: "El director te llama para ofrecerte un puesto de responsabilidad. Más sueldo, más horas y una nómina de subordinados que te mirarán como te miraban a ti hace diez años. También implica firmar informes que no siempre cuentan la verdad.",
  options: [
    {
      label: 'Aceptar el ascenso',
      fx: { tier: 5, job: 'Jefe de sección', morale: 5, health: -5, loyalty: 6, rubles: 150 },
      outcome: "Te dan una mesa más grande y una carpeta con «pendientes». El primer informe que firmas exagera la producción en un 12 %."
    },
    {
      label: 'Negociar condiciones con el jefe de personal',
      sub: 'Requiere 25 de blat.',
      req: (s) => s.stats.blat >= 25,
      reqText: 'Blat 25',
      fx: { blat: -14, tier: 5, job: 'Jefe de sección', morale: 9, rubles: 300, loyalty: 3 },
      outcome: "Consigues el puesto, un plus y que te asignen un ayudante. El jefe de personal te dice que así se hacen las cosas."
    },
    {
      label: 'Rechazar y quedarte en tu taller',
      fx: { morale: -6, health: 3, blat: -3, loyalty: -2 },
      outcome: "El director no insiste. Tus compañeros te preguntan por qué. Tú dices que prefieres el olor del aceite al de la tinta."
    }
  ]
},

/* ---------------------------------------------------------------- 24+ */
{
  id: 'adult_blackmarket',
  title: 'El hombre del abrigo gris',
  stamp: 'Mercado de Koljós · Sin registro',
  minAge: 24,
  cooldown: 5,
  weight: 4,
  text: "En el mercado de koljós, un hombre abre el abrigo y muestra unos vaqueros envueltos en papel. Pide el triple de lo que cuesta un mes de comida. Detrás de él, dos milicianos charlan junto a un puesto de manzanas. El hombre dice que si no compras ahora, mañana no estarán.",
  options: [
    {
      label: 'Comprar los vaqueros',
      sub: 'Cuestan 260 ₽.',
      req: (s) => s.rubles >= 260,
      reqText: '260 ₽',
      fx: { rubles: -260, morale: 10, blat: 6, flag: 'risk', risk: 1 },
      outcome: "Los escondes bajo la camisa y vuelves a casa por calles distintas. Al ponértelos, te miras en el espejo del portal como si fueras otro."
    },
    {
      label: 'Comprar para revender más caros',
      fx: { rubles: -260, morale: 4, blat: 10, deals: 1, risk: 2, flag: 'risk' },
      outcome: "Dos semanas después los vendes por el doble a un hijo de funcionario. El dinero quema un poco en el bolsillo."
    },
    {
      label: 'Señalarlo a los milicianos',
      fx: { loyalty: 9, blat: -10, morale: -10, flag: 'informer' },
      outcome: "Los milicianos lo empujan contra el puesto. Tú sigues andando con las manos en los bolsillos. Los vaqueros quedan tirados en el barro."
    }
  ]
},

/* ---------------------------------------------------------------- 24+ */
{
  id: 'adult_party_join',
  title: 'La solicitud de ingreso',
  stamp: 'Comité del PCUS · Forma 4',
  minAge: 24, maxAge: 55,
  cond: (s) => !s.party && s.stats.loyalty >= 45,
  weight: 4,
  text: "El secretario del partido te sugiere que presentes la solicitud. Necesitas dos avales, un historial limpio y una entrevista. El carné da acceso a reuniones cerradas, a la lista de vivienda y a ciertas tiendas. También te obliga a asistir y a callar en determinadas conversaciones.",
  options: [
    {
      label: 'Presentar la solicitud y pasar por la entrevista',
      fx: { party: true, loyalty: 10, blat: 8, morale: -5, flag: 'party_member' },
      outcome: "Te aprueban por unanimidad. El carné es pequeño y rojo. En la reunión mensual aprendes que la unanimidad es una costumbre, no un resultado."
    },
    {
      label: 'Agradecer el gesto y no presentarla',
      fx: { morale: 6, loyalty: -6, blat: -3, flag: 'refused_party' },
      outcome: "El secretario archiva el formulario en blanco. «Otro año será», dice. Tú sabes que no."
    },
    {
      label: 'Presentarla, pero mantener distancia de las reuniones',
      fx: { party: true, loyalty: 4, morale: -2, flag: 'party_passive' },
      outcome: "Te dan el carné y faltas a la mitad de las reuniones. Nadie te expulsa; nadie te asciende."
    }
  ]
},

/* ---------------------------------------------------------------- 35-55 */
{
  id: 'adult_parents_death',
  title: 'La casa vacía',
  stamp: 'Certificado de defunción',
  minAge: 36, maxAge: 58,
  cond: (s) => !s.flags.parents_dead,
  weight: 3,
  text: "Tu madre muere un martes por la mañana, en la cama que ocupó durante cuarenta años. En el armario hay un icono envuelto en una sábana, tres cartillas de ahorro y cartas que nunca envió. Tu padre, si vive, no dice nada y mira por la ventana.",
  options: [
    {
      label: 'Quedarte con el icono y las cartas',
      fx: { item: 'icon', morale: 8, health: -2, flag: 'parents_dead' },
      outcome: "Cuelgas el icono en un rincón oscuro del pasillo. Cada vez que pasas, tu madre sigue ahí, en silencio."
    },
    {
      label: 'Vender lo que haya de valor',
      fx: { rubles: 420, morale: -8, flag: 'parents_dead', blat: 2 },
      outcome: "Un anticuario del mercado de koljós paga sin regatear. El armario queda vacío y la casa huele a polvo."
    },
    {
      label: 'Repartir todo entre los hermanos y cerrar la casa',
      fx: { morale: 3, health: 3, flag: 'parents_dead', blat: 4 },
      outcome: "Os repartís las sábanas y las fotos. La casa se vende a una familia que llegó del campo. Nadie discute por el icono."
    }
  ]
},

/* ---------------------------------------------------------------- 30+ */
{
  id: 'adult_sanatorium',
  title: 'El sanatorio del sindicato',
  stamp: 'Seguridad social · Vale',
  minAge: 30, maxAge: 72,
  cond: (s) => s.stats.health < 78,
  cooldown: 6,
  weight: 3,
  text: "El sindicato ofrece un vale para el sanatorio de Sochi: tres semanas, dieta, baños de mar y reposo. El Estado lo subvenciona casi por completo, pero hay que pagar el viaje y alguien tiene que cubrir tu turno. El médico dice que te iría bien.",
  options: [
    {
      label: 'Tomar el vale y marcharte',
      sub: 'Cuesta 180 ₽.',
      req: (s) => s.rubles >= 180,
      reqText: '180 ₽',
      fx: { rubles: -180, health: 18, morale: 12, loyalty: 2 },
      outcome: "Desayunas fruta, caminas por la playa de guijarros y duermes sin pastillas. Vuelves con la piel más oscura y una deuda de favores con el que cubrió tu turno."
    },
    {
      label: 'Ceder el vale a tu cónyuge',
      cond: (s) => s.spouse,
      fx: { morale: 8, health: -2, blat: 4 },
      outcome: "Ella vuelve renovada y habla del mar durante semanas. Tú sigues tosiendo en el patio, pero su risa también es tuya."
    },
    {
      label: 'Rechazarlo: no puedes dejar el trabajo',
      fx: { health: -5, morale: -3, rubles: 60, loyalty: 4 },
      outcome: "El médico anota «rechaza tratamiento» en tu ficha. Tú vuelves al taller y al café aguado."
    }
  ]
},

/* ---------------------------------------------------------------- 30+ */
{
  id: 'adult_lada',
  title: 'La lista del automóvil',
  stamp: 'Comisión de distribución · Cola',
  minAge: 32, maxAge: 75,
  cond: (s) => !s.items.includes('lada') && s.rubles >= 4500,
  weight: 2,
  text: "Llevas años en la lista para un coche. El concesionario avisa de que hay un Lada Zhiguli disponible, pero hay que pagarlo entero y demostrar que no lo revenderás. En la puerta, alguien ofrece el doble por tu turno.",
  options: [
    {
      label: 'Comprar el Lada',
      sub: 'Cuesta 4.500 ₽.',
      req: (s) => s.rubles >= 4500,
      reqText: '4.500 ₽',
      fx: { rubles: -4500, item: 'lada', morale: 15, blat: 8, flag: 'car_owner' },
      outcome: "Te entregan las llaves con un discurso breve. Conduces despacio por la avenida, saludando a vecinos que fingen no verte."
    },
    {
      label: 'Vender tu turno al mejor postor',
      fx: { rubles: 1800, blat: 12, morale: -4, flag: 'risk' },
      outcome: "El comprador paga en billetes doblados. Tú sigues esperando, con más dinero y menos coche."
    },
    {
      label: 'Renunciar: el coche es un lujo',
      fx: { morale: -3, rubles: 100, blat: 2 },
      outcome: "Firmas la renuncia. El tranvía sigue pasando cada doce minutos. A veces no."
    }
  ]
},

/* ---------------------------------------------------------------- 60+ */
{
  id: 'adult_retirement',
  title: 'El expediente de jubilación',
  stamp: 'Seguridad social · Cálculo',
  minAge: 60, maxAge: 74,
  cond: (s) => !s.retired,
  weight: 10,
  text: "Cumples sesenta años. La ley te reconoce el derecho a una pensión: unos 120–140 ₽ al mes según el historial. Puedes retirarte, seguir trabajando o aceptar un puesto de vigilante que apenas exige presencia. El país necesita manos, pero también sabe que ya no eres joven.",
  options: [
    {
      label: 'Jubilarte y dejar el trabajo',
      fx: { retired: true, job: 'Jubilado', health: 6, morale: 3, loyalty: 2 },
      outcome: "Entregas el pase y el mono. La primera mañana sin despertador te parece un lujo y, a la semana, una condena."
    },
    {
      label: 'Seguir trabajando mientras el cuerpo aguante',
      fx: { health: -8, rubles: 400, morale: 4, loyalty: 5, flag: 'kept_working' },
      outcome: "Te quedas en el taller. Los jóvenes te llaman «abuelo» y te piden que les enseñes lo que ya nadie enseña."
    },
    {
      label: 'Aceptar el puesto de vigilante nocturno',
      fx: { retired: true, job: 'Vigilante', health: -2, rubles: 200, morale: 1 },
      outcome: "Pasas las noches en una garita con una estufa y una radio. Cobras poco y duermes a ratos. La ciudad se apaga a tu alrededor."
    }
  ]
}

]);
