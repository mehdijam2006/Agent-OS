/**
 * Orchestrator Context
 * Manages multi-model API orchestration and response management
 * Design: Cyberpunk Minimalism - Luxury Terminal Aesthetic
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ModelProvider, SecureStorage } from '@/lib/apiValidation';
import { nanoid } from 'nanoid';

export interface CanvasResponse {
  id: string;
  provider: ModelProvider;
  prompt: string;
  response: string;
  timestamp: number;
  status: 'loading' | 'success' | 'error';
}

export interface TimelineEntry {
  id: string;
  prompt: string;
  providers: ModelProvider[];
  timestamp: number;
  tags: string[];
  responses: CanvasResponse[];
}

export interface CorrectionLink {
  id: string;
  sourceNodeId: string;
  sourceProvider: ModelProvider;
  targetNodeId: string;
  targetProvider: ModelProvider;
  correctionType: 'code-review' | 'fact-check' | 'optimization';
  status: 'pending' | 'completed' | 'error';
  feedback?: string;
  timestamp: number;
}

interface OrchestratorContextType {
  // Canvas responses
  responses: CanvasResponse[];
  addResponse: (response: Omit<CanvasResponse, 'id' | 'timestamp'>) => void;
  updateResponse: (id: string, updates: Partial<CanvasResponse>) => void;
  removeResponse: (id: string) => void;
  clearResponses: () => void;

  // Timeline
  timeline: TimelineEntry[];
  addTimelineEntry: (entry: Omit<TimelineEntry, 'id' | 'timestamp'>) => void;
  removeTimelineEntry: (id: string) => void;

  // Self-correction
  correctionLinks: CorrectionLink[];
  addCorrectionLink: (link: Omit<CorrectionLink, 'id' | 'timestamp'>) => void;
  removeCorrectionLink: (id: string) => void;
  updateCorrectionLink: (id: string, updates: Partial<CorrectionLink>) => void;

  // Multi-model orchestration
  sendPromptToMultipleModels: (
    prompt: string,
    providers: ModelProvider[]
  ) => Promise<void>;
}

const OrchestratorContext = createContext<OrchestratorContextType | undefined>(undefined);

export function OrchestratorProvider({ children }: { children: React.ReactNode }) {
  const [responses, setResponses] = useState<CanvasResponse[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [correctionLinks, setCorrectionLinks] = useState<CorrectionLink[]>([]);

  const addResponse = useCallback((response: Omit<CanvasResponse, 'id' | 'timestamp'>) => {
    const newResponse: CanvasResponse = {
      ...response,
      id: nanoid(),
      timestamp: Date.now(),
    };
    setResponses((prev) => [...prev, newResponse]);
  }, []);

  const updateResponse = useCallback((id: string, updates: Partial<CanvasResponse>) => {
    setResponses((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const removeResponse = useCallback((id: string) => {
    setResponses((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearResponses = useCallback(() => {
    setResponses([]);
  }, []);

  const addTimelineEntry = useCallback(
    (entry: Omit<TimelineEntry, 'id' | 'timestamp'>) => {
      const newEntry: TimelineEntry = {
        ...entry,
        id: nanoid(),
        timestamp: Date.now(),
      };
      setTimeline((prev) => [newEntry, ...prev]);
    },
    []
  );

  const removeTimelineEntry = useCallback((id: string) => {
    setTimeline((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addCorrectionLink = useCallback(
    (link: Omit<CorrectionLink, 'id' | 'timestamp'>) => {
      const newLink: CorrectionLink = {
        ...link,
        id: nanoid(),
        timestamp: Date.now(),
      };
      setCorrectionLinks((prev) => [...prev, newLink]);
    },
    []
  );

  const removeCorrectionLink = useCallback((id: string) => {
    setCorrectionLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateCorrectionLink = useCallback(
    (id: string, updates: Partial<CorrectionLink>) => {
      setCorrectionLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
      );
    },
    []
  );

  const sendPromptToMultipleModels = useCallback(
    async (prompt: string, providers: ModelProvider[]) => {
      // Add loading responses for each provider
      providers.forEach((provider) => {
        addResponse({
          provider,
          prompt,
          response: '',
          status: 'loading',
        });
      });

      // Simulate API calls (in production, these would be real API calls)
      for (const provider of providers) {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

          // Mock response based on provider
          const mockResponses: Record<ModelProvider, string> = {
            openai: 'This is a response from OpenAI. I can help you with various tasks including coding, analysis, and creative writing.',
            gemini: 'Response from Google Gemini. I can assist with information retrieval, analysis, and problem-solving tasks.',
            deepseek: 'DeepSeek response: I specialize in deep reasoning and complex problem analysis.',
            qwen: 'Qwen response: I can help with multilingual tasks and comprehensive analysis.',
          };

          const responseText = mockResponses[provider];

          // Update the response status
          setResponses((prev) =>
            prev.map((r) =>
              r.provider === provider && r.status === 'loading'
                ? {
                    ...r,
                    response: responseText,
                    status: 'success',
                  }
                : r
            )
          );
        } catch (error) {
          // Update response with error
          setResponses((prev) =>
            prev.map((r) =>
              r.provider === provider && r.status === 'loading'
                ? {
                    ...r,
                    response: `Error: Failed to get response from ${provider}`,
                    status: 'error',
                  }
                : r
            )
          );
        }
      }

      // Add to timeline
      addTimelineEntry({
        prompt,
        providers,
        tags: [],
        responses: responses.filter((r) =>
          providers.includes(r.provider) && r.prompt === prompt
        ),
      });
    },
    [addResponse, addTimelineEntry, responses]
  );

  const value: OrchestratorContextType = {
    responses,
    addResponse,
    updateResponse,
    removeResponse,
    clearResponses,
    timeline,
    addTimelineEntry,
    removeTimelineEntry,
    correctionLinks,
    addCorrectionLink,
    removeCorrectionLink,
    updateCorrectionLink,
    sendPromptToMultipleModels,
  };

  return (
    <OrchestratorContext.Provider value={value}>
      {children}
    </OrchestratorContext.Provider>
  );
}

export function useOrchestrator() {
  const context = useContext(OrchestratorContext);
  if (!context) {
    throw new Error('useOrchestrator must be used within OrchestratorProvider');
  }
  return context;
}
