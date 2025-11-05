import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

interface InteractiveCanvasProps {
  width?: number;
  height?: number;
  onDraw: (ctx: CanvasRenderingContext2D, state: any) => void;
  onInteraction?: (point: Point, type: 'click' | 'drag' | 'move', state: any) => any;
  initialState?: any;
  controls?: React.ReactNode;
  className?: string;
}

const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  width = 600,
  height = 400,
  onDraw,
  onInteraction,
  initialState = {},
  controls,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState(initialState);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });

  // Get mouse position relative to canvas
  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDragging(true);
    setMousePos(pos);

    if (onInteraction) {
      const newState = onInteraction(pos, 'click', state);
      if (newState) setState(newState);
    }
  }, [getMousePos, onInteraction, state]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setMousePos(pos);

    if (onInteraction) {
      const type = isDragging ? 'drag' : 'move';
      const newState = onInteraction(pos, type, state);
      if (newState) setState(newState);
    }
  }, [getMousePos, isDragging, onInteraction, state]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Call custom draw function
    onDraw(ctx, state);
  }, [state, width, height, onDraw]);

  // Update state externally
  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair"
          style={{ display: 'block' }}
        />
      </motion.div>

      {controls && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-4"
        >
          {controls}
        </motion.div>
      )}

      {/* Debug info (can be removed in production) */}
      <div className="text-xs text-gray-500">
        Mouse: ({Math.round(mousePos.x)}, {Math.round(mousePos.y)})
        {isDragging && ' - Dragging'}
      </div>
    </div>
  );
};

export default InteractiveCanvas;
