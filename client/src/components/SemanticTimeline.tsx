/**
 * Semantic Timeline Component
 * Local history with conceptual search capabilities
 * Design: Cyberpunk Minimalism - Luxury Terminal Aesthetic
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Clock, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface TimelineEntry {
  id: string;
  prompt: string;
  providers: string[];
  timestamp: number;
  tags: string[];
  responses: {
    provider: string;
    response: string;
  }[];
}

interface SemanticTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  entries: TimelineEntry[];
  onSelectEntry: (entry: TimelineEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export function SemanticTimeline({
  isOpen,
  onClose,
  entries,
  onSelectEntry,
  onDeleteEntry,
}: SemanticTimelineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract unique tags from all entries
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    entries.forEach((entry) => {
      entry.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [entries]);

  // Semantic search: match by prompt content, tags, or providers
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        searchQuery === '' ||
        entry.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        entry.providers.some((provider) =>
          provider.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTag = selectedTag === null || entry.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [entries, searchQuery, selectedTag]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-neon-cyan/30 bg-card/95 backdrop-blur-md max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-neon-cyan font-mono text-lg">
            SEMANTIC TIMELINE
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-mono text-xs">
            Query history with conceptual search
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search Input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts, tags, or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-neon-cyan/20 bg-input text-foreground font-mono pl-10 placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 text-xs font-mono rounded-sm border transition-colors ${
                  selectedTag === null
                    ? 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan'
                    : 'border-neon-cyan/20 text-muted-foreground hover:text-neon-cyan'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-xs font-mono rounded-sm border transition-colors ${
                    selectedTag === tag
                      ? 'border-neon-lime/50 bg-neon-lime/10 text-neon-lime'
                      : 'border-neon-cyan/20 text-muted-foreground hover:text-neon-cyan'
                  }`}
                >
                  <Tag size={12} className="inline mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Timeline Entries */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {filteredEntries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 text-muted-foreground font-mono text-xs"
                >
                  No entries found
                </motion.div>
              ) : (
                filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 border border-neon-cyan/20 rounded-sm bg-black/30 hover:bg-neon-cyan/5 transition-colors cursor-pointer group"
                    onClick={() => {
                      onSelectEntry(entry);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Clock size={12} className="text-neon-cyan flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-foreground truncate">
                            {entry.prompt}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground">
                            {formatTime(entry.timestamp)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEntry(entry.id);
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Providers & Tags */}
                    <div className="flex flex-wrap gap-2">
                      {entry.providers.map((provider) => (
                        <span
                          key={provider}
                          className="text-xs font-mono px-2 py-1 bg-neon-lime/10 border border-neon-lime/20 text-neon-lime rounded-sm"
                        >
                          {provider}
                        </span>
                      ))}
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono px-2 py-1 bg-neon-magenta/10 border border-neon-magenta/20 text-neon-magenta rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
