'use client';

interface ReverseSearchButtonsProps {
    className?: string;
    mode?: 'location' | 'people' | 'military';
}

export function ReverseSearchButtons({ className = '', mode = 'location' }: ReverseSearchButtonsProps) {
    const handleServiceClick = (service: 'google' | 'yandex' | 'tineye' | 'pimeyes') => {
        let url = '';
        let message = '';

        const isPeople = mode === 'people';
        const isMilitary = mode === 'military';

        switch (service) {
            case 'google':
                url = 'https://images.google.com';
                if (isPeople) {
                    message = `
🔍 Google Lens(Personas) - Instrucciones:

1. Busca coincidencias en redes sociales(LinkedIn, Twitter, Facebook).
2. Verifica si la imagen ha sido usada en prensa o artículos.
3. Presta atención a "Personas también buscaron".`;
                } else if (isMilitary) {
                    message = `
🔍 Google Lens(Militar) - Instrucciones:

1. Úsalo para identificar la "familia base" del vehículo.
2. Compara cuidadosamente: ruedas, escotillas, y ubicación del escape.
3. Busca enlaces a foros de defensa(Tankograd, Army Recognition).`;
                } else {
                    message = `
🔍 Google Lens - Instrucciones:

1. Se abrirá Google Images en una nueva pestaña
2. Haz clic en el icono de cámara(📷) en la barra de búsqueda
3. Sube la misma imagen que estás analizando
4. Analiza los resultados visuales y busca coincidencias exactas`;
                }
                break;

            case 'yandex':
                url = 'https://yandex.com/images';
                if (isPeople) {
                    message = `
🔴 Yandex Images(Personas) - Instrucciones:

1. Extremadamente potente para encontrar rostros.
2. Muy efectivo para redes sociales rusas / europeas(VK, OK).
3. A veces encuentra perfiles que Google ha desindexado.`;
                } else if (isMilitary) {
                    message = `
🔴 Yandex Images(Militar) - Instrucciones:

1. MEJOR OPCIÓN para equipamiento del bloque oriental y europeo.
2. Encuentra muchas fotos de maniobras y desfiles que no están en Google.
3. Útil para verificar variantes específicas de exportación.`;
                } else {
                    message = `
🔴 Yandex Images - Instrucciones:

1. Se abrirá Yandex Images en una nueva pestaña
2. Haz clic en el icono de cámara en la barra de búsqueda
3. Sube la imagen para buscar
4. Revisa especialmente los resultados en Europa del Este y Asia`;
                }
                break;

            case 'tineye':
                url = 'https://tineye.com';
                message = `
🟣 TinEye - Instrucciones:

1. Úsalo para detectar perfiles falsos(catfishing).
2. Encuentra la FECHA ORIGINAL de la foto.
3. Verifica si es una foto de stock.`;
                break;

            case 'pimeyes':
                url = 'https://pimeyes.com';
                message = `
⚠️ PIMEYES - RECONOCIMIENTO FACIAL

1. Herramienta de pago(algunas funciones gratis).
2. Busca coincidencias faciales exactas en la open web.
3. USO AUTORIZADO SOLAMENTE - Respeta leyes de privacidad.`;
                break;
        }

        // Open service immediately
        window.open(url, '_blank');

        // Show alert after short delay
        setTimeout(() => {
            alert(message);
        }, 500);
    };

    const getHeaderContent = () => {
        switch (mode) {
            case 'people':
                return {
                    icon: 'bust_in_silhouette',
                    emoji: '👤', // Added emoji for consistency
                    title: 'Identificación & Rastreo OSINT',
                    desc: 'Herramientas de reconocimiento facial y búsqueda inversa',
                    style: 'text-red-400',
                    descStyle: 'text-red-200/80',
                    border: 'border-red-500/50 bg-gradient-to-br from-gray-900 to-red-900/20'
                };
            case 'military':
                return {
                    icon: 'tank', // Using text representation if icon unavailable, or emoji
                    emoji: '🎖️',
                    title: 'Verificación de Equipamiento Militar',
                    desc: 'Para confirmar identificación, realiza búsqueda inversa obligatoria',
                    style: 'text-green-400',
                    descStyle: 'text-green-200/80',
                    border: 'border-green-600/50 bg-gradient-to-br from-gray-900 to-green-900/30'
                };
            default: // location
                return {
                    icon: '🔍',
                    emoji: '🔍',
                    title: 'Verificación por Reverse Image Search',
                    desc: 'Herramienta crítica para confirmar geolocalización',
                    style: 'text-yellow-500',
                    descStyle: 'text-yellow-200/80',
                    border: 'border-yellow-600/50 bg-gradient-to-br from-yellow-900/30 to-orange-900/30'
                };
        }
    };

    const header = getHeaderContent();

    return (
        <div className={`mt-6 p-6 rounded-xl border ${header.border} ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{header.emoji || header.icon}</span>
                <div>
                    <h3 className={`font-bold ${header.style}`}>
                        {header.title}
                    </h3>
                    <p className={`text-sm ${header.descStyle}`}>
                        {header.desc}
                    </p>
                </div>
            </div>

            {mode === 'people' && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-xs text-red-200">
                    <strong className="block mb-1 text-red-400">⚠️ ADVERTENCIA ÉTICA Y LEGAL:</strong>
                    El uso de herramientas de reconocimiento facial (como PimEyes) debe limitarse estrictamente a investigaciones legítimas y autorizadas.
                    El doxing y el acoso son ilegales. Respeta siempre el GDPR y las leyes de privacidad locales.
                </div>
            )}

            {mode === 'military' && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-xs text-green-200">
                    <strong className="block mb-1 text-green-400">⚠️ CRÍTICO: RIESGO DE FALSO POSITIVO</strong>
                    Vehículos de diferentes países (ej: Stryker vs Dragón vs Piranha) son casi idénticos visualmente.
                    NUNCA confirmes una identificación al 100% sin insignias claras o texto. Verifica siempre en foros especializados.
                </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-${mode === 'people' ? '4' : '3'} gap-4`}>
                {mode === 'people' && (
                    <button
                        onClick={() => handleServiceClick('pimeyes')}
                        className="group relative flex flex-col items-center p-4 bg-gray-900/80 hover:bg-orange-900/40 border border-orange-500/30 hover:border-orange-500 rounded-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                            ⚠️ RESTRICTED
                        </div>
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">👁️</span>
                        <span className="font-bold text-orange-400">PimEyes</span>
                        <span className="text-xs text-center text-gray-400 mt-1">Facial Rec. AI</span>
                    </button>
                )}

                <button
                    onClick={() => handleServiceClick('google')}
                    className="group relative flex flex-col items-center p-4 bg-gray-900/80 hover:bg-blue-900/40 border border-blue-500/30 hover:border-blue-500 rounded-xl transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                        #1 GENERAL
                    </div>
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📷</span>
                    <span className="font-bold text-blue-400">Google Lens</span>
                    <span className="text-xs text-center text-gray-400 mt-1">{mode === 'people' ? 'Social Media / Bios' : (mode === 'military' ? 'Familia Base' : 'Mejor base de datos')}</span>
                </button>

                <button
                    onClick={() => handleServiceClick('yandex')}
                    className="group relative flex flex-col items-center p-4 bg-gray-900/80 hover:bg-red-900/40 border border-red-500/30 hover:border-red-500 rounded-xl transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                        #2 PROFUNDO
                    </div>
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔴</span>
                    <span className="font-bold text-red-400">Yandex</span>
                    <span className="text-xs text-center text-gray-400 mt-1">{mode === 'people' ? 'VK / Faces / Europe' : (mode === 'military' ? 'Rusia / Europa Este' : 'Potente en Europa')}</span>
                </button>

                <button
                    onClick={() => handleServiceClick('tineye')}
                    className="group relative flex flex-col items-center p-4 bg-gray-900/80 hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-500 rounded-xl transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                        #3 FUENTE
                    </div>
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🟣</span>
                    <span className="font-bold text-purple-400">TinEye</span>
                    <span className="text-xs text-center text-gray-400 mt-1">Origen / Fechas</span>
                </button>
            </div>

            {mode === 'military' && (
                <div className="mt-4 pt-4 border-t border-green-600/20 text-xs text-green-200/60">
                    <strong className="block mb-1 text-green-500">FUENTES RECOMENDADAS:</strong>
                    Foros: Tankograd, Army Recognition, DefenseTalk. Base de datos: Jane's.
                </div>
            )}

            {mode === 'location' && (
                <div className="mt-4 pt-4 border-t border-yellow-600/20 text-xs text-yellow-200/60">
                    <strong className="block mb-1 text-yellow-500">METODOLOGÍA:</strong>
                    <ol className="list-decimal pl-4 space-y-1">
                        <li>Sube la imagen a Google Lens primero para identificar landmarks</li>
                        <li>Si no hay resultados claros, prueba Yandex (especialmente fuerte en arquitectura)</li>
                        <li>Usa TinEye para encontrar la versión más antigua de la imagen (fuente original)</li>
                    </ol>
                </div>
            )}
        </div>
    );
}
