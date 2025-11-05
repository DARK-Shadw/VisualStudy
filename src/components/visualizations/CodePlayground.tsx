import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Code } from 'lucide-react';

interface CodePlaygroundProps {
  starterCode: string;
  onExecute?: (code: string, output: string) => void;
  enableVisualization?: boolean;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  starterCode,
  onExecute,
  enableVisualization = true,
}) => {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pyodideRef = useRef<any>(null);

  // Load Pyodide (Python in browser)
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        // @ts-ignore
        if (window.loadPyodide) {
          // @ts-ignore
          pyodideRef.current = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
          });
          setOutput('Ready! Click Run to execute code.');
        } else {
          setOutput('Loading Python environment...');
          // Dynamically load Pyodide
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
          script.onload = async () => {
            // @ts-ignore
            pyodideRef.current = await window.loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
            });
            setOutput('Ready! Click Run to execute code.');
          };
          document.body.appendChild(script);
        }
      } catch (err) {
        console.error('Failed to load Pyodide:', err);
        setError('Failed to load Python environment');
      }
    };

    loadPyodide();
  }, []);

  const executeCode = async () => {
    if (!pyodideRef.current) {
      setOutput('Python environment not ready yet...');
      return;
    }

    setIsRunning(true);
    setError('');
    setOutput('Running...');

    try {
      // Capture stdout
      await pyodideRef.current.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);

      // Run user code
      await pyodideRef.current.runPythonAsync(code);

      // Get output
      const stdout = await pyodideRef.current.runPythonAsync('sys.stdout.getvalue()');
      setOutput(stdout || 'Code executed successfully (no output)');

      if (onExecute) {
        onExecute(code, stdout);
      }

      // If visualization enabled, try to render to canvas
      if (enableVisualization && canvasRef.current) {
        // Placeholder for visualization logic
        // This would be enhanced to capture matplotlib/plotly output
      }
    } catch (err: any) {
      setError(err.message || 'Error executing code');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(starterCode);
    setOutput('Code reset');
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2 text-gray-300">
          <Code className="w-5 h-5" />
          <span className="font-semibold">Python Playground</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors flex items-center gap-1 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={executeCode}
            disabled={isRunning}
            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Run
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 px-4 py-3 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          spellCheck={false}
          style={{
            tabSize: 4,
            lineHeight: '1.5',
          }}
        />
        <div className="absolute top-2 right-2 text-xs text-gray-500">
          Python 3.11
        </div>
      </div>

      {/* Output */}
      <div className="border-t border-gray-700">
        <div className="px-4 py-2 bg-gray-800 text-sm font-semibold text-gray-300">
          Output:
        </div>
        <div className="px-4 py-3 bg-gray-950 text-gray-300 font-mono text-sm min-h-[100px] max-h-[200px] overflow-auto">
          {error ? (
            <div className="text-red-400">{error}</div>
          ) : output ? (
            <pre className="whitespace-pre-wrap">{output}</pre>
          ) : (
            <div className="text-gray-500 italic">No output yet</div>
          )}
        </div>
      </div>

      {/* Canvas for visualizations */}
      {enableVisualization && (
        <div className="border-t border-gray-700 p-4 bg-gray-900">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full bg-white rounded"
          />
        </div>
      )}
    </motion.div>
  );
};

export default CodePlayground;
