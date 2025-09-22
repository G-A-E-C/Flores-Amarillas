/**
 * FUNCIÓN DE EXPORTACIÓN UNIVERSAL PARA RAMOS DE FLORES
 * 
 * Esta función puede ser integrada en cualquiera de las 6 opciones
 * para exportar el ramo final como PNG en alta calidad.
 */

class BouquetExporter {
    constructor() {
        this.defaultSizes = {
            hd: { width: 1920, height: 1080, name: 'HD' },
            mobile: { width: 1080, height: 1920, name: 'Móvil' },
            square: { width: 1080, height: 1080, name: 'Cuadrado' },
            print: { width: 3000, height: 2000, name: 'Impresión' }
        };
    }

    /**
     * Exporta un SVG como PNG de alta calidad
     * @param {SVGElement} svgElement - Elemento SVG a exportar
     * @param {number} width - Ancho del PNG
     * @param {number} height - Alto del PNG
     * @param {string} filename - Nombre del archivo (opcional)
     */
    async exportSVGAsPNG(svgElement, width, height, filename = 'ramo-flores') {
        try {
            // 1. Clonar el SVG
            const svgClone = svgElement.cloneNode(true);
            
            // 2. Forzar estado final (sin animaciones)
            this.forceStaticState(svgClone);
            
            // 3. Configurar dimensiones
            svgClone.setAttribute('width', width);
            svgClone.setAttribute('height', height);
            
            // 4. Asegurar que los estilos estén inlineados
            await this.inlineStyles(svgClone);
            
            // 5. Serializar SVG
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgClone);
            const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
            
            // 6. Crear canvas y renderizar
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            // Fondo blanco
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            
            // 7. Cargar imagen SVG y descargar
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        ctx.drawImage(img, 0, 0, width, height);
                        this.downloadCanvas(canvas, `${filename}-${width}x${height}.png`);
                        resolve(canvas.toDataURL('image/png'));
                    } catch (error) {
                        reject(error);
                    }
                };
                img.onerror = reject;
                img.src = svgDataUrl;
            });
            
        } catch (error) {
            console.error('Error al exportar SVG:', error);
            throw error;
        }
    }

    /**
     * Exporta un elemento HTML (para ramos CSS) como PNG
     * @param {HTMLElement} element - Elemento HTML a exportar
     * @param {number} width - Ancho del PNG
     * @param {number} height - Alto del PNG
     * @param {string} filename - Nombre del archivo
     */
    async exportHTMLAsPNG(element, width, height, filename = 'ramo-css') {
        // Verificar si html2canvas está disponible
        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas es requerido para exportar ramos CSS. Incluya la librería.');
        }

        try {
            // Aplicar clase estática temporalmente
            document.documentElement.classList.add('static-export');
            
            // Esperar un frame para aplicar estilos
            await new Promise(resolve => requestAnimationFrame(resolve));
            
            const canvas = await html2canvas(element, {
                width: width,
                height: height,
                backgroundColor: 'white',
                scale: Math.min(width / element.offsetWidth, height / element.offsetHeight),
                useCORS: true,
                allowTaint: true
            });
            
            this.downloadCanvas(canvas, `${filename}-${width}x${height}.png`);
            return canvas.toDataURL('image/png');
            
        } finally {
            document.documentElement.classList.remove('static-export');
        }
    }

    /**
     * Exporta un canvas directamente
     * @param {HTMLCanvasElement} canvas - Canvas a exportar
     * @param {string} filename - Nombre del archivo
     */
    exportCanvas(canvas, filename = 'ramo-canvas') {
        this.downloadCanvas(canvas, `${filename}.png`);
        return canvas.toDataURL('image/png');
    }

    /**
     * Fuerza el estado estático (sin animaciones) en un SVG
     * @param {SVGElement} svgElement - Elemento SVG a modificar
     */
    forceStaticState(svgElement) {
        // Eliminar todas las animaciones y forzar estado final
        const animatedElements = svgElement.querySelectorAll('[class*="stem"], [class*="flower"], [class*="leaf"], [class*="ribbon"], [class*="branch"]');
        
        animatedElements.forEach(el => {
            // Remover animaciones CSS
            el.style.animation = 'none';
            el.style.animationDelay = '0s';
            
            // Forzar estado final común
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
            el.style.strokeDashoffset = '0';
            
            // Asegurar visibilidad
            el.style.visibility = 'visible';
            el.style.display = 'initial';
        });
    }

    /**
     * Inlinea estilos CSS en un SVG para garantizar renderizado correcto
     * @param {SVGElement} svgElement - Elemento SVG
     */
    async inlineStyles(svgElement) {
        const stylesheets = Array.from(document.styleSheets);
        let cssText = '';
        
        for (const stylesheet of stylesheets) {
            try {
                if (stylesheet.cssRules) {
                    for (const rule of stylesheet.cssRules) {
                        if (rule.type === CSSRule.STYLE_RULE) {
                            cssText += rule.cssText + '\n';
                        }
                    }
                }
            } catch (e) {
                // Ignorar errores de CORS en stylesheets externos
                console.warn('No se pudo acceder a stylesheet:', e);
            }
        }
        
        if (cssText) {
            const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
            styleElement.textContent = cssText;
            svgElement.insertBefore(styleElement, svgElement.firstChild);
        }
    }

    /**
     * Descarga un canvas como PNG
     * @param {HTMLCanvasElement} canvas - Canvas a descargar
     * @param {string} filename - Nombre del archivo
     */
    downloadCanvas(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Crea botones de exportación para tamaños predefinidos
     * @param {HTMLElement} container - Contenedor donde agregar los botones
     * @param {Function} exportFunction - Función que maneja la exportación
     */
    createExportButtons(container, exportFunction) {
        Object.entries(this.defaultSizes).forEach(([key, size]) => {
            const button = document.createElement('button');
            button.textContent = `${size.name} (${size.width}x${size.height})`;
            button.className = 'btn export-btn';
            button.onclick = () => exportFunction(size.width, size.height);
            container.appendChild(button);
        });
    }

    /**
     * Función auxiliar para detectar el tipo de ramo y exportar apropiadamente
     * @param {string} bouquetId - ID del elemento contenedor del ramo
     * @param {number} width - Ancho deseado
     * @param {number} height - Alto deseado
     */
    async autoExport(bouquetId, width, height) {
        const element = document.getElementById(bouquetId);
        if (!element) {
            throw new Error(`No se encontró elemento con ID: ${bouquetId}`);
        }

        // Detectar tipo de ramo
        if (element.tagName.toLowerCase() === 'svg') {
            // Ramo SVG
            return await this.exportSVGAsPNG(element, width, height);
        } else if (element.tagName.toLowerCase() === 'canvas') {
            // Ramo Canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // Escalar y dibujar
            const scale = Math.min(width / element.width, height / element.height);
            const scaledWidth = element.width * scale;
            const scaledHeight = element.height * scale;
            const offsetX = (width - scaledWidth) / 2;
            const offsetY = (height - scaledHeight) / 2;
            
            tempCtx.fillStyle = 'white';
            tempCtx.fillRect(0, 0, width, height);
            tempCtx.drawImage(element, offsetX, offsetY, scaledWidth, scaledHeight);
            
            return this.exportCanvas(tempCanvas);
        } else {
            // Ramo HTML/CSS
            return await this.exportHTMLAsPNG(element, width, height);
        }
    }
}

// Instancia global para usar en cualquier opción
const bouquetExporter = new BouquetExporter();

// Funciones de conveniencia para cada tipo
async function exportBouquetAsPNG(width, height, elementId = 'bouquetSVG') {
    return await bouquetExporter.autoExport(elementId, width, height);
}

async function exportSVGBouquet(svgElement, width, height) {
    return await bouquetExporter.exportSVGAsPNG(svgElement, width, height);
}

async function exportHTMLBouquet(htmlElement, width, height) {
    return await bouquetExporter.exportHTMLAsPNG(htmlElement, width, height);
}

function exportCanvasBouquet(canvas, filename) {
    return bouquetExporter.exportCanvas(canvas, filename);
}

// Ejemplo de uso:
/*
// Para SVG (Opciones A, B, C, D):
await exportBouquetAsPNG(1920, 1080, 'bouquetSVG');

// Para HTML/CSS (Opción E):
await exportHTMLBouquet(document.getElementById('cssBouquet'), 1920, 1080);

// Para Canvas (Opción F):
exportCanvasBouquet(document.getElementById('bouquetCanvas'), 'mi-ramo');

// Exportación automática (detecta el tipo):
await bouquetExporter.autoExport('bouquetContainer', 1920, 1080);
*/

/**
 * PARÁMETROS CONFIGURABLES PARA CADA OPCIÓN
 */

const BOUQUET_CONFIGS = {
    // Opción A - Radial
    radial: {
        numStems: 7,                    // 3-12 tallos
        stemLengthRange: [180, 280],    // Longitud mín/máx en px
        curvatureRange: [20, 60],       // Intensidad de curvatura
        petalsPerFlower: 8,             // 5-16 pétalos por flor
        openDelayBase: 200,             // Delay base en ms
        openStagger: 150,               // Incremento de delay entre flores
        angleRange: [-60, 60],          // Ángulo de dispersión en grados
        responsive: {
            mobile: { scale: 0.7, maxStems: 5 },
            tablet: { scale: 0.85, maxStems: 6 }
        }
    },
    
    // Opción B - Abanico
    fan: {
        numStems: 5,
        stemAngles: [-45, -22.5, 0, 22.5, 45],
        stemLengths: [200, 180, 220, 190, 170],
        flowerSizes: [18, 16, 20, 16, 18],
        simplifiedMobile: true
    },
    
    // Opción C - Árbol
    tree: {
        mainTrunkHeight: 400,
        branchLevels: 3,
        branchesPerLevel: 2,
        branchLength: 50,
        branchAngle: 35,
        flowerSizeProgression: [12, 14, 16] // De abajo hacia arriba
    },
    
    // Opción D - Denso
    dense: {
        numStems: 10,
        layerOpacity: [0.7, 0.85, 1.0],
        leafDensity: 6,
        flowerDensity: 10,
        depthLayers: 3,
        shadowIntensity: 0.3
    },
    
    // Opción E - CSS
    css: {
        numStems: 5,
        usePseudoElements: true,
        petalsPerFlower: 6,
        animationDuration: '0.8s',
        requiresHtml2Canvas: true
    },
    
    // Opción F - Canvas
    canvas: {
        numStems: 7,
        numPetals: 8,
        flowerSize: 15,
        curvatureIntensity: 0.3,
        animationSmoothing: true,
        trigonometricPetals: true,
        realTimeConfig: true
    }
};

/**
 * RECOMENDACIONES DE RENDIMIENTO
 */

const PERFORMANCE_TIPS = {
    mobile: {
        reduceStems: "Limitar a máximo 5-6 tallos en móviles",
        simplifyAnimations: "Usar prefers-reduced-motion para reducir animaciones",
        optimizeSize: "Escalar ramo a 70-80% en pantallas pequeñas",
        avoidComplexFilters: "Minimizar uso de filtros SVG en dispositivos lentos"
    },
    
    export: {
        useStaticClass: "Aplicar clase .static-export para eliminar animaciones",
        inlineStyles: "Inlinear estilos CSS para garantizar renderizado correcto",
        highResolution: "Para impresión usar mínimo 3000x2000px",
        backgroundWhite: "Asegurar fondo blanco para transparencia correcta"
    },
    
    animation: {
        useTransform: "Preferir transform sobre left/top para animaciones",
        willChange: "Aplicar will-change: transform en elementos animados",
        compositorLayers: "Usar transform3d(0,0,0) para forzar aceleración GPU",
        cleanupAfter: "Remover will-change después de animaciones"
    }
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BouquetExporter, bouquetExporter, BOUQUET_CONFIGS, PERFORMANCE_TIPS };
}