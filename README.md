# Tablero de Participación Gamificado

Tablero interactivo para gestionar y gamificar la participación de estudiantes en clase.

## Características

### Selector Aleatorio
- Animación tipo "slot machine" para seleccionar estudiantes al azar
- Asigna automáticamente 1 punto al estudiante seleccionado
- Efectos visuales engaging y notificaciones

### Sistema de Puntos
Múltiples formas de ganar puntos:
- **Participación al Azar**: 1 punto (automático al usar el selector)
- **Participación Voluntaria**: 3 puntos
- **Opinión Insightful**: +1 punto extra
- **Apoyo al Equipo**: +2 puntos (cuando ayuda a otros compañeros)

### Sistema de Badges

El sistema otorga 5 tipos diferentes de badges para reconocer distintas formas de participación:

1. **Top Participante** - Estudiante(s) con más puntos totales
2. **Pensador Crítico** - Más opiniones insightful
3. **Valiente** - Primera mano voluntaria por sesión
4. **Apoyo al Equipo** - Más puntos de ayuda
5. **Racha Activa** - Participó 3+ días consecutivos

### Estadísticas en Tiempo Real
- Total de participaciones
- Puntos totales acumulados
- Estudiantes activos
- Badges otorgados

### Tabla de Clasificación
- Vista ordenada por puntos o nombre
- Medallas para top 3 estudiantes
- Visualización de badges por estudiante
- Contador de participaciones

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **Tailwind CSS** (CDN) - Estilos modernos y responsivos
- **Font Awesome** (CDN) - Iconos profesionales
- **JavaScript Vanilla** - Lógica sin dependencias
- **LocalStorage API** - Persistencia de datos en el navegador

## Instalación y Uso

### Opción 1: Uso Local (Localhost)

1. Clona este repositorio:
```bash
git clone https://github.com/HesusG/diagnostico-lineas-accion-board.git
cd diagnostico-lineas-accion-board
```

2. Abre `index.html` directamente en tu navegador:
   - Doble clic en el archivo `index.html`
   - O usa un servidor local simple:
   ```bash
   # Si tienes Python 3 instalado:
   python -m http.server 8000

   # Luego visita: http://localhost:8000
   ```

### Opción 2: GitHub Pages

El proyecto está configurado para funcionar automáticamente en GitHub Pages:

1. Ve a tu repositorio en GitHub
2. Settings > Pages
3. En "Source", selecciona la rama `main` y carpeta `/ (root)`
4. Guarda y espera unos minutos
5. Tu tablero estará disponible en: `https://[tu-usuario].github.io/diagnostico-lineas-accion-board/`

## Cómo Usar el Tablero

### Durante la Clase

1. **Selector Aleatorio**
   - Haz clic en "Seleccionar Estudiante" para elegir alguien al azar
   - El estudiante seleccionado recibe automáticamente 1 punto

2. **Asignar Puntos Manualmente**
   - Selecciona un estudiante del menú desplegable
   - Haz clic en el botón correspondiente según el tipo de participación:
     - Participación Voluntaria (+3 pts)
     - Opinión Insightful (+1 pt)
     - Apoyo al Equipo (+2 pts)

3. **Ver Estadísticas**
   - Las estadísticas se actualizan automáticamente
   - La tabla muestra ranking en tiempo real
   - Los badges se otorgan dinámicamente

4. **Ordenar Tabla**
   - "Por Puntos": Muestra ranking con medallas para top 3
   - "Por Nombre": Orden alfabético

### Gestión de Datos

#### Persistencia Automática
- Todos los datos se guardan automáticamente en LocalStorage
- Al recargar la página, los datos persisten
- Los datos incluyen timestamps ocultos para cálculos de badges

#### Reiniciar Datos
- Botón "Reiniciar Datos" borra todo (con doble confirmación)
- Útil para iniciar un nuevo periodo o semestre

#### Respaldo Manual
Los datos están en LocalStorage. Para hacer un backup:
1. Abre la consola del navegador (F12)
2. Ve a Application > Local Storage
3. Copia el valor de `participationBoard`
4. Guárdalo en un archivo de texto

Para restaurar:
1. Pega el valor guardado en la consola:
```javascript
localStorage.setItem('participationBoard', 'TU_BACKUP_AQUI');
location.reload();
```

## Estructura del Proyecto

```
diagnostico-lineas-accion-board/
├── index.html          # Página principal
├── app.js              # Lógica de la aplicación
├── styles.css          # Estilos personalizados
├── .gitignore          # Archivos ignorados por Git
└── README.md           # Este archivo
```

## Personalización

### Agregar o Modificar Estudiantes

Edita el array `INITIAL_STUDENTS` en `app.js`:

```javascript
const INITIAL_STUDENTS = [
    { name: "Nombre Completo", id: "A01234567" },
    // Agrega más estudiantes aquí
];
```

Luego usa el botón "Reiniciar Datos" para aplicar los cambios.

### Modificar Sistema de Puntos

Edita el objeto `PARTICIPATION_TYPES` en `app.js`:

```javascript
const PARTICIPATION_TYPES = {
    VOLUNTARY: { key: 'voluntary', points: 3, label: 'Participación Voluntaria' },
    // Modifica los puntos aquí
};
```

### Cambiar Colores

El proyecto usa Tailwind CSS. Los colores principales se definen en `index.html`:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',    // Azul
                secondary: '#8b5cf6',  // Púrpura
                // Modifica aquí
            }
        }
    }
}
```

## Algoritmos de Badges

### Top Participante
```javascript
// Estudiante(s) con el puntaje más alto
maxPoints = Math.max(...students.map(s => s.points))
```

### Pensador Crítico
```javascript
// Mayor cantidad de participaciones tipo "insightful"
maxInsightful = Math.max(...students.map(s =>
    s.participations.filter(p => p.type === 'insightful').length
))
```

### Valiente
```javascript
// Primera participación voluntaria de cada día único
// Se otorga al estudiante que levanta la mano primero
```

### Apoyo al Equipo
```javascript
// Mayor cantidad de participaciones tipo "support"
maxSupport = Math.max(...students.map(s =>
    s.participations.filter(p => p.type === 'support').length
))
```

### Racha Activa
```javascript
// Participó en 3 o más días consecutivos
// Utiliza timestamps guardados para calcular días únicos
```

## Compatibilidad

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Responsive design (funciona en móviles y tablets)
- No requiere conexión a internet después de la carga inicial
- Compatible con GitHub Pages sin configuración adicional

## Limitaciones

- Los datos se guardan localmente en el navegador
- Si cambias de navegador o dispositivo, los datos no se transfieren
- Borrar los datos del navegador eliminará el progreso
- Sin autenticación (cualquiera con acceso puede modificar puntos)

## Solución de Problemas

### Los datos no se guardan
- Verifica que las cookies/LocalStorage no estén bloqueadas en tu navegador
- Prueba en modo normal (no privado/incógnito)

### Los badges no se actualizan
- Los badges se recalculan automáticamente al asignar puntos
- Si hay problemas, prueba reiniciar el navegador

### El selector aleatorio no funciona
- Asegúrate de que JavaScript esté habilitado
- Verifica la consola del navegador (F12) por errores

## Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

## Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Autor

Desarrollado para el curso de Diagnóstico Líneas de Acción

## Soporte

Para reportar problemas o sugerencias, abre un issue en GitHub.

---

**Nota**: Los datos de participación están diseñados para ser transparentes y motivadores. Recuerda que el objetivo es fomentar la participación activa y reconocer diferentes formas de contribución en clase.
