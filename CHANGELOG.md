# Historial de Cambios y Mejoras

Este documento resume las funcionalidades y mejoras que se han implementado en la aplicación **Split it Right** a través de solicitudes directas durante el desarrollo.

## Resumen de Funcionalidades Implementadas

### 1. Ajustes en la Interfaz de Usuario
- **Botón "Empezar de nuevo"**: Se simplificó el texto del botón de reinicio de "Reinciar y empezar de nuevo" a "Empezar de nuevo" para mayor concisión.
- **Rediseño del Pie de Página**: Se reorganizó el pie de página para mejorar la claridad:
    - Se movió el texto de copyright "© 2025 Developed by Diego Anguita" a la izquierda.
    - A la derecha, se añadió la frase "Si te gustó, no dudes en" junto al botón "Cómprame un café", todo en una sola línea para una apariencia más integrada.

### 2. Funcionalidad de Copiado de Resumen (Mejora Iterativa)
Esta funcionalidad fue refinada en varios pasos para asegurar la máxima compatibilidad y una excelente experiencia de usuario:
1.  **Problema Inicial**: Se detectó que la función original de "copiar pantalla" fallaba en navegadores móviles como Safari en iOS debido a restricciones de seguridad.
2.  **Primera Solución (Texto Formateado)**: Se reemplazó por completo la captura de pantalla por una función que copia un resumen de la cuenta en **formato de texto plano**. Esto garantiza la compatibilidad con todos los dispositivos.
3.  **Formato para WhatsApp**: Se personalizó el texto copiado para que se vea bien al pegarlo en aplicaciones de mensajería como WhatsApp, utilizando asteriscos para negritas (`*Total por Persona*`) y guiones bajos para cursivas (`_Descuento: 20%_`).
4.  **Limpieza de Información**: Se eliminó el conteo de calorías del resumen copiado para hacerlo más conciso y centrado en los montos a pagar.
5.  **Espaciado Mejorado**: Se añadió una línea en blanco en el texto copiado para separar claramente la información del total y el desglose por persona.

### 3. Mejoras en la Experiencia de Usuario (UX)
- **Notificaciones más Rápidas**: Se redujo la duración de las notificaciones emergentes (como "¡Copiado!" o "¡Éxito!") a 3 segundos para una experiencia más fluida.
- **Sonido de Éxito en Móviles**: Se implementó una solución para que el pitido de confirmación (al saldar la cuenta por completo) funcione correctamente en navegadores móviles, que requieren una interacción del usuario para activar el audio. El audio ahora se "desbloquea" con la primera acción del usuario en la cuenta.

### 4. Lógica de Negocio y Formato de Moneda
- **Formato de Moneda Dinámico**: Se implementó una regla de negocio inteligente para el formato de la moneda. Ahora, la aplicación determina si debe mostrar decimales basándose en el total de la cuenta:
    - Si el total es **menor a 1000**, se asume que es una moneda que utiliza decimales (como el dólar o el euro) y se muestran dos.
    - Si el total es **1000 o mayor**, se asume que es una moneda que no usa decimales (como el peso chileno) y los montos se redondean al entero más cercano.
