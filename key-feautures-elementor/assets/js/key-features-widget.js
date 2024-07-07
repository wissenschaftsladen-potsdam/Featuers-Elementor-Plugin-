// Globale Definition von baseRadius, damit er leicht angepasst werden kann
let baseRadius = 50; // Beispielwert, kann angepasst werden

const observerCallback = (mutationsList, observer) => {
    const container = document.querySelector('.key_features_container');
    if (container) {
        console.log('Container gefunden.');
        observer.disconnect(); // Stoppen Sie den Beobachter, da der Container gefunden wurde

        // Erstellen Sie ein Array von Promises für jedes Bild im Container
        const imageLoadPromises = Array.from(container.querySelectorAll('img')).map(img => {
            return new Promise((resolve, reject) => {
                if (img.complete && img.naturalHeight !== 0) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'));
                }
            });
        });

        // Warten Sie, bis alle Bilder geladen sind
        Promise.all(imageLoadPromises).then(() => {
            initializeWidget(container); // Führen Sie die Initialisierung Ihres Widgets hier aus
        }).catch(error => {
            console.error('Fehler beim Laden der Bilder:', error);
        });
    }
};

// Erstellen eines neuen MutationObserver
const observer = new MutationObserver(observerCallback);

// Konfiguration des Observers: Beobachten Sie die Hinzufügung von Kinderelementen
const config = { childList: true, subtree: true };

// Starten der Beobachtung des `body`-Elements (oder eines anderen geeigneten Elements)
observer.observe(document.body, config);

function initializeWidget(container) {
    const LINE_COLOR = 'red';
    const LINE_WIDTH = 2;

    // Selektieren aller Canvas-Elemente innerhalb des Containers mit der Klasse 'feature-line-canvas'
    const lineCanvases = container.querySelectorAll('.feature-line-canvas');

    lineCanvases.forEach((lineCanvas, index) => {
        const feature = container.querySelectorAll('.feature')[index];
        const img = feature.querySelector('img');
        // Stellen Sie sicher, dass das Canvas-Element existiert
        if (lineCanvas) {
            lineCanvas.width = feature.offsetWidth;
            const lineCtx = lineCanvas.getContext('2d');

            // Verwenden Sie das vorhandene .feature-line-canvas Element für Zeichnungen
            if (img) {
                const canvas = lineCanvas; // Verwenden Sie das vorhandene .feature-line-canvas Element
                const ctx = canvas.getContext('2d');
                const isRightSide = index % 2 !== 0;
                drawArcAroundImage(img, canvas, ctx, isRightSide, index);
            }
        } else {
            console.error('Ein Canvas-Element wurde nicht im DOM gefunden.');
        }
    });
}

function adjustCanvasWidth() {
    // Auswahl aller .feature-line-canvas Elemente
    const canvases = document.querySelectorAll('.feature-line-canvas');

    canvases.forEach(canvas => {
        // Das Elternelement .feature für den aktuellen Canvas
        const featureElement = canvas.closest('.feature');
        if (featureElement) {
            // Erhöhen der Canvas-Breite um 20px zusätzlich zur Breite des .feature-Elements
            const newWidth = featureElement.offsetWidth + 20;
            canvas.style.width = newWidth + 'px';
            canvas.width = newWidth;
        }
    });
}

// Anpassung der Canvas-Breite beim Laden der Seite
document.addEventListener('DOMContentLoaded', adjustCanvasWidth);

// Anpassung der Canvas-Breite bei Größenänderung des Fensters
window.addEventListener('resize', adjustCanvasWidth);

function calculateMarginFromRadius(radius) {
    const baseMargin = radius * -0.2; // Beispiel einer proportionalen Beziehung
    return baseMargin;
}

function drawArcAroundImage(img, canvas, ctx, isRightSide, index) {
    const padding = 20;
    const lineThickness = 2;
    // Die Breite des Canvas bleibt gleich, da sie die Breite des feature Elements abdeckt
    const canvasWidth = img.parentElement.offsetWidth;
    const canvasHeight = img.offsetHeight + (padding * 2) + (lineThickness * 2);

    // Der dynamische Radius basiert weiterhin auf der Größe des Bildes
    const dynamicRadius = Math.min(img.offsetWidth, img.offsetHeight) / 2;    

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    canvas.style.position = 'absolute';
    // Zentrieren des Canvas über dem feature Element statt über dem Bild
    canvas.style.left = (img.parentElement.offsetLeft - padding) + 'px';
    canvas.style.top = (img.offsetTop - padding - lineThickness) + 'px';

    ctx.beginPath();
    const arcX = img.offsetLeft - canvas.offsetLeft + img.offsetWidth / 2; // Bogen zentriert über dem Bild
    const arcY = canvasHeight / 2;
    const startAngle = isRightSide ? -Math.PI / 2 : Math.PI / 2;
    const endAngle = isRightSide ? Math.PI / 2 : 3 * Math.PI / 2;

    ctx.arc(arcX, arcY, dynamicRadius, startAngle, endAngle, false);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = lineThickness;
    ctx.stroke();

    // Zeichnen einer Linie für das erste feature Element, die von der Mitte des Bildes startet
    if (index === 0) {
        ctx.beginPath();
        // Startpunkt der Linie ist die Mitte des Bildes auf der linken Seite
        const lineStartX = arcX;
        // Verschieben der Linie um den Radius nach oben
        const lineStartY = arcY - dynamicRadius;
        // Endpunkt der Linie ist der rechte Rand des feature Elements
        const lineEndX = canvasWidth - padding - lineThickness; // Bis zum rechten Rand des feature Elements
        ctx.moveTo(lineStartX, lineStartY);
        ctx.lineTo(lineEndX, lineStartY);
        ctx.stroke();
    }
}



