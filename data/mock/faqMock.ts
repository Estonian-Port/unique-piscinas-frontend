import { FAQ } from '../domain/faq';

const faq1: FAQ = {
  question: '¿Cómo funciona el sistema de filtración?',
  answer: `El sistema de filtración es el encargado de mantener el agua de la piscina limpia y cristalina. Funciona mediante una bomba que hace circular el agua a través de un filtro que retiene las impurezas y eventualmente las envía al desagüe auto limpiandose. Para activar el sistema de manera **MANUAL**, primero debe seleccionar las entradas de agua (**Fondo**, **Skimmer**, **Barrefondo** o **Tanque de Compensación**) y luego elegir el modo **FILTRAR**.`,
};

const faq2: FAQ = {
  question: '¿Para qué sirven las diferentes entradas de agua?',
  answer: `    • **Fondo:** Aspira el agua desde el fondo de la piscina, recogiendo la suciedad que se flota en el sector bajo de la piscina.
    • **Skimmer:** Recoge el agua de la superficie, eliminando hojas, insectos y otros elementos flotantes.
    • **Barrefondo:** Se utiliza cuando conectamos un limpiafondos manual o automático para aspirar la suciedad del fondo.
    • **Tanque de Compensación (T.C.):** En piscinas desbordantes, recoge el agua que rebosa por los bordes y la devuelve filtrada en el sistema.

Para activar una entrada, simplemente haga clic en el botón correspondiente. Puede seleccionar varias entradas simultáneamente.`,
};

const faq3: FAQ = {
  question: '¿Qué hacen los diferentes modos de filtración? ',
  answer: `    • **Filtrar:** Es el modo normal de funcionamiento. El agua pasa a través del filtro para eliminar impurezas y luego regresa a la piscina filtrada y desinfectada.
    • **Recircular:** El agua circula sin pasar por el filtro. Útil únicamente si se añaden productos químicos que no deben pasar por el filtro.
    • **Retrolavar:** Invierte el flujo de agua para limpiar el filtro, expulsando la suciedad acumulada dentro de él. Se debe realizar periódicamente cuando la presión aumenta.
    • **Desagotar:** Envía el agua directamente al desagüe sin pasar por el filtro. Se utiliza para vaciar parcialmente la piscina o eliminar agua muy sucia.

Para activar un modo, primero seleccione las entradas de agua y luego pulse el botón del modo deseado en el panel de control de filtro.`,
};

const faq4: FAQ = {
  question: '¿Qué son los sistemas germicidas y cómo funcionan?',
  answer: `Los sistemas germicidas son dispositivos complementarios que ayudan a mantener el agua limpia y libre de microorganismos. Su sistema cuenta con hasta tres tipos:
    • **Sistema UV:** Utiliza luz ultravioleta para eliminar bacterias, virus y algas. El agua pasa a través de una cámara con lámparas UV que destruyen los microorganismos.
    • **Ionizador de cobre:** Libera iones de cobre en el agua que tienen propiedades alguicidas y bactericidas, reduciendo la necesidad de productos químicos. Previene tanto como combate.
    • **Transductor ultrasónico:** Emite ondas ultrasónicas que previenen la formación de algas y biofilm en las superficies de la piscina, y con ello el crecimiento de colonias de organismos alojados en rincones y cañerías.

Estos sistemas se activan automáticamente cuando el filtro está en modo **"Filtrar"** o **"Recircular"**, pero se desactivan en los modos **"Retrolavar"** y **"Desagotar"** para proteger los equipos.`,
};

const faq5: FAQ = {
  question: '¿Cómo programo los ciclos de filtración?',
  answer: `La programación de los ciclos de filtración se realiza en la pestaña **"Programación"**. Allí encontrará un calendario semanal donde puede configurar los horarios de funcionamiento del sistema. Seleccione los días de la semana en los que desea que funcione el sistema. Configure las horas de inicio y finalización para cada día. Guarde la configuración pulsando el botón correspondiente. Se recomienda programar al menos entre **6 y 8 horas diarias** de filtración en verano **(3 ciclos diarios de 2:30 hs cada uno)** y **4 horas en invierno**, preferiblemente divididas en dos ciclos.`,
};

const faq6: FAQ = {
  question: '¿Cuándo debo realizar el retrolavado del filtro?',
  answer: `El retrolavado debe realizarse cuando la presión del filtro aumente a **1 bar**, lo que indica que el filtro está obstruido por la suciedad acumulada.
Para realizar un retrolavado: 
   • Detenga la bomba si está en funcionamiento.
   • Seleccione la entrada de agua **"Fondo"**
   • Active el modo **"Retrolavar"** en el panel de control. 
El sistema comenzara a hacer un lavado interno del filtro enviando al desagüe los restos de suciedad que están obstruyendo un buen filtrado, esta operación puede durar hasta **2 minutos**. Seguido hará un **ENJUAGUE** del mismo para asegurarse que no queden restos en las cañerías, esto tomara solo **10 segundos**. Luego su equipo de filtrado estará listo para operar normalmente con mas eficacia.`,
};

export const faqsMock: FAQ[] = [faq1, faq2, faq3, faq4, faq5, faq6];
