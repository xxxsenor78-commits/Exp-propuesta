/* ============================================================
   CONFIGURACIÓN DEL EXPEDIENTE
   Edita únicamente este archivo para personalizar el contenido.
   No es necesario tocar app.js ni el HTML.
   ============================================================ */

const CONFIG = {

  // ---- Credenciales de acceso (no distinguen mayúsculas/minúsculas ni espacios) ----
  acceso: {
    usuario: "Clara001",
    clave: "Picadilly03"
  },

  // ---- Datos generales del caso ----
  caso: {
    numero: "2026-LV-001",
    demandante: "Boris Maurico Murillo Mejia",
    jueza: "Clara Marcela Angarita",
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
      titulo: "[TÍTULO EVIDENCIA 1]",
      imagen: "assets/evidencia-1.jpeg",
      historia: "[Escribe aquí la historia detrás de esta primera evidencia: el momento, la fecha, por qué importa.]"
    },
    {
      titulo: "[TÍTULO EVIDENCIA 2]",
      imagen: "assets/evidencia-2.jpg",
      historia: "[Escribe aquí la historia de la segunda evidencia.]"
    },
    {
      titulo: "[TÍTULO EVIDENCIA 3]",
      imagen: "assets/evidencia-3.jpg",
      historia: "[Escribe aquí la historia de la tercera evidencia.]"
    },
    {
      titulo: "[TÍTULO EVIDENCIA 4]",
      imagen: "assets/evidencia-4.jpg",
      historia: "[Escribe aquí la historia de la cuarta evidencia.]"
    }
  ],

  // ---- Línea del tiempo ----
  timeline: [
    { fecha: "[FECHA]", titulo: "Nos conocimos", descripcion: "[Breve descripción de ese momento.]" },
    { fecha: "[FECHA]", titulo: "Primera salida", descripcion: "[Breve descripción de ese momento.]" },
    { fecha: "[FECHA]", titulo: "Primer viaje", descripcion: "[Breve descripción de ese momento.]" },
    { fecha: "Hoy", titulo: "Hoy", descripcion: "[Breve descripción de este momento.]" }
  ],

  // ---- Alegato final ----
  alegato: {
    titulo: "Alegato del Demandante",
    parrafos: [
      "[Explica aquí por qué ella es una persona especial.]",
      "[Explica aquí qué es lo que más admiras de ella.]",
      "[Explica aquí por qué quieres seguir construyendo recuerdos juntos.]"
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
