/**
 * Response Node Component
 * Individual node for displaying API responses on the canvas
 * Design: Cyberpunk Minimalism - Luxury Terminal Aesthetic
 */

import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Trash2, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ResponseNodeProps {
  data: {
    provider: string;
    prompt: string;
    response: string;
    status: 'loading' | 'success' | 'error';
    onDelete: () => void;
  };
}

export function ResponseNode({ data }: ResponseNodeProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(data.response);
    toast.success('Response copied to clipboard');
  };

  const statusColors = {
    loading: 'border-neon-cyan/50 bg-neon-cyan/5',
    success: 'border-neon-lime/50 bg-neon-lime/5',
    error: 'border-destructive/50 bg-destructive/5',
  };

  const statusIcons = {
    loading: <Loader2 size={14} className="animate-spin text-neon-cyan" />,
    success: <CheckCircle size={14} className="text-neon-lime" />,
    error: <AlertCircle size={14} className="text-destructive" />,
  };

  const statusLabels = {
    loading: 'PROCESSING',
    success: 'SUCCESS',
    error: 'ERROR',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={`w-80 rounded-sm border-2 ${statusColors[data.status]} backdrop-blur-md`}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            {statusIcons[data.status]}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
                {data.provider}
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                {statusLabels[data.status]}
              </div>
            </div>
          </div>
          <button
            onClick={data.onDelete}
            className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Prompt */}
        <div className="space-y-1">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Prompt
          </div>
          <div className="text-xs font-mono text-foreground/70 line-clamp-2 bg-black/30 p-2 rounded-sm border border-neon-cyan/10">
            {data.prompt}
          </div>
        </div>

        {/* Response */}
        <div className="space-y-1">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Response
          </div>
          <div className="text-xs font-mono text-foreground/70 line-clamp-4 bg-black/30 p-2 rounded-sm border border-neon-cyan/10 max-h-24 overflow-y-auto">
            {data.status === 'loading' ? (
              <span className="text-neon-cyan">Generating...</span>
            ) : data.status === 'error' ? (
              <span className="text-destructive">{data.response}</span>
            ) : (
              data.response
            )}
          </div>
        </div>

        {/* Actions */}
        {data.status === 'success' && (
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono text-neon-cyan border border-neon-cyan/30 rounded-sm hover:bg-neon-cyan/10 transition-colors"
          >
            <Copy size={12} />
            Copy Response
          </button>
        )}
      </div>
    </motion.div>
  );
}
