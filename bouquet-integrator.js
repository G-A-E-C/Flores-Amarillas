/**
 * SISTEMA DE INTEGRACIÓN AUTOMÁTICA
 * 
 * Este archivo permite integrar cualquiera de las 6 opciones
 * en el archivo principal index.html automáticamente.
 */

class BouquetIntegrator {
    constructor() {
        this.options = {
            'a': {
                name: 'Radial (Recomendado)',
                description: 'Diseño radial elegante con tallos curvos',
                complexity: 'Media',
                performance: 'Excelente',
                responsive: 'Sí',
                exportQuality: 'Alta'
            },
            'b': {
                name: 'Abanico',
                description: 'Patrón en abanico, minimalista y eficiente',
                complexity: 'Baja',
                performance: 'Excelente',
                responsive: 'Sí',
                exportQuality: 'Alta'
            },
            'c': {
                name: 'Árbol',
                description: 'Estructura de árbol con ramas laterales',
                complexity: 'Alta',
                performance: 'Buena',
                responsive: 'Sí',
                exportQuality: 'Alta'
            },
            'd': {
                name: 'Denso',
                description: 'Composición densa multicapa con profundidad',
                complexity: 'Alta',
                performance: 'Media',
                responsive: 'Sí',
                exportQuality: 'Muy Alta'
            },
            'e': {
                name: 'CSS Puro',
                description: 'Implementación usando solo CSS/HTML',
                complexity: 'Media',
                performance: 'Buena',
                responsive: 'Sí',
                exportQuality: 'Media*',
                note: '*Requiere html2canvas para exportar'
            },
            'f': {
                name: 'Canvas',
                description: 'Generación trigonométrica en canvas',
                complexity: 'Alta',
                performance: 'Excelente',
                responsive: 'Sí',
                exportQuality: 'Muy Alta'
            }
        };
    }

    /**
     * Muestra información de todas las opciones disponibles
     */
    showOptions() {
        console.table(this.options);
        return this.options;
    }

    /**
     * Extrae el contenido relevante de una opción específica
     * @param {string} option - Letra de la opción (a-f)
     */
    async extractOptionContent(option) {
        const filePath = `/Users/gabrielalejandroespinzacoronel/Documents/GitHub/Flores-Amarillas/bouquet-option-${option}.html`;
        
        try {
            const response = await fetch(filePath);
            const content = await response.text();
            
            // Extraer secciones específicas
            const htmlMatch = content.match(/<div id="bouquet[^"]*"[\s\S]*?<\/div>/);
            const cssMatch = content.match(/<style>([\s\S]*?)<\/style>/);
            const jsMatch = content.match(/<script>([\s\S]*?)<\/script>/);
            
            return {
                html: htmlMatch ? htmlMatch[0] : null,
                css: cssMatch ? cssMatch[1] : null,
                js: jsMatch ? jsMatch[1] : null
            };
        } catch (error) {
            console.error(`Error al cargar opción ${option}:`, error);
            return null;
        }
    }

    /**
     * Genera código de integración para index.html
     * @param {string} option - Letra de la opción a integrar
     */
    generateIntegrationCode(option) {
        const optionInfo = this.options[option];
        if (!optionInfo) {
            throw new Error(`Opción ${option} no encontrada`);
        }

        return {
            htmlInsert: `
    <!-- RAMO DE FLORES - ${optionInfo.name.toUpperCase()} -->
    <div id="bouquet-container" class="bouquet-${option}">
        <!-- El contenido del ramo se insertará aquí -->
    </div>
    
    <!-- Controles de exportación -->
    <div id="export-controls" class="export-controls">
        <h3>Exportar Ramo</h3>
        <button onclick="exportBouquetHD()" class="btn export-btn">HD (1920x1080)</button>
        <button onclick="exportBouquetMobile()" class="btn export-btn">Móvil (1080x1920)</button>
        <button onclick="exportBouquetSquare()" class="btn export-btn">Cuadrado (1080x1080)</button>
        <button onclick="exportBouquetPrint()" class="btn export-btn">Impresión (3000x2000)</button>
    </div>`,

            cssInsert: `
/* ESTILOS PARA RAMO - ${optionInfo.name.toUpperCase()} */
.bouquet-${option} {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: 2rem;
}

.export-controls {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 1000;
}

.export-controls h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #333;
}

.export-btn {
    display: block;
    width: 100%;
    margin: 0.25rem 0;
    padding: 0.5rem;
    background: #f39c12;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.3s;
}

.export-btn:hover {
    background: #e67e22;
}

/* Responsive para controles */
@media (max-width: 768px) {
    .export-controls {
        position: relative;
        top: auto;
        right: auto;
        margin: 1rem auto;
        max-width: 300px;
    }
}

/* Clase para eliminar animaciones durante exportación */
.static-export * {
    animation: none !important;
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    transition: none !important;
}`,

            jsInsert: `
// FUNCIONES DE EXPORTACIÓN PARA RAMO ${optionInfo.name.toUpperCase()}
async function exportBouquetHD() {
    await exportCurrentBouquet(1920, 1080, 'ramo-${option}-hd');
}

async function exportBouquetMobile() {
    await exportCurrentBouquet(1080, 1920, 'ramo-${option}-mobile');
}

async function exportBouquetSquare() {
    await exportCurrentBouquet(1080, 1080, 'ramo-${option}-square');
}

async function exportBouquetPrint() {
    await exportCurrentBouquet(3000, 2000, 'ramo-${option}-print');
}

async function exportCurrentBouquet(width, height, filename) {
    try {
        const container = document.getElementById('bouquet-container');
        if (!container) {
            alert('No se encontró el contenedor del ramo');
            return;
        }
        
        // Detectar tipo de contenido y exportar apropiadamente
        const svgElement = container.querySelector('svg');
        const canvasElement = container.querySelector('canvas');
        
        if (svgElement) {
            await bouquetExporter.exportSVGAsPNG(svgElement, width, height, filename);
        } else if (canvasElement) {
            bouquetExporter.exportCanvas(canvasElement, filename);
        } else {
            await bouquetExporter.exportHTMLAsPNG(container, width, height, filename);
        }
        
        // Notificación de éxito
        showExportNotification('Ramo exportado exitosamente');
        
    } catch (error) {
        console.error('Error al exportar:', error);
        alert('Error al exportar el ramo. Revisa la consola para más detalles.');
    }
}

function showExportNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = \`
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    \`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar animaciones para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = \`
    @keyframes slideIn {
        from { transform: translateX(-50%) translateY(100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100%); opacity: 0; }
    }
\`;
document.head.appendChild(notificationStyles);`
        };
    }

    /**
     * Instrucciones paso a paso para integración manual
     * @param {string} option - Letra de la opción
     */
    getIntegrationInstructions(option) {
        const code = this.generateIntegrationCode(option);
        
        return `
INSTRUCCIONES DE INTEGRACIÓN - OPCIÓN ${option.toUpperCase()}

1. PREPARAR EL HTML:
   - Abrir index.html
   - Buscar el <body>
   - Antes del cierre </body>, agregar:
   ${code.htmlInsert}

2. AGREGAR ESTILOS:
   - En style.css (o dentro de <style> en index.html), agregar:
   ${code.cssInsert}

3. AGREGAR JAVASCRIPT:
   - Antes del cierre </body>, agregar:
   <script src="bouquet-exporter.js"></script>
   <script>
   ${code.jsInsert}
   </script>

4. INTEGRAR CONTENIDO DEL RAMO:
   - Abrir bouquet-option-${option}.html
   - Copiar el contenido del div principal del ramo
   - Pegarlo dentro del div #bouquet-container en index.html

5. OPCIONAL - Configurar parámetros:
   - Usar BOUQUET_CONFIGS.${this.getConfigKey(option)} para personalizar
   - Modificar colores, tamaños, animaciones según necesidades

¡Listo! Tu ramo estará integrado con funciones de exportación completas.
        `;
    }

    getConfigKey(option) {
        const configMap = {
            'a': 'radial',
            'b': 'fan', 
            'c': 'tree',
            'd': 'dense',
            'e': 'css',
            'f': 'canvas'
        };
        return configMap[option];
    }

    /**
     * Función que automatiza la integración (para uso programático)
     * @param {string} option - Opción a integrar
     * @param {string} indexPath - Ruta al archivo index.html
     */
    async automateIntegration(option, indexPath) {
        try {
            // Esta función sería para automatización completa
            // Requeriría acceso al sistema de archivos
            console.log('Integración automática no disponible en el navegador');
            console.log('Usar getIntegrationInstructions() para instrucciones manuales');
            
            return this.getIntegrationInstructions(option);
        } catch (error) {
            console.error('Error en integración automática:', error);
            return null;
        }
    }
}

// Instancia global
const bouquetIntegrator = new BouquetIntegrator();

// Funciones de conveniencia
function showBouquetOptions() {
    return bouquetIntegrator.showOptions();
}

function getIntegrationGuide(option) {
    return bouquetIntegrator.getIntegrationInstructions(option);
}

function generateIntegrationCode(option) {
    return bouquetIntegrator.generateIntegrationCode(option);
}

// Para usar en consola:
/*
// Ver todas las opciones disponibles
showBouquetOptions();

// Obtener guía de integración para la opción A
console.log(getIntegrationGuide('a'));

// Generar código específico para integración
const code = generateIntegrationCode('a');
console.log('HTML:', code.htmlInsert);
console.log('CSS:', code.cssInsert);
console.log('JS:', code.jsInsert);
*/

// Exportar si es módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BouquetIntegrator, bouquetIntegrator };
}