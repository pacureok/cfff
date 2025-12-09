// Declaración global de los sintetizadores
let polySynth; 
let noiseSynth;

// Inicialización de Tone.js - Ejecutar inmediatamente después de la carga del script de Tone.js
if (typeof Tone !== 'undefined') {
     try {
        // Inicializa los sintetizadores de Tone.js
        polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
        noiseSynth = new Tone.NoiseSynth().toDestination();
     } catch (e) {
        console.error("Error al inicializar sintetizadores de Tone.js:", e);
        polySynth = undefined; // Forzar el estado de fallo si algo sale mal
     }
} else {
     console.error("Error: Tone.js no está definido. Verifique la carga del script.");
}

// Datos de las etapas de evolución del Digimon
const evolutions = [
    { name: "Botamon", stage: "Bebé I", emoji: "🥚", classes: "ring-indigo-400 bg-indigo-900/20", image: "https://placehold.co/180x180/6366f1/white?text=Botamon" },
    { name: "Koromon", stage: "Bebé II", emoji: "✨", classes: "ring-purple-500 bg-purple-900/30", image: "https://placehold.co/180x180/a855f7/white?text=Koromon" },
    { name: "Agumon", stage: "Principiante", emoji: "🦖", classes: "ring-red-600 bg-red-900/30", image: "https://placehold.co/180x180/f87171/white?text=Agumon" },
    { name: "Greymon", stage: "Campeón", emoji: "🔥", classes: "ring-yellow-500 bg-yellow-900/50", image: "https://placehold.co/180x180/facc15/black?text=Greymon" },
    { name: "MetalGreymon", stage: "Definitivo", emoji: "⚙️", classes: "ring-sky-500 bg-sky-900/50", image: "https://placehold.co/180x180/0ea5e9/white?text=MetalGreymon" },
    { name: "WarGreymon", stage: "Mega", emoji: "🛡️", classes: "ring-amber-500 bg-amber-900/60", image: "https://placehold.co/180x180/f59e0b/white?text=WarGreymon" }
];

let currentStageIndex = 0;
let isEvolving = false;
const baseDisplayClasses = "relative flex flex-col items-center justify-center p-8 rounded-xl mb-8 transition-all duration-700";

// Elementos del DOM
const digimonImage = document.getElementById('digimon-image');
const digimonName = document.getElementById('digimon-name');
const digimonStage = document.getElementById('digimon-stage');
const evolveButton = document.getElementById('evolve-button');
const digimonDisplay = document.getElementById('digimon-display');
const statusMessage = document.getElementById('status-message');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');

/**
 * Actualiza la interfaz con los datos del Digimon de la etapa actual.
 * @param {number} index - Índice de la nueva etapa.
 */
function updateDigimonDisplay(index) {
    const digimon = evolutions[index];
    
    digimonName.textContent = `${digimon.name} ${digimon.emoji}`;
    digimonStage.textContent = digimon.stage;
    digimonImage.src = digimon.image;

    // Restablecer clases base y aplicar clases dinámicas de color/ring
    digimonDisplay.className = baseDisplayClasses; // Limpia las clases anteriores
    digimonDisplay.classList.add(...digimon.classes.split(' '));
    
    // Actualiza el texto del botón si es la etapa final
    if (index === evolutions.length - 1) {
        evolveButton.textContent = "¡MÁXIMO NIVEL ALCANZADO!";
        statusMessage.textContent = "¡La búsqueda de más poder ha terminado!";
    } else {
        evolveButton.textContent = "¡DIGIEVOLUCIONAR!";
    }
}

/**
 * Simula la barra de progreso.
 */
function startProgressBar(durationMs) {
    progressContainer.classList.remove('hidden');
    progressBar.style.width = '0%';
    
    const startTime = Date.now();
    
    function update() {
        if (!isEvolving) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        
        progressBar.style.width = `${progress * 100}%`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            progressContainer.classList.add('hidden');
            progressBar.style.width = '0%';
        }
    }
    requestAnimationFrame(update);
}

/**
 * Maneja el proceso de evolución (se llama desde el botón en index.html).
 */
async function attemptEvolution() {
    
    // Si los synths no se inicializaron correctamente, salimos
    if (!polySynth) {
        statusMessage.textContent = "Error: Funcionalidad de audio deshabilitada. Recargue la página.";
        return;
    }
    
    // Asegurarse de que el audio esté activado antes de empezar
    if (Tone.context.state !== 'running') {
        await Tone.start();
    }


    if (isEvolving) return;

    if (currentStageIndex >= evolutions.length - 1) {
        statusMessage.textContent = "¡El Digimon ya está en su etapa final!";
        evolveButton.disabled = true;
        return;
    }

    isEvolving = true;
    evolveButton.disabled = true;
    statusMessage.textContent = "¡Comenzando la Digievolución! ¡Abre la puerta digital!";
    
    // 1. Efecto de Carga (Sonido y Barra)
    polySynth.triggerAttackRelease(["C3", "G3"], "4n"); // Sonido de inicio
    noiseSynth.triggerAttackRelease("4n"); // Sonido de ruido digital
    
    const evolutionDuration = 3000; // 3 segundos para la animación completa
    startProgressBar(evolutionDuration);

    // 2. Destello (Flash) y Giro
    digimonDisplay.classList.add('evolution-flash');
    digimonImage.classList.remove('evolution-enter-active'); 
    
    // Pausa media para la carga
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. Ocultar el Digimon actual y sonido de pico
    digimonImage.classList.add('evolution-enter');
    polySynth.triggerAttackRelease("C6", "8n"); // Sonido agudo de pico
    statusMessage.textContent = "....DIGIVOLVING ENERGÍA AL MÁXIMO....";

    // Pausa corta para que el Digimon desaparezca
    await new Promise(resolve => setTimeout(resolve, 500)); 

    // 4. Actualizar los datos al siguiente Digimon
    currentStageIndex += 1;
    updateDigimonDisplay(currentStageIndex);
    
    // 5. Mostrar el nuevo Digimon con animación de entrada
    digimonImage.classList.remove('evolution-enter');
    void digimonImage.offsetWidth; // Forzar reflow/repaint para la transición
    digimonImage.classList.add('evolution-enter-active');

    // 6. Fin de la Animación y sonido de éxito
    digimonDisplay.classList.remove('evolution-flash');
    
    // Sonido de Evolución Exitosa (Acorde majestuoso)
    polySynth.triggerAttackRelease(["C5", "E5", "G5"], "2n"); 

    statusMessage.textContent = `¡Felicidades! Evolucionó a ${evolutions[currentStageIndex].name}. ¡A luchar!`;
    
    isEvolving = false;
    evolveButton.disabled = false;
    progressContainer.classList.add('hidden');

    // Desactivar si se alcanzó la etapa final
    if (currentStageIndex === evolutions.length - 1) {
        evolveButton.disabled = true;
        polySynth.triggerAttackRelease(["C6", "G6"], "1n"); // Sonido final de victoria
    }
}

// Inicializa la pantalla al cargar (solo actualizaciones del DOM y estado)
window.onload = () => {
    if (!polySynth) {
         statusMessage.textContent = "Error: El componente de audio (Tone.js) no cargó. El botón de evolución está desactivado.";
         evolveButton.disabled = true;
    } else {
         statusMessage.textContent = "Haz click en 'DIGIEVOLUCIONAR' para iniciar la secuencia y habilitar el audio.";
         evolveButton.disabled = false;
    }

    updateDigimonDisplay(currentStageIndex);
};
