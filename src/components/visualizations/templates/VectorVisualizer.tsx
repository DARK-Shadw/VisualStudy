import React, { useState } from 'react';
import InteractiveCanvas from '../InteractiveCanvas';

interface Vector {
  x: number;
  y: number;
  color: string;
  label: string;
}

interface VectorVisualizerProps {
  initialVectors?: Vector[];
  showGrid?: boolean;
  showResultant?: boolean;
  allowDrag?: boolean;
}

const VectorVisualizer: React.FC<VectorVisualizerProps> = ({
  initialVectors = [
    { x: 100, y: -80, color: '#4338ca', label: 'A' },
    { x: 80, y: 60, color: '#06b6d4', label: 'B' },
  ],
  showGrid = true,
  showResultant = true,
  allowDrag = true,
}) => {
  const [vectors, setVectors] = useState(initialVectors);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw function
  const onDraw = (ctx: CanvasRenderingContext2D, _state: any) => {
    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x <= width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw vectors
    vectors.forEach((vector) => {
      drawVector(ctx, centerX, centerY, vector.x, vector.y, vector.color, vector.label);
    });

    // Draw resultant vector
    if (showResultant && vectors.length > 1) {
      const resultant = vectors.reduce(
        (acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }),
        { x: 0, y: 0 }
      );
      drawVector(ctx, centerX, centerY, resultant.x, resultant.y, '#10b981', 'R', true);
    }
  };

  // Draw a single vector
  const drawVector = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    dx: number,
    dy: number,
    color: string,
    label: string,
    dashed: boolean = false
  ) => {
    const endX = startX + dx;
    const endY = startY + dy;

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    if (dashed) {
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(dy, dx);
    const arrowSize = 12;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowSize * Math.cos(angle - Math.PI / 6),
      endY - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - arrowSize * Math.cos(angle + Math.PI / 6),
      endY - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    // Draw label
    ctx.fillStyle = color;
    ctx.font = 'bold 16px Arial';
    ctx.fillText(label, endX + 10, endY - 10);

    // Draw magnitude
    const magnitude = Math.sqrt(dx * dx + dy * dy).toFixed(1);
    ctx.font = '12px Arial';
    ctx.fillText(`|${label}| = ${magnitude}`, endX + 10, endY + 10);

    ctx.setLineDash([]);
  };

  // Handle interaction
  const onInteraction = (point: any, type: string, state: any) => {
    if (!allowDrag) return state;

    const relX = point.x - centerX;
    const relY = point.y - centerY;

    if (type === 'click') {
      // Check if clicked near a vector endpoint
      const clickedIndex = vectors.findIndex((v) => {
        const endX = centerX + v.x;
        const endY = centerY + v.y;
        const distance = Math.sqrt((point.x - endX) ** 2 + (point.y - endY) ** 2);
        return distance < 20;
      });

      if (clickedIndex !== -1) {
        setDraggingIndex(clickedIndex);
      }
    } else if (type === 'drag' && draggingIndex !== null) {
      // Update vector position
      const newVectors = [...vectors];
      newVectors[draggingIndex] = {
        ...newVectors[draggingIndex],
        x: relX,
        y: relY,
      };
      setVectors(newVectors);
    }

    return state;
  };

  // Handle mouse up
  React.useEffect(() => {
    const handleMouseUp = () => setDraggingIndex(null);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Controls
  const controls = (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-700 mb-2">
        {allowDrag ? '🖱️ Drag vector endpoints to explore' : '👁️ Observe the vectors'}
      </div>

      {vectors.map((vector, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium" style={{ color: vector.color }}>
              Vector {vector.label}
            </span>
            <span className="text-sm text-gray-600">
              ({vector.x.toFixed(0)}, {vector.y.toFixed(0)})
            </span>
          </div>

          <div>
            <label className="text-xs text-gray-500">X: {vector.x.toFixed(0)}</label>
            <input
              type="range"
              min="-200"
              max="200"
              value={vector.x}
              onChange={(e) => {
                const newVectors = [...vectors];
                newVectors[index].x = Number(e.target.value);
                setVectors(newVectors);
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Y: {vector.y.toFixed(0)}</label>
            <input
              type="range"
              min="-150"
              max="150"
              value={vector.y}
              onChange={(e) => {
                const newVectors = [...vectors];
                newVectors[index].y = Number(e.target.value);
                setVectors(newVectors);
              }}
              className="w-full"
            />
          </div>
        </div>
      ))}

      {showResultant && vectors.length > 1 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="font-medium text-green-600 mb-2">Resultant Vector R</div>
          <div className="text-sm text-gray-600">
            R = ({vectors.reduce((sum, v) => sum + v.x, 0).toFixed(0)}, {vectors.reduce((sum, v) => sum + v.y, 0).toFixed(0)})
          </div>
          <div className="text-sm text-gray-600">
            |R| = {Math.sqrt(
              vectors.reduce((sum, v) => sum + v.x, 0) ** 2 +
              vectors.reduce((sum, v) => sum + v.y, 0) ** 2
            ).toFixed(1)}
          </div>
        </div>
      )}

      <button
        onClick={() => setVectors(initialVectors)}
        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        Reset Vectors
      </button>
    </div>
  );

  return (
    <InteractiveCanvas
      width={width}
      height={height}
      onDraw={onDraw}
      onInteraction={onInteraction}
      initialState={{}}
      controls={controls}
    />
  );
};

export default VectorVisualizer;
