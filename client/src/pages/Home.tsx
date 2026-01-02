/**
 * Home Page - Personal Agentic OS
 * Multi-model orchestration with API management
 * Design: Cyberpunk Minimalism - Luxury Terminal Aesthetic
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Send, Zap, Menu, X, History, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConnectionVault } from '@/components/ConnectionVault';
import { SemanticTimeline } from '@/components/SemanticTimeline';
import { SelfCorrectionPanel } from '@/components/SelfCorrectionPanel';
import { InfiniteCanvas } from '@/components/InfiniteCanvas';
import { SecureStorage, ModelProvider } from '@/lib/apiValidation';
import { useOrchestrator } from '@/contexts/OrchestratorContext';
import { toast } from 'sonner';

export default function Home() {
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<ModelProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<any>(null);

  const {
    responses,
    addResponse,
    removeResponse,
    clearResponses,
    timeline,
    addTimelineEntry,
    removeTimelineEntry,
    correctionLinks,
    addCorrectionLink,
    removeCorrectionLink,
    sendPromptToMultipleModels,
  } = useOrchestrator();

  const savedProviders = SecureStorage.getSavedProviders();

  const handleProviderToggle = (provider: ModelProvider) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Prompt cannot be empty');
      return;
    }

    if (selectedProviders.length === 0) {
      toast.error('Select at least one provider');
      return;
    }

    setIsLoading(true);

    try {
      await sendPromptToMultipleModels(prompt, selectedProviders);
      toast.success(`Sent to ${selectedProviders.length} model${selectedProviders.length !== 1 ? 's' : ''}`);
      setPrompt('');
      setSelectedProviders([]);
    } catch (error) {
      toast.error('Failed to send prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTimelineEntry = (entry: any) => {
    setPrompt(entry.prompt);
    setSelectedProviders(entry.providers);
  };

  const handleCreateCorrectionLink = (link: any) => {
    addCorrectionLink({
      ...link,
      status: 'pending',
    });
  };

  return (
    <div className="w-full h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-neon-cyan/10 bg-card/50 backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center border border-neon-cyan/50 rounded-sm">
            <Zap size={16} className="text-neon-cyan" />
          </div>
          <div>
            <h1 className="text-sm font-mono text-neon-cyan uppercase tracking-wider">
              AGENTIC OS
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Multi-Model Orchestration Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 font-mono text-xs"
            onClick={() => setIsTimelineOpen(true)}
          >
            <History size={14} className="mr-1" />
            Timeline
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 font-mono text-xs"
            onClick={() => setIsCorrectionOpen(true)}
          >
            <Link2 size={14} className="mr-1" />
            Correct
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 font-mono text-xs"
            onClick={() => setIsGhostMode(!isGhostMode)}
          >
            {isGhostMode ? <Menu size={14} /> : <X size={14} />}
            {isGhostMode ? 'Show' : 'Hide'} Sidebar
          </Button>

          <Button
            size="sm"
            className="bg-neon-cyan text-black hover:bg-neon-cyan/90 font-mono text-xs"
            onClick={() => setIsVaultOpen(true)}
          >
            <Settings size={14} className="mr-1" />
            Vault
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isGhostMode ? 0.3 : 1, x: 0 }}
          className={`w-80 flex flex-col gap-4 transition-opacity ${isGhostMode ? 'pointer-events-none' : ''}`}
        >
          {/* Connection Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-4 rounded-sm border border-neon-cyan/20 space-y-3"
          >
            <div className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
              Connected Models
            </div>
            {savedProviders.length === 0 ? (
              <div className="text-xs text-muted-foreground font-mono">
                No models connected. Open the Connection Vault to add API keys.
              </div>
            ) : (
              <div className="space-y-2">
                {savedProviders.map((provider) => (
                  <motion.div
                    key={provider}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 bg-neon-lime/5 border border-neon-lime/20 rounded-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-neon-lime rounded-full animate-pulse" />
                      <span className="text-xs font-mono text-neon-lime uppercase">
                        {provider}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Model Selection */}
          {savedProviders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-4 rounded-sm border border-neon-cyan/20 space-y-3"
            >
              <div className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
                Select Models for Query
              </div>
              <div className="space-y-2">
                {savedProviders.map((provider) => (
                  <label
                    key={provider}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-neon-cyan/5 rounded-sm transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProviders.includes(provider)}
                      onChange={() => handleProviderToggle(provider)}
                      className="w-4 h-4 border border-neon-cyan/30 rounded-sm bg-input accent-neon-cyan"
                    />
                    <span className="text-xs font-mono text-foreground uppercase">
                      {provider}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Prompt Input */}
          {savedProviders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-4 rounded-sm border border-neon-cyan/20 space-y-3 flex-1 flex flex-col"
            >
              <div className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
                Prompt
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="flex-1 bg-input border border-neon-cyan/20 rounded-sm p-3 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-neon-cyan"
              />
              <Button
                onClick={handleSendPrompt}
                disabled={isLoading || selectedProviders.length === 0 || !prompt.trim()}
                className="w-full bg-neon-cyan text-black hover:bg-neon-cyan/90 font-mono text-xs uppercase tracking-wider disabled:opacity-50"
              >
                <Send size={14} className="mr-2" />
                {isLoading ? 'Sending...' : 'Send to Canvas'}
              </Button>
            </motion.div>
          )}
        </motion.aside>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 rounded-sm border border-neon-cyan/10 overflow-hidden bg-black"
        >
          <InfiniteCanvas />
        </motion.div>
      </div>

      {/* Modals */}
      <ConnectionVault isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />
      
      <SemanticTimeline
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        entries={timeline}
        onSelectEntry={handleSelectTimelineEntry}
        onDeleteEntry={removeTimelineEntry}
      />

      <SelfCorrectionPanel
        isOpen={isCorrectionOpen}
        onClose={() => setIsCorrectionOpen(false)}
        availableNodes={responses.map((r) => ({
          id: r.id,
          provider: r.provider,
          response: r.response,
        }))}
        onCreateLink={handleCreateCorrectionLink}
        existingLinks={correctionLinks}
        onDeleteLink={removeCorrectionLink}
      />
    </div>
  );
}
