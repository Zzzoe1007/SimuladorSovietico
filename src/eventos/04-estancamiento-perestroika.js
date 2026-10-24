/* ============================================================================
 * EVENTOS · 04 — ESTANCAMIENTO Y PERESTROIKA (1964–1991)
 * Praga, Afghanistán, Chernóbil, escasez, cooperativas, golpe de 1991.
 * Fechas reales; los dilemas concretos son ficción documentada.
 * ==========================================================================*/

addEvents([

/* ============================= ESTANCAMIENTO ============================= */

{
  id: 'stag_1968_prague',
  title: 'Los tanques en Praga',
  stamp: 'TASS · 21 de agosto',
  year: 1968,
  minAge: 16, maxAge: 85,
  weight: 9,
  text: "La primavera de Praga termina con la entrada de los ejércitos del Pacto de Varsovia. La televisión habla de «ayuda internacionalista»; los estudiantes de tu ciudad comentan otra cosa. En la facultad han desaparecido dos profesores. Alguien deja un panfleto en tu taquilla.",
  options: [
    {
      label: 'Apoyar la intervención en la reunión del partido',
      fx: { loyalty: 10, morale: -8, blat: 3 },
      outcome: "Lees el comunicado oficial con voz firme. En el pasillo, una profesora te mira como si te acabara de descubrir."
    },
    {
      label: 'Firmar una protesta y llevarla a la embajada',
      fx: { loyalty: -16, morale: 14, intellect: 4, risk: 3, flag: 'dissident' },
      outcome: "Vas en grupo, con abrigos y gafas oscuras. En la puerta de la embajada hay milicianos con cámaras. Nadie te detiene ese día; tu nombre empieza a circular."
    },
    {
      label: 'Guardar silencio y conservar tu puesto',
      fx: { morale: -5, intellect: 2, loyalty: 2 },
      outcome: "No firmas ni protestas. En el trabajo, el tema se apaga en una semana. Tú lo recuerdas cada agosto."
    }
  ]
},

{
  id: 'stag_1970_deficit',
  title: 'La tienda vacía',
  stamp: 'Comercio estatal · Inventario',
  from: 1970, to: 1984,
  minAge: 20, maxAge: 85,
  cooldown: 6,
  weight: 6,
  text: "La tienda del barrio tiene las estanterías medio vacías. No hay mantequilla, ni jabón, ni carne, pero el cartel dice que el plan se ha cumplido. La dependienta explica que «mañana llega un camión». En la puerta, un hombre ofrece productos «de la reserva» a precios de mercado negro.",
  options: [
    {
      label: 'Hacer cola y comprar lo que haya',
      fx: { health: -2, morale: -3, rubles: -40, flag: 'food_stock' },
      outcome: "Consigues pasta, sal y una lata abollada. La cena de hoy está asegurada. La de mañana se verá."
    },
    {
      label: 'Comprar al hombre de la puerta',
      sub: 'Cuesta 140 ₽.',
      req: (s) => s.rubles >= 140,
      reqText: '140 ₽',
      fx: { rubles: -140, health: 3, morale: 5, blat: 4, risk: 1 },
      outcome: "Pagas sin preguntar de dónde sale. Te da una bolsa doble y un consejo: «No vuelva siempre por la misma puerta»."
    },
    {
      label: 'Quejarte en el sindicato',
      fx: { loyalty: -4, morale: 2, blat: 2, flag: 'complained_shortage' },
      outcome: "El delegado apunta tu queja en un cuaderno. Al mes siguiente, la tienda recibe una partida extra y una inspección."
    }
  ]
},

{
  id: 'stag_1972_kgb',
  title: 'El registro de las seis de la mañana',
  stamp: 'KGB · Orden de registro',
  from: 1970, to: 1984,
  minAge: 22, maxAge: 80,
  cond: (s) => s.flags.risk || s.flags.dissident || s.stats.loyalty < 40,
  weight: 7,
  text: "A las seis de la mañana llaman a tu puerta. Cuatro hombres con abrigo gris presentan una orden de registro. Mientras uno lee el documento, los demás abren cajones y revisan libros. Buscan «literatura antisoviética» y «contactos extranjeros». Tu familia observa desde la cocina.",
  options: [
    {
      label: 'Colaborar y entregar tus libros prohibidos',
      fx: { loyalty: 8, morale: -14, intellect: -4, risk: -2, flag: 'searched' },
      outcome: "Entregas los cuadernos y un mapa del extranjero. Te citan para una «conversación». El registro termina con un acta que firmas sin leer."
    },
    {
      label: 'Negar que tengas nada y dejar que registren',
      fx: { morale: -8, intellect: 2, risk: 1, flag: 'searched' },
      outcome: "Encuentran un libro de Solzhenitsyn bajo el colchón. No te detienen, pero se lo llevan. En el informe consta que «no mostró arrepentimiento»."
    },
    {
      label: 'Llamar a tu contacto del comité por teléfono',
      sub: 'Requiere 35 de blat y 200 ₽.',
      req: (s) => s.stats.blat >= 35 && s.rubles >= 200,
      reqText: 'Blat 35 · 200 ₽',
      fx: { blat: -30, rubles: -200, morale: 4, risk: -1, flag: 'searched' },
      outcome: "El teléfono suena en una oficina del comité. Uno de los hombres escucha, cambia de tono y acorta el registro. Te devuelven la mitad de los libros."
    }
  ]
},

{
  id: 'stag_1975_helsinki',
  title: 'Los acuerdos de Helsinki',
  stamp: 'Cancillería · Acta final',
  year: 1975,
  minAge: 18, maxAge: 85,
  weight: 7,
  text: "La URSS firma los acuerdos de Helsinki: fronteras reconocidas, pero también compromisos sobre derechos humanos. Un grupo de conocidos propone crear una sección de vigilancia para comprobar si el Estado cumple lo firmado. Te piden que firmes como testigo.",
  options: [
    {
      label: 'Firmar y participar en el grupo de vigilancia',
      fx: { loyalty: -14, morale: 14, intellect: 6, risk: 3, flag: 'dissident', flags: { helsinki: true } },
      outcome: "Firmas el acta fundacional en un piso pequeño. Durante meses, recoges testimonios y los envías al extranjero. El teléfono empieza a sonar con interferencias."
    },
    {
      label: 'Firmar en privado, sin aparecer en público',
      fx: { morale: 6, loyalty: -5, intellect: 3, blat: 3, flag: 'helsinki' },
      outcome: "Firmas una copia que se guarda en un cajón. No vas a las reuniones. Sabes que tu nombre está en algún sitio, pero también que no encabeza ninguna lista."
    },
    {
      label: 'Negarte: los papeles no cambian nada',
      fx: { morale: -4, loyalty: 3, intellect: 2 },
      outcome: "Devuelves el documento sin firmar. Tu conocido no insiste. Años después, recuerdas su cara cuando lo detuvieron."
    }
  ]
},

{
  id: 'stag_1977_constitution',
  title: 'La nueva Constitución',
  stamp: 'Sóviet Supremo · Artículo 6',
  year: 1977,
  minAge: 16, maxAge: 85,
  weight: 6,
  text: "Se adopta una nueva Constitución. El artículo 6 consagra el papel dirigente del Partido; el resto promete derechos, vivienda, trabajo y educación. En tu centro de trabajo se organiza una discusión pública para «estudiar el texto». Piden opiniones.",
  options: [
    {
      label: 'Alabar el texto y el papel del Partido',
      fx: { loyalty: 8, morale: -2, blat: 3 },
      outcome: "Hablas de la «democracia socialista más avanzada del mundo». El secretario asiente. Alguien toma nota de tu intervención."
    },
    {
      label: 'Preguntar cómo se garantizan los derechos del artículo 6',
      fx: { intellect: 7, loyalty: -6, morale: 4, risk: 1, flag: 'constitutional_skeptic' },
      outcome: "Tu pregunta queda sin respuesta. El moderador pasa a otro tema. En el pasillo, un compañero te felicita en voz baja."
    },
    {
      label: 'Asistir en silencio y firmar el acta',
      fx: { morale: 1, loyalty: 1, intellect: 1 },
      outcome: "Firmas la lista de asistencia y te vas. El texto se archiva en una carpeta que nadie volverá a abrir."
    }
  ]
},

{
  id: 'stag_1979_afghan',
  title: 'El limited contingent',
  stamp: 'Ministerio de Defensa · Orden',
  year: 1979,
  minAge: 17, maxAge: 55,
  weight: 10,
  text: "En diciembre, las tropas soviéticas entran en Afganistán. La radio habla de «ayuda internacionalista»; las madres de los soldados hablan de otra cosa. En la oficina de reclutamiento, los jóvenes de tu barrio reciben citaciones. La guerra no se llama guerra.",
  options: [
    {
      label: 'Presentarte voluntario para Afganistán',
      fx: { loyalty: 14, health: -16, morale: 4, item: 'medals', flag: 'afghan_veteran', army: true },
      outcome: "Vuelves dos años después, con una medalla y una tos que no se va. Nadie te pregunta qué viste. Tú tampoco lo cuentas."
    },
    {
      label: 'Apoyar públicamente la intervención',
      fx: { loyalty: 8, morale: -4, blat: 3 },
      outcome: "Firmas el comunicado de apoyo. En casa, tu madre guarda silencio. La guerra entra en las cocinas como un pariente incómodo."
    },
    {
      label: 'Firmar una carta contra la guerra',
      fx: { loyalty: -16, morale: 12, risk: 3, flag: 'dissident' },
      outcome: "Firmas con otras veinte personas. La carta llega a una agencia extranjera. Durante meses, tu teléfono suena con un chasquido antes de cada llamada."
    }
  ]
},

{
  id: 'stag_1980_olympics',
  title: 'Moscú 1980',
  stamp: 'Comité Olímpico · Acreditación',
  year: 1980,
  minAge: 12, maxAge: 85,
  weight: 8,
  text: "Moscú se prepara para los Juegos Olímpicos. Se pintan fachadas, se retiran mendigos y coches viejos de las avenidas, se raciona el alcohol en algunas zonas. En las tiendas aparecen productos que nunca volverás a ver. Las entradas son caras y difíciles de conseguir.",
  options: [
    {
      label: 'Comprar entradas y asistir a una final',
      sub: 'Cuesta 250 ₽.',
      req: (s) => s.rubles >= 250,
      reqText: '250 ₽',
      fx: { rubles: -250, morale: 18, loyalty: 6, flag: 'olympics_1980' },
      outcome: "Ves la final de gimnasia desde una grada alta. La bandera sube y el estadio canta. Por unas horas, el país es exactamente lo que dice ser."
    },
    {
      label: 'Verlo por televisión con los vecinos',
      fx: { morale: 8, loyalty: 3, blat: 2 },
      outcome: "Os sentáis doce personas alrededor de un televisor. Cuando gana la URSS, el patio entero grita. Alguien trae una botella escondida."
    },
    {
      label: 'Aprovechar el mercado que dejan los turistas',
      fx: { rubles: 300, blat: 8, risk: 2, flag: 'risk' },
      outcome: "Cambias pins, discos y camisetas por divisas. Los turistas pagan bien. La milicia tiene orden de no arruinar la imagen del país, pero toma nota."
    }
  ]
},

{
  id: 'stag_1982_brezhnev',
  title: 'Muere Brézhnev',
  stamp: 'Radio Moscú · 10 de noviembre',
  year: 1982,
  minAge: 14, maxAge: 90,
  weight: 9,
  text: "Tras dieciocho años en el poder, Leonid Brézhnev muere. La televisión emite música fúnebre y discursos sobre la continuidad. En la calle, la gente comenta en voz baja que el país lleva años detenido. Andropov, antiguo jefe de la KGB, toma el relevo.",
  options: [
    {
      label: 'Esperar que Andropov limpie el aparato',
      fx: { loyalty: 6, morale: 2, intellect: 3 },
      outcome: "Lees sus primeros discursos y ves una disciplina nueva. Durante un año, las calles amanecen más limpias y las oficinas más silenciosas."
    },
    {
      label: 'Temer que la KGB gobierne abiertamente',
      fx: { morale: -6, loyalty: -5, intellect: 5, flag: 'andropov_fear' },
      outcome: "Recuerdas a los hombres que te registraron el piso. Ahora uno de ellos dirige el país. Tu teléfono vuelve a sonar con chasquidos."
    },
    {
      label: 'Encogerte de hombros: los líderes cambian, la cola sigue',
      fx: { morale: 2, health: 1, blat: 1 },
      outcome: "Sigues con tu vida. En la tienda, la cola de la mantequilla es idéntica. El retrato nuevo se parece demasiado al anterior."
    }
  ]
},

{
  id: 'stag_1984_andropov',
  title: 'La disciplina de Andropov',
  stamp: 'Comité de control · Inspección',
  from: 1983, to: 1985,
  minAge: 18, maxAge: 80,
  weight: 7,
  text: "Las inspecciones se multiplican. Se controla la puntualidad, el consumo de alcohol en el trabajo y las conversaciones en los pasillos. Un compañero ha sido expulsado del partido por llegar tarde tres veces. En la oficina, todos miran el reloj.",
  options: [
    {
      label: 'Cumplir estrictamente y no llamar la atención',
      fx: { loyalty: 6, health: -3, morale: -4, blat: -2 },
      outcome: "Llegas diez minutos antes y te vas diez minutos después. Tu expediente queda impecable. Tu vida, también invisible."
    },
    {
      label: 'Defender a tu compañero expulsado',
      fx: { loyalty: -8, morale: 8, blat: 5, risk: 1 },
      outcome: "Pides que se revise el caso. El comité te escucha y no cambia nada. Tu compañero te lo agradece; el secretario te añade a una lista."
    },
    {
      label: 'Aprovechar las inspecciones para denunciar a un rival',
      fx: { loyalty: 8, blat: 4, morale: -10, flag: 'informer' },
      outcome: "Señalas las ausencias de un colega que aspiraba a tu puesto. Lo sancionan. Tú heredas su mesa y su carpeta."
    }
  ]
},

/* ============================== PERESTROIKA ============================== */

{
  id: 'per_1985_antialcohol',
  title: 'La campaña contra el alcohol',
  stamp: 'Comité Central · Decreto',
  year: 1985,
  minAge: 16, maxAge: 90,
  weight: 9,
  text: "Gorbachov lanza una campaña contra el alcohol: suben los precios, cierran las licorerías y se prohíben las borracheras en el trabajo. En los patios aparecen destilerías caseras. El azúcar escasea porque se usa para fabricar alcohol ilegal. En la oficina, el vaso de después del turno desaparece.",
  options: [
    {
      label: 'Dejar de beber y apuntarte a la campaña',
      fx: { health: 10, loyalty: 6, morale: -4, blat: -2, flag: 'sober' },
      outcome: "Vas a las reuniones de la sociedad de temperancia. Duermes mejor, discutes menos y tus compañeros te invitan menos."
    },
    {
      label: 'Comprar licor de contrabando',
      fx: { health: -4, morale: 6, blat: 6, risk: 1, flag: 'moonshine' },
      outcome: "Encuentras una botella turbia en el mercado. Sabe a rayos, pero calienta. El que te la vende también vende azúcar racionada."
    },
    {
      label: 'Protestar por la pérdida de ingresos del Estado',
      fx: { intellect: 6, loyalty: -5, morale: 3, rubles: -30 },
      outcome: "Calculas cuánto recaudaba el Estado por el vodka y cuánto pierde ahora. Lo comentas en el trabajo. Nadie te discute, pero alguien cambia de tema."
    }
  ]
},

{
  id: 'per_1986_chernobyl',
  title: 'El reactor de Chernóbil',
  stamp: 'TASS · 28 de abril',
  year: 1986,
  minAge: 14, maxAge: 90,
  weight: 12,
  text: "El 26 de abril explota el reactor 4 de la central de Chernóbil. Durante dos días, la radio no dice nada; luego habla de un «accidente» y de «niveles normales». En Kiev se celebra el Primero de Mayo mientras la nube avanza. Los que pueden, mandan a los niños fuera de la ciudad.",
  options: [
    {
      label: 'Presentarte voluntario para las labores de limpieza',
      sub: 'Los «liquidadores» reciben un pago y una medalla.',
      fx: { health: -18, loyalty: 12, rubles: 600, item: 'medals', flag: 'liquidator' },
      outcome: "Trabajas tres semanas retirando escombros en el tejado. Te dan un certificado, una medalla y un dosímetro que no siempre funciona. Años después, el certificado no paga las medicinas."
    },
    {
      label: 'Enviar a tu familia lejos y quedarte a trabajar',
      cond: (s) => s.spouse || s.children > 0,
      fx: { health: -8, morale: 6, rubles: -250, blat: 5, flag: 'chernobyl_family' },
      outcome: "Metes a tu mujer y a los niños en un tren hacia el este. También a tu madre. Tú te quedas en la ciudad, con las ventanas cerradas y la radio encendida."
    },
    {
      label: 'Desconfiar de la versión oficial y guardar yodo',
      fx: { intellect: 8, loyalty: -6, health: 4, morale: -4, flag: 'chernobyl_skeptic' },
      outcome: "Compras yodo en la farmacia y cierras las ventanas. Los vecinos se ríen. Semana y media después, llegan las pastillas oficiales y las recomendaciones que ya habías tomado."
    }
  ]
},

{
  id: 'per_1987_coop',
  title: 'La primera cooperativa',
  stamp: 'Ley de cooperativas · Registro',
  year: 1987,
  minAge: 20, maxAge: 80,
  weight: 8,
  text: "La nueva ley permite abrir cooperativas privadas. Un conocido propone montar un taller de reparaciones o un café. Hace falta capital, un local y estómago para los impuestos y las inspecciones. El Estado lo permite, pero no lo facilita.",
  options: [
    {
      label: 'Invertir tus ahorros en la cooperativa',
      sub: 'Requiere 1.200 ₽.',
      req: (s) => s.rubles >= 1200,
      reqText: '1.200 ₽',
      fx: { rubles: -1200, morale: 8, blat: 8, flag: 'cooperator', risk: 1 },
      outcome: "Firmas el contrato en una oficina con olor a humedad. Los primeros meses pierdes dinero; al año, el taller tiene lista de espera y dos empleados."
    },
    {
      label: 'Trabajar en la cooperativa como asalariado',
      fx: { rubles: 300, blat: 5, intellect: 4, morale: 2 },
      outcome: "Cobras más que en la fábrica, pero sin antigüedad ni pensión completa. El dueño dice que eso es el futuro. Tú no estás seguro."
    },
    {
      label: 'Quedarte en el empleo estatal',
      fx: { loyalty: 5, morale: -2, health: 1, flag: 'state_loyal' },
      outcome: "Desconfías del negocio privado. En la fábrica te llaman «conservador». Cuando la cooperativa quiebra, te llaman «visionario»."
    }
  ]
},

{
  id: 'per_1989_wall',
  title: 'Cae el muro',
  stamp: 'Televisión · 9 de noviembre',
  year: 1989,
  minAge: 14, maxAge: 90,
  weight: 9,
  text: "Las imágenes del muro de Berlín cayendo dan la vuelta al mundo. En la URSS, la glásnost permite verlas en televisión. Los países del Este cambian de régimen uno tras otro. En tu oficina, alguien pregunta si lo mismo puede pasar aquí. Nadie responde.",
  options: [
    {
      label: 'Celebrar la libertad de los pueblos del Este',
      fx: { morale: 12, loyalty: -8, intellect: 5, flag: 'pro_wall_fall' },
      outcome: "Brindas con un vecino que acaba de volver de Berlín. Por primera vez, el futuro parece abierto. También parece incierto."
    },
    {
      label: 'Preocuparte por la seguridad del país',
      fx: { loyalty: 6, morale: -4, intellect: 2 },
      outcome: "Escuchas los discursos sobre el «caos» y la «OTAN». Te preguntas qué quedará de todo esto. La respuesta llegará antes de lo que crees."
    },
    {
      label: 'Comprar productos occidentales antes de que suban',
      fx: { rubles: -300, morale: 8, blat: 4, item: 'suit' },
      outcome: "Adquieres un traje y un radiocasete en el mercado. Los precios suben cada semana. Tu traje parece una inversión y un disfraz."
    }
  ]
},

{
  id: 'per_1990_shortage',
  title: 'El país de las colas',
  stamp: 'Comercio · Racionamiento',
  from: 1990, to: 1991,
  minAge: 16, maxAge: 90,
  weight: 9,
  text: "Las estanterías están vacías. Se raciona el azúcar, el jabón, el tabaco y hasta el pan en algunas ciudades. La gente hace cola desde antes del amanecer y vuelve con las manos vacías. En el mercado libre, los precios cambian cada semana. El dinero pierde sentido.",
  options: [
    {
      label: 'Acumular lo que puedas y guardar para el invierno',
      fx: { rubles: -200, health: 4, morale: -2, flag: 'hoarder' },
      outcome: "Llenas el armario de conservas, cerillas y jabón. Te sientes ridículo y, al mismo tiempo, preparado. El invierno será largo."
    },
    {
      label: 'Cambiar tus bienes por comida con los vecinos',
      sub: 'El televisor, si aún lo tienes.',
      req: (s) => s.items.includes('tv'),
      reqText: 'Televisor',
      fx: { morale: 4, blat: 8, health: 2, removeItem: 'tv', flag: 'barter' },
      outcome: "Cambias el televisor por dos sacos de patatas y un jamón. El vecino se queda con el aparato y tú con la cena. Nadie sale perdiendo del todo."
    },
    {
      label: 'Confiar en que el Estado repondrá las tiendas',
      fx: { morale: -6, health: -4, loyalty: 5, flag: 'trusted_state' },
      outcome: "Esperas el camión que nunca llega. La cartilla de racionamiento cubre menos cada mes. La fe también se raciona."
    }
  ]
},

{
  id: 'per_1991_coup',
  title: 'El Comité de Emergencia',
  stamp: 'Radio · 19 de agosto',
  year: 1991,
  minAge: 16, maxAge: 95,
  weight: 12,
  text: "Un golpe de Estado. Tanques en las calles de Moscú, música clásica en la radio y un comunicado del Comité Estatal de Emergencia. Gorbachov está «indispuesto» en Crimea. En la televisión, los golpistas prometen orden. En la calle, la gente se reúne frente al Parlamento.",
  options: [
    {
      label: 'Ir a la plaza y defender el Parlamento',
      fx: { health: -8, morale: 18, loyalty: -10, risk: 2, flag: 'defended_parliament' },
      outcome: "Pasas la noche junto a una barricada hecha con autobuses. Un chico te ofrece café y otro te explica cómo funciona un fusil. Al amanecer, los tanques se retiran."
    },
    {
      label: 'Quedarte en casa y escuchar la radio',
      fx: { morale: -4, health: 2, intellect: 4, flag: 'stayed_home_1991' },
      outcome: "Sigues las emisiones de la radio y de la televisión, que se contradicen. Cuando vuelve la señal independiente, entiendes que el golpe ha fracasado."
    },
    {
      label: 'Apoyar al Comité de Emergencia',
      fx: { loyalty: 8, morale: -8, blat: -4, flag: 'supported_coup' },
      outcome: "Firmas el comunicado de apoyo en tu centro de trabajo. El golpe dura tres días. Tu firma, mucho más."
    }
  ]
}

]);
