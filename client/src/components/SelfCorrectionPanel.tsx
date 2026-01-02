/**
 * Self-Correction Panel Component
 * Link DeepSeek to ChatGPT for code review workflows
 * Design: Cyberpunk Minimalism - Luxury Terminal Aesthetic
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Unlink, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export interface CorrectionLink {
  id: string;
  sourceNodeId: string;
  sourceProvider: string;
  targetNodeId: string;
  targetProvider: string;
  correctionType: 'code-review' | 'fact-check' | 'optimization';
  status: 'pending' | 'completed' | 'error';
  feedback?: string;
  timestamp: number;
}

interface SelfCorrectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  availableNodes: Array<{
    id: string;
    provider: string;
    response: string;
  }>;
  onCreateLink: (link: Omit<CorrectionLink, 'id' | 'timestamp'>) => void;
  existingLinks: CorrectionLink[];
  onDeleteLink: (linkId: string) => void;
}

const CORRECTION_TYPES = [
  { value: 'code-review', label: 'Code Review', icon: '◆' },
  { value: 'fact-check', label: 'Fact Check', icon: '◇' },
  { value: 'optimization', label: 'Optimization', icon: '◈' },
] as const;

export function SelfCorrectionPanel({
  isOpen,
  onClose,
  availableNodes,
  onCreateLink,
  existingLinks,
  onDeleteLink,
}: SelfCorrectionPanelProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [correctionType, setCorrectionType] = useState<'code-review' | 'fact-check' | 'optimization'>('code-review');
  const [isCreating, setIsCreating] = useState(false);

  const sourceNode = availableNodes.find((n) => n.id === selectedSource);
  const targetNode = availableNodes.find((n) => n.id === selectedTarget);

  const handleCreateLink = async () => {
    if (!selectedSource || !selectedTarget) {
      toast.error('Select both source and target nodes');
      return;
    }

    if (selectedSource === selectedTarget) {
      toast.error('Source and target must be different nodes');
      return;
    }

    setIsCreating(true);

    try {
      onCreateLink({
        sourceNodeId: selectedSource,
        sourceProvider: sourceNode?.provider || '',
        targetNodeId: selectedTarget,
        targetProvider: targetNode?.provider || '',
        correctionType,
        status: 'pending',
      });

      toast.success('Correction link created');
      setSelectedSource(null);
      setSelectedTarget(null);
      setCorrectionType('code-review');
    } catch (error) {
      toast.error('Failed to create link');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-neon-cyan/30 bg-card/95 backdrop-blur-md max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-neon-cyan font-mono text-lg">
            SELF-CORRECTION SYSTEM
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-mono text-xs">
            Link responses for automated code review and fact-checking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Link Creation */}
          <div className="space-y-4 p-4 border border-neon-cyan/20 rounded-sm bg-black/30">
            <div className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
              Create Correction Link
            </div>

            {/* Source Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-foreground uppercase tracking-wider">
                Source Response
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedSource(node.id)}
                    className={`p-2 text-xs font-mono rounded-sm border transition-colors text-left ${
                      selectedSource === node.id
                        ? 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan'
                        : 'border-neon-cyan/20 text-muted-foreground hover:text-neon-cyan'
                    }`}
                  >
                    <div className="font-semibold">{node.provider.toUpperCase()}</div>
                    <div className="text-xs opacity-70 truncate">{node.response.substring(0, 30)}...</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Correction Type */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-foreground uppercase tracking-wider">
                Correction Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CORRECTION_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setCorrectionType(type.value)}
                    className={`p-2 text-xs font-mono rounded-sm border transition-colors ${
                      correctionType === type.value
                        ? 'border-neon-lime/50 bg-neon-lime/10 text-neon-lime'
                        : 'border-neon-cyan/20 text-muted-foreground hover:text-neon-cyan'
                    }`}
                  >
                    <div>{type.icon}</div>
                    <div>{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-foreground uppercase tracking-wider">
                Target Response (Reviewer)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableNodes.filter((n) => n.id !== selectedSource).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedTarget(node.id)}
                    className={`p-2 text-xs font-mono rounded-sm border transition-colors text-left ${
                      selectedTarget === node.id
                        ? 'border-neon-magenta/50 bg-neon-magenta/10 text-neon-magenta'
                        : 'border-neon-cyan/20 text-muted-foreground hover:text-neon-cyan'
                    }`}
                  >
                    <div className="font-semibold">{node.provider.toUpperCase()}</div>
                    <div className="text-xs opacity-70 truncate">{node.response.substring(0, 30)}...</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreateLink}
              disabled={isCreating || !selectedSource || !selectedTarget}
              className="w-full bg-neon-cyan text-black hover:bg-neon-cyan/90 font-mono text-xs uppercase tracking-wider disabled:opacity-50"
            >
              <Link2 size={14} className="mr-2" />
              Create Link
            </Button>
          </div>

          {/* Existing Links */}
          {existingLinks.length > 0 && (
            <div className="space-y-3 p-4 border border-neon-cyan/20 rounded-sm bg-black/30">
              <div className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
                Active Links ({existingLinks.length})
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {existingLinks.map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`p-3 rounded-sm border flex items-start justify-between gap-2 ${
                        link.status === 'completed'
                          ? 'border-neon-lime/30 bg-neon-lime/5'
                          : link.status === 'error'
                          ? 'border-destructive/30 bg-destructive/5'
                          : 'border-neon-cyan/30 bg-neon-cyan/5'
                      }`}
                    >
                      <div className="flex items-start gap-2 flex-1">
                        {link.status === 'completed' ? (
                          <CheckCircle size={14} className="text-neon-lime mt-0.5 flex-shrink-0" />
                        ) : link.status === 'error' ? (
                          <AlertCircle size={14} className="text-destructive mt-0.5 flex-shrink-0" />
                        ) : (
                          <Link2 size={14} className="text-neon-cyan mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-mono text-foreground">
                            {link.sourceProvider.toUpperCase()} → {link.targetProvider.toUpperCase()}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            {link.correctionType.replace('-', ' ').toUpperCase()}
                          </div>
                          {link.feedback && (
                            <div className="text-xs font-mono text-foreground/70 mt-1">
                              {link.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteLink(link.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <Unlink size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
