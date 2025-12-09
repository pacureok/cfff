// Elementos del DOM declarados para tener un alcance global
let digimonImage;
let digimonName;
let digimonStage;
let evolveButton;
let digimonDisplay;
let statusMessage;
let progressBar;
let progressContainer;

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
    
    if (isEvolving) return;

    if (currentStageIndex >= evolutions.length - 1) {
        statusMessage.textContent = "¡El Digimon ya está en su etapa final!";
        evolveButton.disabled = true;
        return;
    }

    isEvolving = true;
    evolveButton.disabled = true;
    statusMessage.textContent = "¡Comenzando la Digievolución! ¡Abre la puerta digital!";
    
    const evolutionDuration = 3000; // 3 segundos para la animación completa
    startProgressBar(evolutionDuration);

    // 1. Destello (Flash) y Giro
    digimonDisplay.classList.add('evolution-flash');
    digimonImage.classList.remove('evolution-enter-active'); 
    
    // Pausa media para la carga
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 2. Ocultar el Digimon actual
    digimonImage.classList.add('evolution-enter');
    statusMessage.textContent = "....DIGIVOLVING ENERGÍA AL MÁXIMO....";

    // Pausa corta para que el Digimon desaparezca
    await new Promise(resolve => setTimeout(resolve, 500)); 

    // 3. Actualizar los datos al siguiente Digimon
    currentStageIndex += 1;
    updateDigimonDisplay(currentStageIndex);
    
    // 4. Mostrar el nuevo Digimon con animación de entrada
    digimonImage.classList.remove('evolution-enter');
    void digimonImage.offsetWidth; // Forzar reflow/repaint para la transición
    digimonImage.classList.add('evolution-enter-active');

    // 5. Fin de la Animación
    digimonDisplay.classList.remove('evolution-flash');

    statusMessage.textContent = `¡Felicidades! Evolucionó a ${evolutions[currentStageIndex].name}. ¡A luchar!`;
    
    isEvolving = false;
    evolveButton.disabled = false;
    progressContainer.classList.add('hidden');

    // Desactivar si se alcanzó la etapa final
    if (currentStageIndex === evolutions.length - 1) {
        evolveButton.disabled = true;
    }
}

// Inicializa la pantalla al cargar (obtiene el DOM y actualiza el estado)
window.onload = () => {
    // Obtener todos los elementos del DOM (asegurando su existencia)
    digimonImage = document.getElementById('digimon-image');
    digimonName = document.getElementById('digimon-name');
    digimonStage = document.getElementById('digimon-stage');
    evolveButton = document.getElementById('evolve-button');
    digimonDisplay = document.getElementById('digimon-display');
    statusMessage = document.getElementById('status-message');
    progressBar = document.getElementById('progress-bar');
    progressContainer = document.getElementById('progress-container');
    
    // Mensaje inicial
    statusMessage.textContent = "El simulador de evolución está listo para la acción.";
    evolveButton.disabled = false;

    // Actualizar la interfaz inicial
    updateDigimonDisplay(currentStageIndex);
};
