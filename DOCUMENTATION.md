# Documentación Técnico-Funcional: Split it Right

## 1. Resumen Funcional

### 1.1. Propósito de la Aplicación
**Split it Right** es una aplicación web diseñada para simplificar el proceso de dividir la cuenta de un restaurante entre varias personas. Utilizando inteligencia artificial, la aplicación escanea una fotografía de un recibo, extrae los artículos y sus precios, y proporciona una interfaz interactiva para que los usuarios asignen cada artículo a la persona que lo consumió, calculando automáticamente el total a pagar por cada uno.

### 1.2. Flujo de Usuario Principal
1.  **Subida del Recibo**: El usuario comienza subiendo una foto clara de su recibo.
2.  **Procesamiento con IA**: La aplicación envía la imagen a un modelo de IA (Google Gemini) que la analiza para extraer:
    *   Cada artículo consumido.
    *   El precio de cada artículo.
    *   Una estimación de las calorías.
    *   Una descripción creativa y única para cada producto.
    *   El idioma principal del recibo.
3.  **Gestión de Pagadores**: Una vez procesado el recibo, el usuario añade a las personas (pagadores) que participaron en la comida.
4.  **Asignación de Artículos**: El usuario selecciona a cada persona y "reclama" los artículos que le corresponden de la lista.
5.  **Aplicación de Descuento**: El usuario puede introducir un descuento en porcentaje, que se aplica proporcionalmente al total de cada persona.
6.  **Cálculo de Totales**: La aplicación calcula y muestra en tiempo real:
    *   El total a pagar por la persona seleccionada.
    *   Un total estimado de las calorías que consumió.
    *   El total general de la cuenta, el monto pagado y el restante.
7.  **Marcar como Pagado**: El usuario puede marcar los artículos como pagados. Al hacerlo, se marcan como pagados todos los artículos de la persona que los reclamó.
8.  **Finalización**: Cuando todos los artículos están pagados, la aplicación muestra un mensaje de confirmación, indicando que la cuenta está saldada.

### 1.3. Características Clave
*   **Escaneo de Recibos con IA**: Automatiza la tediosa tarea de introducir manualmente cada artículo.
*   **Cálculo de Calorías**: Añade un elemento informativo y divertido al estimar las calorías de cada plato.
*   **Descripciones Creativas**: La IA genera comentarios únicos y divertidos para cada artículo, haciendo la experiencia más amena.
*   **Gestión de Descuentos**: Permite aplicar un descuento porcentual a la cuenta total.
*   **Asignación Interactiva de Artículos**: Interfaz clara para reclamar, soltar y gestionar los artículos entre los pagadores.
*   **Soporte de Moneda e Idioma**: Adapta el formato de la moneda según el idioma detectado en el recibo (USD para inglés, CLP para español).
*   **Interfaz Personalizable**: Permite aumentar o disminuir el tamaño de la fuente para mejorar la legibilidad.

## 2. Especificaciones Técnicas

### 2.1. Arquitectura y Stack Tecnológico
*   **Framework Frontend**: **Next.js 15** con **App Router**. Se utilizan Server Components por defecto para optimizar el rendimiento.
*   **Lenguaje**: **TypeScript**.
*   **Componentes UI**: **ShadCN UI**, una colección de componentes reutilizables construidos sobre Radix UI.
*   **Estilos**: **Tailwind CSS** para un estilizado rápido y mantenible.
*   **Inteligencia Artificial**: **Google Gemini Pro** accedido a través de **Genkit**, el framework de IA de Google.
*   **Gestión de Formularios y Acciones**: **Server Actions** de Next.js para manejar la subida de archivos y la comunicación con el backend sin necesidad de crear endpoints de API explícitos. El estado del formulario se gestiona con el hook `useActionState`.
*   **Manejo del Estado (Cliente)**: Hooks nativos de React (`useState`, `useMemo`, `useEffect`).

### 2.2. Estructura de Componentes Clave (React)
*   **`split-it-right-app.tsx`**: Componente principal que orquesta el estado global de la aplicación (lista de artículos, pagadores, descuento, etc.) y renderiza condicionalmente la vista de subida o la de división de la cuenta.
*   **`upload-receipt.tsx`**: Contiene el formulario inicial para que el usuario seleccione y previsualice la imagen del recibo. Comprime la imagen en el cliente antes de enviarla como un Data URI.
*   **`diner-manager.tsx`**: Gestiona la lógica para añadir, eliminar y editar los nombres de los pagadores. Muestra el total a pagar y las calorías por persona.
*   **`item-list.tsx`**: Renderiza la lista de todos los artículos extraídos del recibo.
*   **`item-card.tsx`**: Componente individual para cada artículo, que contiene los botones para reclamar/soltar, marcar como pagado, editar el precio y eliminar el artículo.
*   **`bill-summary.tsx`**: Muestra el resumen de la cuenta (total, pagado, restante) y contiene el campo para aplicar el descuento.

### 2.3. Lógica del Backend (Server Actions & Genkit)
*   **Server Action (`handleReceiptUpload` en `src/app/actions.ts`)**:
    *   Es la función que se ejecuta en el servidor cuando el usuario envía el formulario.
    *   Recibe el `photoDataUri` (la imagen comprimida en base64).
    *   Valida la entrada con Zod.
    *   Invoca al flujo de Genkit (`extractItemsFromReceipt`) para el procesamiento de la IA.
    *   Maneja los posibles errores y devuelve un objeto de estado (éxito o error) al componente cliente.

*   **Flujo de Genkit (`extractItemsFromReceipt` en `src/ai/flows/extract-items-from-receipt.ts`)**:
    *   Define los esquemas de entrada (la imagen) y de salida (un array de `items` y el `language`) usando Zod.
    *   Contiene un `prompt` muy detallado que instruye al modelo Gemini sobre cómo realizar las siguientes tareas:
        1.  Extraer los nombres y precios de los artículos.
        2.  Manejar líneas con cantidades múltiples (ej. "2x Cerveza"), expandiéndolas en artículos individuales y dividiendo el precio.
        3.  Interpretar correctamente los precios según el idioma (ej. `.` como separador de miles en español).
        4.  Estimar las calorías de cada artículo.
        5.  Generar una descripción creativa, evocadora y única para cada artículo, sin repetir el nombre del mismo.
        6.  Manejar abreviaturas o artículos no reconocibles de forma elegante.

### 2.4. Manejo del Estado (Cliente)
*   El estado principal (la lista de `items`, `diners`, el `discount`, etc.) se centraliza en el componente `SplitItRightApp.tsx` usando el hook `useState`.
*   Se utiliza `useMemo` para calcular de manera eficiente valores derivados como los totales de la cuenta y las estadísticas por pagador. Esto evita recálculos innecesarios en cada renderizado.
*   El estado del formulario de subida y la respuesta de la Server Action se gestionan de forma nativa con el hook `useActionState`.

## 3. Configuración y Despliegue

### 3.1. Variables de Entorno
La aplicación requiere una única variable de entorno para funcionar:
*   **`GOOGLE_API_KEY`**: La clave de API para el servicio de Google Gemini. Debe ser configurada en un archivo `.env` para desarrollo local y en la configuración del proveedor de hosting para producción.

### 3.2. Proceso de Build y Despliegue
*   **Build**: El comando `npm run build` compila la aplicación Next.js, optimizando los assets para producción.
*   **Despliegue**: La aplicación está lista para ser desplegada en cualquier plataforma compatible con Next.js, como Vercel o Firebase App Hosting. Es crucial configurar la variable de entorno `GOOGLE_API_KEY` en el entorno de producción.

### 3.3. Analítica Web
*   La aplicación integra **Google Analytics** para el seguimiento del uso. El script de seguimiento se añade en el archivo `src/app/layout.tsx` utilizando el componente `next/script` para una carga eficiente.
*   El ID de seguimiento configurado es **G-39WFN3M1P4**.

## 4. Puntos de Extensión Futuros
*   **División de Artículos**: Implementar la funcionalidad para dividir un solo artículo (ej. una pizza, una botella de vino) entre varias personas.
*   **Gestión de Propinas**: Añadir una opción para incluir una propina (porcentaje o monto fijo) en el total de la cuenta.
*   **Historial de Cuentas**: Permitir a los usuarios guardar y revisar cuentas pasadas.
*   **Internacionalización (i18n)**: Traducir la interfaz de usuario a otros idiomas además del español.
