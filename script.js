// Configuración global
const config = {
    messages: [
        "Si alguna vez el sol se apaga, serán tus ojos quienes me den la luz.",
        "Eres la razón por la que hasta las flores amarillas quieren florecer en la noche.",
        "En tu sonrisa encuentro la calma, en tu voz encuentro mi hogar.",
        "No necesito pedir un deseo, porque contigo ya se cumplió.",
        "De todas mis historias, tú siempre serás mi capítulo favorito.",
        "Tú no eres un sueño… eres la realidad más bonita que me pasó.",
        "Lo que siento por ti no cabe en un ramo, pero aquí empieza."
    ],
    finalMessages: [
        "Tú eres la razón por la que florece mi mundo 💛🌼",
        "Mi amor por ti crece como este ramo de flores 🌸💛",
        "Eres mi primavera eterna 🌼💛"
    ],
    timings: {
        typewriterSpeed: 80,
        messageDelay: 3000,
        flowerGenerationInterval: 1500,
        bouquetDelay: 2000
    }
};

class FlowerAnimation {
    constructor() {
        this.currentMessageIndex = 0;
        this.isAnimationComplete = false;
        this.bouquetFlowers = [];
        this.init();
        this.fixMobileViewport();
    }

    // Arreglar viewport en móviles
    fixMobileViewport() {
        // Forzar scroll al inicio
        window.scrollTo(0, 0);
        
        // Prevenir scroll durante la animación
        document.body.style.overflow = 'hidden';
        
        // En móviles, ajustar la altura para evitar problemas de viewport
        if (window.innerWidth <= 768) {
            document.documentElement.style.height = '100%';
            document.body.style.height = '100%';
            
            // Listener para orientación y redimensionado
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 100);
            });
            
            window.addEventListener('resize', () => {
                window.scrollTo(0, 0);
            });
        }
    }

    init() {
        this.createParticles();
        this.startAnimation();
        this.setupEventListeners();
    }

    // Crear partículas de fondo
    createParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        
        setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            particlesContainer.appendChild(particle);
            
            // Remover partícula después de la animación
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 8000);
        }, 300);
    }

    // Iniciar secuencia de animación
    async startAnimation() {
        await this.showMessages();
        await this.createBouquet();
        
        // Mostrar barra de carga después de los mensajes
        await this.delay(500);
        await this.showLoadingBar();
        
        // Mostrar el ramo radial ANTES del mensaje final
        await this.delay(500);
        this.showBouquet();
        
        // Esperar a que termine la animación del ramo antes del mensaje final
        await this.delay(3000);
        await this.showFinalMessage();
        this.showActionButtons();
    }

    // Mostrar mensajes con efecto typewriter
    async showMessages() {
        const typewriterElement = document.getElementById('typewriter-text');
        
        for (let i = 0; i < config.messages.length; i++) {
            await this.typewriterEffect(typewriterElement, config.messages[i]);
            this.generateRandomFlowers();
            this.generateMessageDecorationFlowers(); // Nuevas flores decorativas
            
            if (i < config.messages.length - 1) {
                await this.delay(config.timings.messageDelay);
            }
        }
        
        await this.delay(2000);
        typewriterElement.style.opacity = '0';
        await this.delay(1000);
        document.querySelector('.messages-container').style.display = 'none';
    }

    // Efecto de máquina de escribir
    async typewriterEffect(element, text) {
        element.textContent = '';
        element.style.opacity = '1';
        
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.delay(config.timings.typewriterSpeed);
        }
    }

    // Generar flores aleatorias durante los mensajes
    generateRandomFlowers() {
        const container = document.querySelector('.floating-flowers-container');
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const flower = this.createFlowerSVG();
                flower.setAttribute('class', 'floating-flower');
                flower.style.left = Math.random() * 80 + 10 + '%';
                flower.style.animationDelay = Math.random() * 2 + 's';
                
                container.appendChild(flower);
                
                // Remover flor después de la animación
                setTimeout(() => {
                    if (flower.parentNode) {
                        flower.parentNode.removeChild(flower);
                    }
                }, 8000);
            }, i * 500);
        }
    }

    // Generar flores decorativas alrededor de los mensajes
    generateMessageDecorationFlowers() {
        const messageContainer = document.querySelector('.messages-container');
        const messageBox = document.querySelector('.message-box');
        
        if (!messageBox) return;
        
        const boxRect = messageBox.getBoundingClientRect();
        const container = document.querySelector('.floating-flowers-container');
        
        // Crear 6-8 flores pequeñas alrededor del mensaje
        const flowerCount = 6 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < flowerCount; i++) {
            setTimeout(() => {
                const flower = this.createFlowerSVG(25); // Flores pequeñas
                flower.setAttribute('class', 'message-decoration-flower');
                
                // Posicionar alrededor del mensaje (sin tapar el texto)
                const angle = (i / flowerCount) * 2 * Math.PI;
                const radius = 120 + Math.random() * 60; // Distancia del centro del mensaje
                
                const centerX = boxRect.left + boxRect.width / 2;
                const centerY = boxRect.top + boxRect.height / 2;
                
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                flower.style.position = 'fixed';
                flower.style.left = x + 'px';
                flower.style.top = y + 'px';
                flower.style.transform = 'translate(-50%, -50%) scale(0)';
                flower.style.zIndex = '2';
                
                container.appendChild(flower);
                
                // Animación de aparición y flotación suave
                gsap.to(flower, {
                    scale: 1,
                    rotation: 360,
                    duration: 1,
                    ease: "back.out(1.7)"
                });
                
                // Movimiento suave flotante
                gsap.to(flower, {
                    y: "+=20",
                    rotation: "+=180",
                    duration: 3,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
                
                // Desaparecer después de unos segundos
                setTimeout(() => {
                    gsap.to(flower, {
                        scale: 0,
                        opacity: 0,
                        duration: 0.8,
                        onComplete: () => {
                            if (flower.parentNode) {
                                flower.parentNode.removeChild(flower);
                            }
                        }
                    });
                }, 4000 + Math.random() * 2000);
                
            }, i * 200);
        }
    }

    // Crear SVG de flor estilizada (basado en referencia)
    createFlowerSVG(size = 60) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 120 120');
        svg.setAttribute('class', 'flower-svg');
        svg.style.width = size + 'px';
        svg.style.height = size + 'px';

        // Definir gradientes mejorados
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        
        // Gradiente principal para pétalos amarillos
        const petalGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        const gradientId = `petalGradient${Date.now()}${Math.random()}`;
        petalGradient.setAttribute('id', gradientId);
        petalGradient.setAttribute('cx', '50%');
        petalGradient.setAttribute('cy', '30%');
        petalGradient.innerHTML = `
            <stop offset="0%" style="stop-color:#fff200"/>
            <stop offset="30%" style="stop-color:#ffed4e"/>
            <stop offset="70%" style="stop-color:#ffd700"/>
            <stop offset="100%" style="stop-color:#cc9900"/>
        `;
        
        // Gradiente para el centro marrón
        const centerGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        const centerGradientId = `centerGradient${Date.now()}${Math.random()}`;
        centerGradient.setAttribute('id', centerGradientId);
        centerGradient.innerHTML = `
            <stop offset="0%" style="stop-color:#8B4513"/>
            <stop offset="40%" style="stop-color:#A0522D"/>
            <stop offset="80%" style="stop-color:#CD853F"/>
            <stop offset="100%" style="stop-color:#8B4513"/>
        `;

        // Gradiente para efectos de brillo
        const shineGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        const shineGradientId = `shineGradient${Date.now()}${Math.random()}`;
        shineGradient.setAttribute('id', shineGradientId);
        shineGradient.innerHTML = `
            <stop offset="0%" style="stop-color:#ffffff; stop-opacity:0.7"/>
            <stop offset="60%" style="stop-color:#ffff99; stop-opacity:0.3"/>
            <stop offset="100%" style="stop-color:#ffff99; stop-opacity:0"/>
        `;
        
        defs.appendChild(petalGradient);
        defs.appendChild(centerGradient);
        defs.appendChild(shineGradient);
        svg.appendChild(defs);

        // Crear pétalos realistas (12 pétalos para una flor más completa)
        const petalsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        petalsGroup.setAttribute('class', 'flower-petals');
        
        // Capa de pétalos externos (8 pétalos)
        for (let i = 0; i < 8; i++) {
            const petal = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            
            petal.setAttribute('cx', '60');
            petal.setAttribute('cy', '35');
            petal.setAttribute('rx', '8');
            petal.setAttribute('ry', '22');
            petal.setAttribute('fill', `url(#${gradientId})`);
            petal.setAttribute('stroke', '#cc9900');
            petal.setAttribute('stroke-width', '0.5');
            petal.setAttribute('transform', `rotate(${i * 45} 60 60)`);
            petal.style.filter = 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))';
            
            petalsGroup.appendChild(petal);
        }
        
        // Capa de pétalos internos (6 pétalos más pequeños)
        for (let i = 0; i < 6; i++) {
            const petal = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            
            petal.setAttribute('cx', '60');
            petal.setAttribute('cy', '40');
            petal.setAttribute('rx', '6');
            petal.setAttribute('ry', '16');
            petal.setAttribute('fill', `url(#${gradientId})`);
            petal.setAttribute('stroke', '#cc9900');
            petal.setAttribute('stroke-width', '0.5');
            petal.setAttribute('transform', `rotate(${i * 60 + 30} 60 60)`);
            petal.setAttribute('opacity', '0.9');
            
            petalsGroup.appendChild(petal);
        }
        
        svg.appendChild(petalsGroup);

        // Centro marrón realista con textura
        const centerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Círculo base del centro
        const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centerCircle.setAttribute('cx', '60');
        centerCircle.setAttribute('cy', '60');
        centerCircle.setAttribute('r', '10');
        centerCircle.setAttribute('fill', `url(#${centerGradientId})`);
        centerCircle.setAttribute('stroke', '#654321');
        centerCircle.setAttribute('stroke-width', '1');
        
        centerGroup.appendChild(centerCircle);
        
        // Pequeños puntos para textura del centro
        for (let i = 0; i < 20; i++) {
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const angle = (i / 20) * 2 * Math.PI;
            const radius = 3 + Math.random() * 4;
            const x = 60 + Math.cos(angle) * radius;
            const y = 60 + Math.sin(angle) * radius;
            
            dot.setAttribute('cx', x);
            dot.setAttribute('cy', y);
            dot.setAttribute('r', '0.8');
            dot.setAttribute('fill', '#654321');
            dot.setAttribute('opacity', '0.6');
            
            centerGroup.appendChild(dot);
        }
        
        svg.appendChild(centerGroup);

        // Efecto de brillo superior
        const shine = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        shine.setAttribute('cx', '60');
        shine.setAttribute('cy', '50');
        shine.setAttribute('rx', '25');
        shine.setAttribute('ry', '15');
        shine.setAttribute('fill', `url(#${shineGradientId})`);
        shine.setAttribute('opacity', '0.6');
        
        svg.appendChild(shine);

        return svg;
    }

    // Crear el ramo hermoso y equilibrado
    async createBouquet() {
        const bouquetContainer = document.querySelector('.bouquet-container');
        
        // Mostrar el contenedor del ramo
        gsap.to(bouquetContainer, {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "back.out(1.7)"
        });
        
        // Esperar que todas las animaciones del SVG terminen
        // Tallo principal: 3s, ramas: hasta 4.6s, flores: hasta 7.4s + 2s de florecimiento
        await this.delay(10000);
        
        // Las flores ya están fijas en el SVG, solo necesitamos iniciar efectos adicionales
        this.startBouquetEffects();
    }

    // Mostrar mensaje final
    async showFinalMessage() {
        const finalContainer = document.querySelector('.final-message-container');
        const finalBox = document.querySelector('.final-message-box');
        const finalText = document.getElementById('final-text');
        
        const randomMessage = config.finalMessages[Math.floor(Math.random() * config.finalMessages.length)];
        finalText.textContent = randomMessage;
        
        // Animación del contenedor principal
        gsap.to(finalContainer, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });
        
        // Animación de la caja con efecto de escala y entrada suave
        gsap.fromTo(finalBox, 
            {
                scale: 0.8,
                opacity: 0,
                y: 30
            },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "back.out(1.7)",
                delay: 0.3
            }
        );
        
        // Efecto de hover para la caja
        finalBox.addEventListener('mouseenter', () => {
            gsap.to(finalBox, {
                scale: 1.05,
                boxShadow: "0 20px 45px rgba(0, 0, 0, 0.2)",
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        finalBox.addEventListener('mouseleave', () => {
            gsap.to(finalBox, {
                scale: 1,
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        await this.delay(1000);
    }

    // Efectos adicionales para el ramo hermoso
    startBouquetEffects() {
        const bouquetContainer = document.querySelector('.bouquet-container');
        
        // Efectos de luz suaves alrededor del ramo
        setInterval(() => {
            this.createBouquetLightParticle(bouquetContainer);
        }, 2000);
        
        // Efecto de respiración muy sutil para todo el ramo
        gsap.to('.bouquet-svg', {
            scale: 1.02,
            duration: 4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }

    // Crear partícula de luz para el ramo
    createBouquetLightParticle(container) {
        const light = document.createElement('div');
        light.className = 'bouquet-light-particle';
        
        // Posición aleatoria alrededor del ramo
        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angle = Math.random() * 2 * Math.PI;
        const radius = 80 + Math.random() * 40;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        light.style.position = 'absolute';
        light.style.left = x + 'px';
        light.style.top = y + 'px';
        light.style.width = '6px';
        light.style.height = '6px';
        light.style.background = 'radial-gradient(circle, #ffff00, transparent)';
        light.style.borderRadius = '50%';
        light.style.pointerEvents = 'none';
        light.style.zIndex = '20';
        
        container.appendChild(light);
        
        // Animación de la partícula
        gsap.fromTo(light, 
            {
                scale: 0,
                opacity: 0,
                rotation: 0
            },
            {
                scale: Math.random() * 1.5 + 0.5,
                opacity: 1,
                rotation: 360,
                duration: 1,
                ease: "power2.out"
            }
        );
        
        // Movimiento flotante
        gsap.to(light, {
            y: "-=30",
            x: `+=${(Math.random() - 0.5) * 40}`,
            duration: 3,
            ease: "sine.inOut"
        });
        
        // Desaparecer
        gsap.to(light, {
            opacity: 0,
            scale: 0,
            duration: 1,
            delay: 2,
            onComplete: () => {
                if (light.parentNode) {
                    light.parentNode.removeChild(light);
                }
            }
        });
    }

    // Mostrar botones de acción
    showActionButtons() {
        const actionButtons = document.getElementById('action-buttons');
        
        // Habilitar scroll nuevamente
        document.body.style.overflow = 'auto';
        
        gsap.to(actionButtons, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });
        
        this.isAnimationComplete = true;
    }

    // Configurar event listeners
    setupEventListeners() {
        // Throttle para la interactividad del cursor para mejor rendimiento
        let cursorThrottle = false;
        
        const handleCursorMove = (x, y) => {
            if (!cursorThrottle) {
                this.createCursorFlower(x, y);
                cursorThrottle = true;
                setTimeout(() => { cursorThrottle = false; }, 100);
            }
        };

        // Interactividad del cursor/touch
        document.addEventListener('mousemove', (e) => handleCursorMove(e.clientX, e.clientY));
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleCursorMove(touch.clientX, touch.clientY);
        });

        // Click/tap también genera flores
        document.addEventListener('click', (e) => {
            this.createCursorFlower(e.clientX, e.clientY);
            this.createSparkles(e.clientX, e.clientY);
        });

        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.createCursorFlower(touch.clientX, touch.clientY);
            this.createSparkles(touch.clientX, touch.clientY);
        });

        // Botones de descarga
        document.getElementById('download-png').addEventListener('click', () => this.downloadPNG());
        document.getElementById('download-wallpaper-pc').addEventListener('click', () => this.downloadWallpaper('pc'));
        document.getElementById('download-wallpaper-mobile').addEventListener('click', () => this.downloadWallpaper('mobile'));
    }

    // Crear flor del cursor
    createCursorFlower(x, y) {
        const container = document.querySelector('.cursor-flowers-container');
        const flower = this.createFlowerSVG(25);
        
        flower.setAttribute('class', 'cursor-flower');
        flower.style.left = (x - 15) + 'px';
        flower.style.top = (y - 15) + 'px';
        
        container.appendChild(flower);
        
        // Crear efecto de brillo
        this.createSparkles(x, y);
        
        // Remover flor después de la animación
        setTimeout(() => {
            if (flower.parentNode) {
                flower.parentNode.removeChild(flower);
            }
        }, 2000);
    }

    // Crear efecto de brillo/sparkles
    createSparkles(x, y) {
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = (x + (Math.random() - 0.5) * 40) + 'px';
            sparkle.style.top = (y + (Math.random() - 0.5) * 40) + 'px';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1500);
        }
    }

        // Descargar como PNG (solo ramo y mensaje final)
    async downloadPNG() {
        try {
            // Crear canvas limpio
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 800;
            canvas.height = 600;
            
            // Fondo degradado
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#fff8e1');
            gradient.addColorStop(1, '#ffecb3');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Convertir SVG del ramo a imagen
            const bouquetSvg = document.querySelector('.bouquet-svg');
            if (bouquetSvg) {
                const svgData = await this.svgToBase64(bouquetSvg);
                const img = new Image();
                
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        // Dibujar el ramo centrado y escalado (mucho más grande)
                        const scale = 1.5; // Aumentado de 0.6 a 1.5
                        const imgWidth = img.width * scale;
                        const imgHeight = img.height * scale;
                        const x = (canvas.width - imgWidth) / 2;
                        const y = (canvas.height - imgHeight) / 2 - 30; // Ajustar posición
                        
                        ctx.drawImage(img, x, y, imgWidth, imgHeight);
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = svgData;
                });
            }
            
            // Añadir texto
            ctx.fillStyle = '#8d4925';
            ctx.font = 'bold 32px Georgia, serif'; // Aumentar tamaño de fuente
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 3;
            ctx.fillText('Te quiere tu amor eterno 💛', canvas.width / 2, canvas.height - 40); // Ajustar posición
            
            // Descargar
            const link = document.createElement('a');
            link.download = `ramo-flores-amarillas-${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png', 0.9);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('Error al descargar PNG:', error);
            alert(`Error al generar la imagen: ${error.message}\n\nIntenta usar la captura de pantalla de tu navegador como alternativa.`);
        }
    }

            // Descargar wallpaper (ramo real)
    async downloadWallpaper(type) {
        try {
            // Configurar dimensiones
            const dimensions = type === 'pc' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 };
            
            // Crear canvas limpio
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;
            
            // Fondo degradado
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#fff8e1');
            gradient.addColorStop(0.5, '#ffecb3');
            gradient.addColorStop(1, '#ffe082');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Convertir SVG del ramo a imagen
            const bouquetSvg = document.querySelector('.bouquet-svg');
            if (bouquetSvg) {
                const svgData = await this.svgToBase64(bouquetSvg);
                const img = new Image();
                
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        // Dibujar el ramo centrado y escalado (mucho más grande)
                        const scale = type === 'pc' ? 2.0 : 2.5; // Aumentado significativamente
                        const imgWidth = img.width * scale;
                        const imgHeight = img.height * scale;
                        const x = (canvas.width - imgWidth) / 2;
                        const y = (canvas.height - imgHeight) / 2 - 20; // Ajustar posición
                        
                        ctx.drawImage(img, x, y, imgWidth, imgHeight);
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = svgData;
                });
            }
            
            // Añadir texto
            const fontSize = type === 'pc' ? 72 : 56; // Aumentar tamaño de fuente
            ctx.fillStyle = '#8d4925';
            ctx.font = `bold ${fontSize}px Georgia, serif`;
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 10;
            
            const textY = type === 'pc' ? canvas.height - 80 : canvas.height - 120; // Ajustar posición
            ctx.fillText('Te quiere tu amor eterno 💛', canvas.width / 2, textY);
            
            // Descargar
            const link = document.createElement('a');
            link.download = `wallpaper-flores-${type}-${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png', 0.9);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('Error al crear wallpaper:', error);
            alert(`Error al generar el fondo de pantalla: ${error.message}\n\nIntenta usar la captura de pantalla como alternativa.`);
        }
    }

    // Convertir SVG a base64 para evitar canvas tainted
    async svgToBase64(svgElement) {
        // Clonar el SVG para no afectar el original
        const clonedSvg = svgElement.cloneNode(true);
        
        // Asegurar que el SVG tenga dimensiones
        if (!clonedSvg.getAttribute('width')) {
            clonedSvg.setAttribute('width', '400');
        }
        if (!clonedSvg.getAttribute('height')) {
            clonedSvg.setAttribute('height', '400');
        }
        
        // Obtener todos los estilos CSS aplicados
        const styleSheets = Array.from(document.styleSheets);
        let cssText = '';
        
        styleSheets.forEach(sheet => {
            try {
                const rules = Array.from(sheet.cssRules || sheet.rules);
                rules.forEach(rule => {
                    if (rule.cssText.includes('.flower') || 
                        rule.cssText.includes('.stem') || 
                        rule.cssText.includes('.leaf') ||
                        rule.cssText.includes('.bow') ||
                        rule.cssText.includes('.bouquet')) {
                        cssText += rule.cssText + '\n';
                    }
                });
            } catch (e) {
                // Ignorar errores de CORS en hojas de estilo
            }
        });
        
        // Crear elemento style con los CSS necesarios
        const styleElement = document.createElement('style');
        styleElement.textContent = cssText;
        clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);
        
        // Serializar el SVG
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);
        
        // Convertir a base64
        const base64 = btoa(unescape(encodeURIComponent(svgString)));
        
        return `data:image/svg+xml;base64,${base64}`;
    }

    // Dibujar el ramo real exactamente como aparece en pantalla
    async drawRealBouquetOnCanvas(ctx, centerX, centerY, scale = 1) {
        const bouquetContainer = document.querySelector('.bouquet-container');
        if (!bouquetContainer) return;
        
        // Obtener las posiciones reales de las flores desde el DOM
        const flowers = bouquetContainer.querySelectorAll('.flower');
        const stems = bouquetContainer.querySelectorAll('.stem');
        const leaves = bouquetContainer.querySelectorAll('.leaf');
        
        // Obtener el contenedor del ramo para calcular offset
        const bouquetRect = bouquetContainer.getBoundingClientRect();
        const bouquetCenterX = bouquetRect.width / 2;
        const bouquetCenterY = bouquetRect.height / 2;
        
        // Dibujar tallos primero
        stems.forEach(stem => {
            const rect = stem.getBoundingClientRect();
            const bouquetContainerRect = bouquetContainer.getBoundingClientRect();
            
            // Calcular posición relativa al contenedor del ramo
            const relativeX = (rect.left + rect.width/2 - bouquetContainerRect.left) - bouquetCenterX;
            const relativeY = (rect.top + rect.height/2 - bouquetContainerRect.top) - bouquetCenterY;
            
            // Aplicar escala y centrar en canvas
            const canvasX = centerX + (relativeX * scale);
            const canvasY = centerY + (relativeY * scale);
            
            // Obtener transformaciones del tallo
            const transform = window.getComputedStyle(stem).transform;
            let rotation = 0;
            if (transform && transform !== 'none') {
                const matrix = transform.match(/matrix\(([^)]*)\)/);
                if (matrix) {
                    const values = matrix[1].split(', ');
                    rotation = Math.atan2(parseFloat(values[1]), parseFloat(values[0]));
                }
            }
            
            // Dibujar tallo
            this.drawStemOnCanvas(ctx, canvasX, canvasY, rotation, rect.height * scale);
        });
        
        // Dibujar hojas
        leaves.forEach(leaf => {
            const rect = leaf.getBoundingClientRect();
            const bouquetContainerRect = bouquetContainer.getBoundingClientRect();
            
            const relativeX = (rect.left + rect.width/2 - bouquetContainerRect.left) - bouquetCenterX;
            const relativeY = (rect.top + rect.height/2 - bouquetContainerRect.top) - bouquetCenterY;
            
            const canvasX = centerX + (relativeX * scale);
            const canvasY = centerY + (relativeY * scale);
            
            this.drawRealLeafOnCanvas(ctx, canvasX, canvasY, 15 * scale);
        });
        
        // Dibujar flores
        flowers.forEach(flower => {
            const rect = flower.getBoundingClientRect();
            const bouquetContainerRect = bouquetContainer.getBoundingClientRect();
            
            const relativeX = (rect.left + rect.width/2 - bouquetContainerRect.left) - bouquetCenterX;
            const relativeY = (rect.top + rect.height/2 - bouquetContainerRect.top) - bouquetCenterY;
            
            const canvasX = centerX + (relativeX * scale);
            const canvasY = centerY + (relativeY * scale);
            
            this.drawRealFlowerOnCanvas(ctx, canvasX, canvasY, 40 * scale);
        });
        
        // Dibujar moño en la base
        const bowContainer = bouquetContainer.querySelector('.bow-container');
        if (bowContainer) {
            const bowRect = bowContainer.getBoundingClientRect();
            const bouquetContainerRect = bouquetContainer.getBoundingClientRect();
            
            const relativeX = (bowRect.left + bowRect.width/2 - bouquetContainerRect.left) - bouquetCenterX;
            const relativeY = (bowRect.top + bowRect.height/2 - bouquetContainerRect.top) - bouquetCenterY;
            
            const canvasX = centerX + (relativeX * scale);
            const canvasY = centerY + (relativeY * scale);
            
            this.drawRealBowOnCanvas(ctx, canvasX, canvasY, scale);
        }
    }
    
    // Dibujar tallo real
    drawStemOnCanvas(ctx, x, y, rotation, length) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        const gradient = ctx.createLinearGradient(0, -length/2, 0, length/2);
        gradient.addColorStop(0, '#4caf50');
        gradient.addColorStop(0.5, '#2e7d32');
        gradient.addColorStop(1, '#1b5e20');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -length/2);
        ctx.lineTo(0, length/2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Dibujar hoja real
    drawRealLeafOnCanvas(ctx, x, y, size) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, '#66bb6a');
        gradient.addColorStop(0.7, '#4caf50');
        gradient.addColorStop(1, '#2e7d32');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.5, size, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Dibujar flor real (como las SVG originales)
    drawRealFlowerOnCanvas(ctx, x, y, size) {
        // Pétalos exteriores
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * 2 * Math.PI;
            const petalX = x + Math.cos(angle) * (size * 0.6);
            const petalY = y + Math.sin(angle) * (size * 0.6);
            
            ctx.fillStyle = '#ffeb3b';
            ctx.beginPath();
            ctx.arc(petalX, petalY, size * 0.25, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Pétalos interiores
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * 2 * Math.PI + (Math.PI / 8);
            const petalX = x + Math.cos(angle) * (size * 0.4);
            const petalY = y + Math.sin(angle) * (size * 0.4);
            
            ctx.fillStyle = '#ffc107';
            ctx.beginPath();
            ctx.arc(petalX, petalY, size * 0.2, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Centro
        const centerGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 0.2);
        centerGradient.addColorStop(0, '#ff8f00');
        centerGradient.addColorStop(1, '#e65100');
        
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.2, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Dibujar moño real
    drawRealBowOnCanvas(ctx, x, y, scale) {
        const bowSize = 35 * scale;
        
        // Gradiente del moño
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, bowSize);
        gradient.addColorStop(0, '#e91e63');
        gradient.addColorStop(0.7, '#c2185b');
        gradient.addColorStop(1, '#ad1457');
        
        // Parte izquierda
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(x - bowSize * 0.4, y, bowSize * 0.6, bowSize * 0.8, -0.3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Parte derecha
        ctx.beginPath();
        ctx.ellipse(x + bowSize * 0.4, y, bowSize * 0.6, bowSize * 0.8, 0.3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Centro
        ctx.fillStyle = '#6a1b9a';
        ctx.beginPath();
        ctx.ellipse(x, y, bowSize * 0.3, bowSize * 0.5, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Dibujar ramo programáticamente en canvas
    async drawBouquetOnCanvas(ctx, centerX, centerY, scale = 1) {
        const baseY = centerY + 80 * scale;
        
        // Configuración del ramo (misma que en generateRadialBouquet)
        const config = {
            numStems: 7,
            stemPositions: [
                { angle: -18, length: 200 * scale, id: 1 },
                { angle: 18, length: 220 * scale, id: 2 },
                { angle: -45, length: 180 * scale, id: 3 },
                { angle: 45, length: 210 * scale, id: 4 },
                { angle: -70, length: 160 * scale, id: 5 },
                { angle: 70, length: 170 * scale, id: 6 },
                { angle: 0, length: 240 * scale, id: 7 }
            ]
        };
        
        // Dibujar tallos primero
        config.stemPositions.forEach(stem => {
            const angle = (stem.angle * Math.PI) / 180;
            const endX = centerX + Math.sin(angle) * stem.length;
            const endY = baseY - Math.cos(angle) * stem.length;
            
            // Dibujar tallo con gradiente
            const gradient = ctx.createLinearGradient(centerX, baseY, endX, endY);
            gradient.addColorStop(0, '#2e7d32');
            gradient.addColorStop(1, '#4caf50');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 6 * scale;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(centerX, baseY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            // Dibujar hojas en el tallo
            const leafPositions = [0.3, 0.6, 0.8];
            leafPositions.forEach(pos => {
                const leafX = centerX + Math.sin(angle) * (stem.length * pos);
                const leafY = baseY - Math.cos(angle) * (stem.length * pos);
                this.drawLeafOnCanvas(ctx, leafX, leafY, angle, 12 * scale);
            });
        });
        
        // Dibujar flores después para que estén encima
        config.stemPositions.forEach(stem => {
            const angle = (stem.angle * Math.PI) / 180;
            const endX = centerX + Math.sin(angle) * stem.length;
            const endY = baseY - Math.cos(angle) * stem.length;
            
            // Dibujar flor en el extremo
            this.drawFlowerOnCanvas(ctx, endX, endY, 45 * scale);
        });
        
        // Dibujar moño en la base
        this.drawBowOnCanvas(ctx, centerX, baseY, scale);
    }
    
    // Dibujar hoja realista en canvas
    drawLeafOnCanvas(ctx, x, y, angle, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI/4);
        
        // Hoja con gradiente
        const gradient = ctx.createLinearGradient(-size/2, -size, size/2, size);
        gradient.addColorStop(0, '#66bb6a');
        gradient.addColorStop(0.5, '#4caf50');
        gradient.addColorStop(1, '#2e7d32');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.4, size, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Línea central de la hoja
        ctx.strokeStyle = '#2e7d32';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(0, size);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Dibujar una flor en canvas
    drawFlowerOnCanvas(ctx, x, y, size) {
        const petalCount = 8;
        
        // Dibujar pétalos exteriores primero
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * 2 * Math.PI;
            this.drawPetalOnCanvas(ctx, x, y, angle, size * 0.9, '#ffeb3b');
        }
        
        // Dibujar pétalos interiores
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * 2 * Math.PI + (Math.PI / petalCount);
            this.drawPetalOnCanvas(ctx, x, y, angle, size * 0.7, '#ffc107');
        }
        
        // Centro de la flor con gradiente
        const centerGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 0.25);
        centerGradient.addColorStop(0, '#ff8f00');
        centerGradient.addColorStop(0.7, '#f57c00');
        centerGradient.addColorStop(1, '#bf360c');
        
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.25, 0, 2 * Math.PI);
        ctx.fill();
        
        // Textura del centro
        ctx.fillStyle = '#8d4004';
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * 2 * Math.PI;
            const dotX = x + Math.cos(angle) * (size * 0.15);
            const dotY = y + Math.sin(angle) * (size * 0.15);
            ctx.beginPath();
            ctx.arc(dotX, dotY, size * 0.02, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    // Dibujar un pétalo individual
    drawPetalOnCanvas(ctx, centerX, centerY, angle, size, color) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        // Gradiente del pétalo
        const gradient = ctx.createLinearGradient(0, -size * 0.5, 0, size * 0.5);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, '#fff59d');
        gradient.addColorStop(1, color);
        
        ctx.fillStyle = gradient;
        
        // Forma del pétalo
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.1);
        ctx.quadraticCurveTo(size * 0.2, -size * 0.3, size * 0.15, -size * 0.6);
        ctx.quadraticCurveTo(0, -size * 0.7, -size * 0.15, -size * 0.6);
        ctx.quadraticCurveTo(-size * 0.2, -size * 0.3, 0, -size * 0.1);
        ctx.closePath();
        ctx.fill();
        
        // Sombra del pétalo
        ctx.strokeStyle = '#f9a825';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Dibujar moño en canvas
    drawBowOnCanvas(ctx, x, y, scale) {
        const bowSize = 30 * scale;
        
        // Gradiente para el moño
        const bowGradient = ctx.createLinearGradient(x - bowSize, y - bowSize, x + bowSize, y + bowSize);
        bowGradient.addColorStop(0, '#e91e63');
        bowGradient.addColorStop(0.5, '#c2185b');
        bowGradient.addColorStop(1, '#ad1457');
        
        // Sombra del moño
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 5 * scale;
        ctx.shadowOffsetX = 2 * scale;
        ctx.shadowOffsetY = 2 * scale;
        
        // Parte izquierda del moño
        ctx.fillStyle = bowGradient;
        ctx.beginPath();
        ctx.ellipse(x - bowSize * 0.4, y, bowSize * 0.7, bowSize * 0.9, -0.3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Parte derecha del moño
        ctx.beginPath();
        ctx.ellipse(x + bowSize * 0.4, y, bowSize * 0.7, bowSize * 0.9, 0.3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Quitar sombra para el centro
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Centro del moño con gradiente más oscuro
        const centerGradient = ctx.createLinearGradient(x - bowSize * 0.3, y - bowSize * 0.4, x + bowSize * 0.3, y + bowSize * 0.4);
        centerGradient.addColorStop(0, '#8e24aa');
        centerGradient.addColorStop(0.5, '#6a1b9a');
        centerGradient.addColorStop(1, '#4a148c');
        
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.ellipse(x, y, bowSize * 0.35, bowSize * 0.5, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Brillo en el centro
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.ellipse(x - bowSize * 0.1, y - bowSize * 0.1, bowSize * 0.1, bowSize * 0.15, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Mostrar barra de carga
    async showLoadingBar() {
        const loadingContainer = document.getElementById('loading-container');
        loadingContainer.classList.add('show');
        
        // Esperar a que termine la barra de carga (2.5s de animación + 0.5s extra)
        await this.delay(3000);
        
        // Ocultar barra de carga
        loadingContainer.classList.remove('show');
        await this.delay(500); // Tiempo para que se oculte
    }

    // Mostrar ramo radial integrado
    showBouquet() {
        // Mostrar el ramo primero
        const bouquetContainer = document.getElementById('bouquet-container');
        bouquetContainer.classList.add('show');
        
        // Generar el ramo
        setTimeout(() => {
            this.generateRadialBouquet();
        }, 500);
        
        // Después mostrar el moño en la base
        setTimeout(() => {
            const bowContainer = document.getElementById('bow-container');
            bowContainer.classList.add('show');
        }, 2000); // Esperar a que aparezca el ramo completo
    }

    // Generar ramo radial (EXACTAMENTE IGUAL A OPCIÓN A)
    generateRadialBouquet() {
        // Configuración EXACTA de la opción A
        const config = {
            numStems: 7,
            basePoint: { x: 330, y: 1575 },     // Exactamente igual que opción A
            petalsPerFlower: 10,
            stemPositions: [
                // EXACTAMENTE las mismas posiciones que opción A
                { angle: -18, length: 1100, id: 1, curve: 0.3 },   // Izquierda alta
                { angle: 18, length: 1100, id: 2, curve: 0.3 },    // Derecha alta
                { angle: -30, length: 950, id: 3, curve: 0.4 },    // Izquierda media
                { angle: 0, length: 1000, id: 4, curve: 0.2 },     // Centro media (más alta)
                { angle: 30, length: 950, id: 5, curve: 0.4 },     // Derecha media
                { angle: -12, length: 750, id: 6, curve: 0.3 },    // Izquierda baja
                { angle: 12, length: 750, id: 7, curve: 0.3 }      // Derecha baja
            ]
        };

        const stemsGroup = document.getElementById('stemsGroup');
        const flowersGroup = document.getElementById('flowersGroup');
        const leavesGroup = document.getElementById('leavesGroup');
        
        [stemsGroup, flowersGroup, leavesGroup].forEach(g => g.innerHTML = '');
        
        const stemData = [];
        
        // Generar tallos EXACTAMENTE igual que opción A
        config.stemPositions.forEach(pos => {
            const stem = this.createStem(pos.id, pos.angle, pos.length, pos.curve, config.basePoint);
            stemsGroup.appendChild(stem.element);
            stemData.push(stem);
        });
        
        // Crear flores EXACTAMENTE en las puntas de los tallos
        stemData.forEach((stem, index) => {
            const flower = this.createBouquetFlower(index + 1, stem.endPoint, config);
            flowersGroup.appendChild(flower);
        });
        
        // Crear hojas: exactamente 2 por tallo IGUAL que opción A
        this.createBouquetLeaves(leavesGroup, stemData, config);
    }

    // Crear tallo para el ramo (EXACTAMENTE IGUAL A OPCIÓN A)
    createStem(index, angle, length, curveFactor, basePoint) {
        const angleRad = (angle * Math.PI) / 180;
        
        // FÓRMULA EXACTA de la opción A
        const finalX = basePoint.x + Math.sin(angleRad) * length;
        const finalY = basePoint.y - Math.cos(Math.abs(angleRad)) * length;
        
        // Múltiples puntos de control para curvas orgánicas (EXACTOS)
        const control1X = basePoint.x + Math.sin(angleRad) * (length * 0.3);
        const control1Y = basePoint.y - (length * 0.4);
        const control2X = basePoint.x + Math.sin(angleRad) * (length * 0.7) + (Math.cos(angleRad) * 30 * curveFactor);
        const control2Y = basePoint.y - (length * 0.7);
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathData = `M ${basePoint.x} ${basePoint.y} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${finalX} ${finalY}`;
        
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', 'url(#stemGradient)');
        
        // GROSORES EXACTOS de la opción A
        let strokeWidth;
        if (index <= 2) {
            strokeWidth = 25;  // Tallos altos: grosor 25
        } else if (index <= 5) {
            strokeWidth = 20;  // Tallos medios: grosor 20  
        } else {
            strokeWidth = 17.5; // Tallos bajos: grosor 17.5
        }
        
        path.setAttribute('stroke-width', strokeWidth);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.classList.add('stem', `stem-${index}`);
        
        return {
            element: path,
            endPoint: { x: finalX, y: finalY }
        };
    }

    // Crear flor para el ramo (EXACTAMENTE IGUAL A OPCIÓN A)
    createBouquetFlower(index, position, config) {
        // Contenedor principal - SOLO para posicionamiento (EXACTO)
        const positionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        positionGroup.setAttribute('transform', `translate(${position.x}, ${position.y})`);
        
        // Grupo interno - SOLO para animaciones (EXACTO)
        const animationGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        animationGroup.classList.add('flower', `flower-${index}`);
        
        // Crear pétalos EXACTAMENTE igual que opción A
        for (let i = 0; i < config.petalsPerFlower; i++) {
            const petal = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            const rotation = (360 / config.petalsPerFlower) * i;
            
            // Pétalos 50% más grandes: EXACTOS de opción A (56.25 x 123.75)
            petal.setAttribute('rx', 56.25);
            petal.setAttribute('ry', 123.75);
            petal.setAttribute('cx', 0);
            petal.setAttribute('cy', -67.5);     // EXACTO: -45*1.5=-67.5
            petal.setAttribute('fill', 'url(#petalGradient)');
            petal.setAttribute('transform', `rotate(${rotation})`);
            
            animationGroup.appendChild(petal);
        }
        
        // Centro de la flor EXACTO: 50% más grande (30*1.5=45)
        const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        center.setAttribute('cx', 0);
        center.setAttribute('cy', 0);
        center.setAttribute('r', 45);  // EXACTO de opción A
        center.setAttribute('fill', 'url(#centerGradient)');
        
        animationGroup.appendChild(center);
        positionGroup.appendChild(animationGroup);
        
        return positionGroup;
    }

    // Crear hojas para el ramo (2 por tallo)
    createBouquetLeaves(container, stemData, config) {
        stemData.forEach((stem, stemIndex) => {
            const stemPos = config.stemPositions[stemIndex];
            const angleRad = (stemPos.angle * Math.PI) / 180;
            const base = config.basePoint;
            
            const positions = [
                { factor: 0.25, type: 'bottom' },
                { factor: 0.75, type: 'top' }
            ];
            
            positions.forEach((pos, leafIndex) => {
                const distance = stemPos.length * pos.factor;
                const leafX = base.x + Math.sin(angleRad) * distance;
                const leafY = base.y - Math.cos(Math.abs(angleRad)) * distance;
                
                const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                leaf.setAttribute('cx', leafX);
                leaf.setAttribute('cy', leafY);
                
                const isBottomLeaf = pos.type === 'bottom';
                leaf.setAttribute('rx', isBottomLeaf ? 14 : 10);
                leaf.setAttribute('ry', isBottomLeaf ? 32 : 24);
                leaf.setAttribute('fill', isBottomLeaf ? '#2e7d32' : '#4caf50');
                leaf.setAttribute('stroke', isBottomLeaf ? '#1b5e20' : '#388e3c');
                leaf.setAttribute('stroke-width', '1');
                
                const baseRotation = stemPos.angle;
                const variation = isBottomLeaf ? -20 : 15;
                const rotation = baseRotation + variation;
                
                leaf.setAttribute('transform', `rotate(${rotation} ${leafX} ${leafY})`);
                
                const leafNumber = (stemIndex * 2) + leafIndex + 1;
                leaf.classList.add('leaf', `leaf-${leafNumber}`);
                leaf.setAttribute('filter', 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))');
                
                container.appendChild(leaf);
            });
        });
    }

    // Utilidad para delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FlowerAnimation();
});

// Prevenir zoom en dispositivos móviles
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);