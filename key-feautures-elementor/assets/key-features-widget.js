
let lineCtx;
let arc1Info; // Deklariert arc1Info im globalen Scope
let arc2Info; // Deklariert arc2Info im globalen Scope

// Definieren Sie Konstanten f�r die Farbe und Dicke der Linien und B�gen
const LINE_COLOR = 'red'; // Beispiel f�r eine einheitliche Farbe
const LINE_WIDTH = 4; // Beispiel f�r eine einheitliche Dicke

window.onload = function () {
    const container = document.querySelector('.key_features_container');
    const lineCanvas = document.getElementById('lineCanvas');
    lineCtx = lineCanvas.getContext('2d');
    lineCanvas.width = container.offsetWidth;

    // Berechnen Sie die H�he von lineCanvas dynamisch
    adjustCanvasHeight();

    const img1 = document.querySelector('.pic1');
    const canvas1 = document.getElementById('canvas1');
    const ctx1 = canvas1.getContext('2d');
    arc1Info = drawArcAroundImage(img1, canvas1, ctx1, false);

    const img2 = document.querySelector('.pic2');
    const canvas2 = document.createElement('canvas');
    img2.parentNode.insertBefore(canvas2, img2.nextSibling);
    const ctx2 = canvas2.getContext('2d');
    arc2Info = drawArcAroundImage(img2, canvas2, ctx2, true);

    adjustOffsetsAndRedraw();

    window.addEventListener('resize', function () {
        adjustCanvasHeight();
        adjustOffsetsAndRedraw();
    });
};

function adjustCanvasHeight() {
    const container = document.querySelector('.container');
    const lineCanvas = document.getElementById('lineCanvas');
    const lineWidth = LINE_WIDTH; // Die Linienbreite, die bereits im Code verwendet wird
    const offsetForSecondLine = 141; // Offset nach oben f�r die zweite Linie

    // Stellen Sie sicher, dass die H�he von lineCanvas ausreichend ist
    lineCanvas.height = container.offsetHeight + (lineWidth * 3) + offsetForSecondLine;
    lineCanvas.style.position = 'absolute';
    lineCanvas.style.left = '0px';
    lineCanvas.style.top = '-3px';
    lineCanvas.style.zIndex = -1;
}

function drawArcAroundImage(img, canvas, ctx, isRightSide) {
    const padding = 20;
    const lineThickness = 2;
    const extraSpaceForArc = isRightSide ? padding * 2 : 0;
    const canvasWidth = img.offsetWidth + (padding * 2) + (lineThickness * 2) + extraSpaceForArc + lineThickness * 2;
    const canvasHeight = img.offsetHeight + (padding * 2) + (lineThickness * 3);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    canvas.style.position = 'absolute';
    canvas.style.left = (img.offsetLeft - padding - lineThickness - (isRightSide ? 0 : lineThickness * 2)) + 'px';
    canvas.style.top = (img.offsetTop - padding - lineThickness - 1) + 'px';

    ctx.beginPath();
    const radius = (img.offsetWidth / 2) + padding + (lineThickness / 2);
    let arcX, arcY;
    if (isRightSide) {
        arcX = canvasWidth - (img.offsetWidth / 2) - padding - (lineThickness / 2) - extraSpaceForArc;
        arcY = canvasHeight / 2;
        ctx.arc(arcX, arcY, radius, -Math.PI / 2, Math.PI / 2, false);
    } else {
        arcX = (img.offsetWidth / 2) + padding + (lineThickness / 2) + lineThickness;
        arcY = canvasHeight / 2;
        ctx.arc(arcX, arcY, radius, 3 * Math.PI / 2, Math.PI / 2, true);
    }
    ctx.strokeStyle = LINE_COLOR; // Verwenden Sie die definierte Farbkonstante
    ctx.lineWidth = LINE_WIDTH; // Verwenden Sie die definierte Dickenkonstante
    ctx.stroke();

    // Berechnung der Anfangs- und Endpunkte
    let startPoint, endPoint;
    if (isRightSide) {
        startPoint = { x: arcX, y: arcY - radius }; // Anfangspunkt oben
        endPoint = { x: arcX, y: arcY + radius }; // Endpunkt unten
    } else {
        startPoint = { x: arcX, y: arcY + radius }; // Anfangspunkt unten
        endPoint = { x: arcX, y: arcY - radius }; // Endpunkt oben
    }

    // R�ckgabe der Anfangs- und Endpunkte
    return {
        startPoint: startPoint,
        endPoint: endPoint
    };
}

function drawLineBetweenArcs(ctx, endPointOfArc1, startPointOfArc2, startOffsetX, startOffsetY, endOffsetX, endOffsetY) {
    ctx.beginPath();
    ctx.moveTo(endPointOfArc1.x + startOffsetX, endPointOfArc1.y + startOffsetY);
    ctx.lineTo(startPointOfArc2.x + endOffsetX, startPointOfArc2.y + endOffsetY);
    ctx.strokeStyle = LINE_COLOR; // Verwenden Sie die definierte Farbkonstante
    ctx.lineWidth = LINE_WIDTH; // Stellen Sie sicher, dass diese Zeile vorhanden ist
    ctx.stroke();
}

function drawLineFromArcStart(ctx, startPointOfArc1, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startPointOfArc1.x, startPointOfArc1.y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = LINE_COLOR; // Verwenden Sie die definierte Farbkonstante
    ctx.lineWidth = LINE_WIDTH; // Stellen Sie sicher, dass diese Zeile vorhanden ist
    ctx.stroke();
}
function getFeatureEdgesRelativeToContainer(featureElement) {
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const featureRect = featureElement.getBoundingClientRect();

    // Berechnet den Abstand von der linken Kante des .feature-Elements zur linken Kante des Containers
    const leftEdgeRelativeToContainer = featureRect.left - containerRect.left;

    // Berechnet den Abstand von der rechten Kante des .feature-Elements zur linken Kante des Containers
    const rightEdgeRelativeToContainer = featureRect.right - containerRect.left;

    return {
        leftEdge: leftEdgeRelativeToContainer,
        rightEdge: rightEdgeRelativeToContainer
    };
}

function adjustOffsetsAndRedraw() {
    const container = document.querySelector('.container');
    const lineCanvas = document.getElementById('lineCanvas');
    if (container.offsetWidth >= 514) {
        return;
    } else {
        const firstFeature = document.querySelector('.feature');
        const edges = getFeatureEdgesRelativeToContainer(firstFeature);

        // Basis-Offsets f�r die Start- und Endpunkte
        const baseStartOffsetX = edges.leftEdge + 52;
        const baseEndOffsetX = edges.rightEdge - 52;

        const baseStartOffsetY = 144;
        const baseEndOffsetY = 144;

        lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);

        // Berechnung der Offsets f�r die zweite Linie (topLine)
        const offsetForSecondLineY = 142; // Vertikaler Offset nach oben f�r die zweite Linie
        const endOffsetXForSecondLine = 55; // Zus�tzlicher horizontaler Offset nach rechts f�r den Endpunkt der zweiten Linie
        const offsetForBottomLineY = 142; // Beispielwert f�r den vertikalen Offset
        const offsetFromLeftEdge = -40; // 10 Pixel rechts von edges.leftEdge

        // Zeichnen der ersten Linie (lineBetweenArcs) ohne �nderung der L�nge
        let lineBetweenArcs = drawLine(lineCtx, { x: baseStartOffsetX, y: baseStartOffsetY }, { x: baseEndOffsetX, y: baseEndOffsetY }, "lineBetweenArcs");
        // Zeichnen der zweiten Linie (topLine) mit angepassten Offsets
        let topLine = drawLine(lineCtx, { x: baseStartOffsetX, y: baseStartOffsetY - offsetForSecondLineY }, { x: baseEndOffsetX + endOffsetXForSecondLine, y: baseEndOffsetY - offsetForSecondLineY }, "topLine");
        // Zeichnen der neuen Linie (bottomLine) mit dem Offset nach unten und vom edges.leftEdge
        let bottomLine = drawLine(lineCtx, { x: edges.leftEdge + offsetFromLeftEdge, y: baseStartOffsetY + offsetForBottomLineY }, { x: baseEndOffsetX, y: baseEndOffsetY + offsetForBottomLineY }, "bottomLine");


    }
}

function drawLine(ctx, startPoint, endPoint, lineName) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = LINE_COLOR; // Verwenden Sie die globale Farbkonstante
    ctx.lineWidth = LINE_WIDTH; // Verwenden Sie die globale Dickenkonstante
    ctx.stroke();
    // R�ckgabe der Linieninformationen als Objekt
    return {
        name: lineName,
        startPoint: startPoint,
        endPoint: endPoint
    };
}