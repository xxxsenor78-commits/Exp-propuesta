/* ============================================================
   CONFIGURACIÓN DEL EXPEDIENTE
   Edita únicamente este archivo para personalizar el contenido.
   No es necesario tocar app.js ni el HTML.
   ============================================================ */

const CONFIG = {

  acceso: {
    usuario: "Clara001",
    clave: "Picadilly03"
  },

  // ---- Datos generales del caso ----
  caso: {
    numero: "2026-LV-001",
    demandante: "Boris Maurico Murillo Mejia",
    jueza: "Clara Marcela Morantes Angarita",
    estado: "En investigación",
    nivel: "Confidencial"
  },

  // ---- Texto de introducción (después de abrir el expediente) ----
  intro: {
    parrafos: [
      "Durante los últimos días, este sistema ha recopilado distintas pruebas relacionadas con el caso.",
      "Cada una fue entregada, revisada y archivada en el orden correspondiente.",
      "Antes de emitir cualquier conclusión, la jueza deberá examinar personalmente cada evidencia presentada."
    ]
  },

  // ---- Evidencias (4 tarjetas) ----
  // imagen: ruta dentro de /assets. Si no existe, se mostrará un marcador de posición.
  evidencias: [
    {
      titulo: "PRUEBA DOCUMENTAL",
      imagen: "assets/evidencia-1.jpeg",
      historia: "El presente documento corresponde a una carta escrita de puño y letra por el demandante durante el trayecto terrestre entre la ciudad de Cúcuta y la ciudad de Bucaramanga, el día 11 de julio de 2026."
    },
    {
      titulo: "PRUEBA DE ACCESO",
      imagen: "assets/evidencia-2.jpg",
      historia: "Durante el desarrollo de la investigación fue localizado un documento que contiene las credenciales necesarias para acceder al Sistema de Gestión de Expedientes del presente caso."
    },
    {
      titulo: "PRUEBA GRÁFICA",
      imagen: "assets/evidencia-3.jpeg",
      historia: "El presente dibujo fue realizado por el demandante el día 23 de junio de 2026. La ilustración constituye una representación gráfica de sentimientos que, en ocasiones, resultan difíciles de expresar únicamente mediante palabras."
    },
    {
      titulo: "ORDEN DE ACCESO AL EXPEDIENTE",
      imagen: "assets/evidencia-4.jpg",
      historia: "Evidencia final que da acceso al expediente digital y conduce al cierre del caso."
    }
  ],

  // ---- Línea del tiempo ----
  timeline: [
    {
      fecha: "01/06/2026",
      titulo: "Nos conocimos",
      descripcion: "Todo comenzó con una conversación. Sin imaginarlo, esa noche despertó en mí el deseo de seguir conociéndote y descubrir la increíble persona que eres."
    },
    {
      fecha: "13/06/2026",
      titulo: "Primera cita",
      descripcion: "Ese día confirmé que quería seguir compartiendo momentos contigo. Tu sonrisa, tu forma de ser y la tranquilidad que sentí a tu lado hicieron que ese momento fuera memorable."
    },
    {
      fecha: "14/06/2026",
      titulo: "Primera salida",
      descripcion: "Exploramos un lugar nuevo, nos perdimos un poco y, sin darme cuenta, entendí que cualquier camino valía la pena si era contigo."
    },
    {
      fecha: "Hoy",
      titulo: "El día de la resolución",
      descripcion: "Después de cada recuerdo, cada conversación y cada prueba reunida, ha llegado el momento de cerrar este expediente."
    }
  ],

  // ---- Alegato final ----
  alegato: {
    titulo: "Alegato del Demandante",
    parrafos: [
      "Desde que llegaste a mi vida me demostraste que aún existen las primeras veces. Que el tiempo no siempre define la intensidad de lo que se siente y que no se necesitan guiones cuando hay conexión.",
      "Gracias por ser y estar, por hacer que cada momento sea lleno de alegría, gracias por llenarme de paz.",
      "Eres la persona más especial que jamás conocí, me haces sentir muy querido, comprendido y feliz. Por eso deseo seguir compartiendo mi vida contigo y construir muchos más recuerdos a tu lado."
    ]
  },

  // ---- Sentencia ----
  sentencia: {
    frases: [
      "Después de revisar cuidadosamente todas las pruebas...",
      "Este expediente demuestra que existen decisiones que ningún sistema puede tomar.",
      "Porque algunas decisiones solo pueden tomarse mirándose a los ojos."
    ]
  },

  // ---- Pantalla final ----
  final: {
    checklist: [
      { texto: "Pruebas revisadas", estado: "ok" },
      { texto: "Alegato final", estado: "ok" },
      { texto: "Sentencia redactada", estado: "ok" },
      { texto: "Firma del demandante", estado: "ok" },
      { texto: "Firma de la jueza", estado: "pendiente" }
    ],
    frases: [
      "El expediente está completo.",
      "La resolución final no puede emitirse aquí.",
      "Las mejores decisiones no se toman frente a una pantalla.",
      "Por favor... levanta la mirada."
    ]
  }

};
