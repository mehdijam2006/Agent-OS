/**
 * Connection Vault Modal Component
 * Manages API key configuration for multiple AI providers
 * Design: Cyberpunk Minimalism - Luxury Terminal Aesthetic
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  validateAPIKey,
  SecureStorage,
  ModelProvider,
  ValidationResult,
} from '@/lib/apiValidation';

interface ConnectionVaultProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI (ChatGPT)', icon: '◆' },
  { value: 'gemini', label: 'Google Gemini', icon: '◇' },
  { value: 'deepseek', label: 'DeepSeek', icon: '◈' },
  { value: 'qwen', label: 'Alibaba Qwen', icon: '◊' },
] as const;

export function ConnectionVault({ isOpen, onClose }: ConnectionVaultProps) {
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [savedProviders, setSavedProviders] = useState<ModelProvider[]>(
    SecureStorage.getSavedProviders()
  );

  const handleValidateAndSave = async () => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await validateAPIKey(selectedProvider, apiKey);
      setValidationResult(result);

      if (result.success) {
        SecureStorage.saveKey(selectedProvider, apiKey);
        setSavedProviders(SecureStorage.getSavedProviders());
        setApiKey('');
        
        // Show success toast with neon animation
        toast.success(`${selectedProvider.toUpperCase()} connected`, {
          description: 'API key saved securely',
        });

        // Auto-close after success
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error('Validation failed', {
          description: result.message,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setValidationResult({
        success: false,
        message: errorMessage,
        provider: selectedProvider,
        timestamp: Date.now(),
      });
      toast.error('Connection error', {
        description: errorMessage,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveProvider = (provider: ModelProvider) => {
    SecureStorage.deleteKey(provider);
    setSavedProviders(SecureStorage.getSavedProviders());
    toast.success(`${provider.toUpperCase()} removed`);
  };

  const isSaved = SecureStorage.hasKey(selectedProvider);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-neon-cyan/30 bg-card/95 backdrop-blur-md max-w-md">
        <DialogHeader>
          <DialogTitle className="text-neon-cyan font-mono text-lg">
            CONNECTION VAULT
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-mono text-xs">
            Secure API key management for multi-model orchestration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-foreground uppercase tracking-wider">
              Select Model Provider
            </label>
            <Select value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as ModelProvider)}>
              <SelectTrigger className="border-neon-cyan/20 bg-input text-foreground font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-neon-cyan/20 bg-card">
                {PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value} className="font-mono">
                    <span className="text-neon-cyan">{provider.icon}</span>
                    {' '}
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-foreground uppercase tracking-wider">
              API Key
            </label>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder="sk-... or your-api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="border-neon-cyan/20 bg-input text-foreground font-mono pr-10 placeholder:text-muted-foreground/50"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neon-cyan transition-colors"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Validation Result */}
          <AnimatePresence>
            {validationResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-start gap-3 p-3 border rounded-sm font-mono text-xs ${
                  validationResult.success
                    ? 'border-nemon-lime/30 bg-neon-lime/5 text-neon-lime'
                    : 'border-destructive/30 bg-destructive/5 text-destructive'
                }`}
              >
                {validationResult.success ? (
                  <Check size={16} className="mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{validationResult.success ? 'Valid' : 'Invalid'}</p>
                  <p className="text-xs opacity-75">{validationResult.message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Validate & Save Button */}
          <Button
            onClick={handleValidateAndSave}
            disabled={isValidating || !apiKey.trim()}
            className="w-full bg-neon-cyan text-black hover:bg-neon-cyan/90 font-mono text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {isValidating ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Validate & Save
              </>
            )}
          </Button>

          {/* Saved Providers List */}
          {savedProviders.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-neon-cyan/10">
              <label className="text-xs font-mono text-foreground uppercase tracking-wider">
                Saved Connections
              </label>
              <div className="space-y-2">
                {savedProviders.map((provider) => {
                  const providerInfo = PROVIDERS.find((p) => p.value === provider);
                  return (
                    <motion.div
                      key={provider}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center justify-between p-2 bg-neon-lime/5 border border-neon-lime/20 rounded-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-neon-lime rounded-full" />
                        <span className="text-xs font-mono text-neon-lime">
                          {providerInfo?.label}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveProvider(provider)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
