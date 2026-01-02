# Personal Agentic OS

A sophisticated Next.js application featuring a **Luxury Terminal** aesthetic with multi-model AI orchestration, secure API management, and advanced collaboration features.

## 🎨 Design Philosophy: Cyberpunk Minimalism

The application embodies a **Cyberpunk Minimalism** design approach with the following characteristics:

- **Pure Black Background** (#000000) as the void
- **Neon Accents**: Cyan (#00FFFF), Lime (#00FF00), Magenta (#FF00FF)
- **Monospace Typography**: JetBrains Mono for all UI elements
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Geometric Precision**: Sharp edges, minimal rounded corners, thin 1px borders
- **Terminal Aesthetic**: Scan-line effects, cursor-style interactions, status indicators

## ✨ Core Features

### 1. Connection Vault Modal

Secure API key management for multiple AI providers with real-time validation:

- **Supported Providers**: OpenAI (ChatGPT), Google Gemini, DeepSeek, Alibaba Qwen
- **Validation**: Real test calls to verify API keys before saving
- **Secure Storage**: Keys stored in LocalStorage with provider-specific namespacing
- **Visual Feedback**: Success animations (neon lime) and error toasts
- **Provider Management**: View, add, and remove saved connections

**Usage Flow**:
1. Click "Vault" button in header
2. Select a model provider from dropdown
3. Enter API key (with password toggle)
4. Click "Validate & Save"
5. System performs real API test call
6. On success: Key saved, connection indicator appears
7. On failure: Error message with reason

### 2. Infinite Canvas

React Flow-based draggable canvas for multi-model orchestration:

- **Draggable Response Cards**: Move API responses around the canvas
- **Node Connections**: Link responses for workflow visualization
- **Multi-Model View**: See responses from different providers side-by-side
- **Real-time Updates**: Status indicators (loading, success, error)
- **Canvas Controls**: Zoom, pan, fit view, toggle interactivity
- **Mini Map**: Overview of all responses on canvas

**Features**:
- Automatic node positioning with random offset
- Copy response to clipboard with single click
- Delete individual responses or clear entire canvas
- Visual status indicators with icons
- Responsive grid background with neon accent

### 3. Semantic Timeline

Local query history with conceptual search capabilities:

- **Query History**: All prompts and responses stored locally
- **Semantic Search**: Search by prompt content, tags, or provider names
- **Tag Filtering**: Quick filter by conceptual tags
- **Time Indicators**: "Just now", "5m ago", "2h ago" format
- **Quick Restore**: Click any timeline entry to restore prompt and providers
- **Delete History**: Remove individual entries with hover action

**Search Capabilities**:
- Full-text search across prompt content
- Provider filtering (e.g., "openai", "gemini")
- Tag-based organization and filtering
- Combined search and filter operations

### 4. Self-Correction System

Link responses for automated code review and fact-checking:

- **Correction Types**: Code Review, Fact Check, Optimization
- **Multi-Model Linking**: Link any response to any other for comparison
- **Status Tracking**: Pending, Completed, Error states
- **Feedback Integration**: Add correction feedback to links
- **Visual Workflow**: See which models are reviewing which responses

**Workflow Example**:
1. Get response from DeepSeek (code generation)
2. Open Self-Correction Panel
3. Link DeepSeek response to ChatGPT for code review
4. ChatGPT analyzes and provides feedback
5. View comparison on canvas with connection lines

### 5. Multi-Model Orchestrator

Send prompts to multiple APIs simultaneously:

- **Batch Requests**: Query multiple models with single prompt
- **Parallel Processing**: Responses appear as they complete
- **Provider Selection**: Checkbox interface for model selection
- **Status Tracking**: Loading indicators for in-progress requests
- **Response Management**: Individual delete or clear all

## 🛠️ Tech Stack

- **Framework**: Next.js with React 19
- **Styling**: Tailwind CSS 4 with custom theme
- **UI Components**: shadcn/ui (Dialog, Select, Button, Input, etc.)
- **Canvas**: React Flow 11 for infinite canvas
- **Animation**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography
- **Notifications**: Sonner for toast notifications
- **API Clients**: OpenAI SDK, Google Generative AI SDK
- **Storage**: LocalStorage for secure key management
- **Typography**: JetBrains Mono from Google Fonts

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Environment Variables

No external environment variables required. All API keys are managed through the Connection Vault UI and stored securely in LocalStorage.

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ConnectionVault.tsx          # API key management modal
│   │   ├── InfiniteCanvas.tsx           # React Flow canvas
│   │   ├── ResponseNode.tsx             # Individual response node
│   │   ├── SemanticTimeline.tsx         # Query history with search
│   │   └── SelfCorrectionPanel.tsx      # Code review linking
│   ├── contexts/
│   │   ├── OrchestratorContext.tsx      # Multi-model state management
│   │   └── ThemeContext.tsx             # Theme provider
│   ├── lib/
│   │   └── apiValidation.ts             # API validation & storage
│   ├── pages/
│   │   ├── Home.tsx                     # Main application page
│   │   └── NotFound.tsx                 # 404 page
│   ├── App.tsx                          # Root component
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Global styles & theme
├── public/
│   └── [static assets]
└── index.html

server/
└── index.ts                             # Express server (static serving)
```

## 🎯 Key Design Decisions

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | #000000 | Main canvas and page background |
| Foreground | #FFFFFF | Primary text |
| Neon Cyan | #00FFFF | Primary accent, borders, active states |
| Neon Lime | #00FF00 | Success states, saved indicators |
| Neon Magenta | #FF00FF | Warnings, secondary accents |
| Card | #0A0A0A | Modal and panel backgrounds |
| Muted | #1A1A1A | Subtle backgrounds, disabled states |

### Typography

- **Display**: JetBrains Mono Bold 24px (section headers)
- **Body**: JetBrains Mono Regular 14px (main content)
- **Code**: JetBrains Mono Regular 12px (API responses)
- **Labels**: JetBrains Mono 12px uppercase with letter-spacing

### Spacing System

- Base unit: 8px
- Padding: 16px (2x), 24px (3x), 32px (4x)
- Gaps: 8px, 16px, 24px
- Generous whitespace for luxury aesthetic

### Animation Principles

- **Entrance**: 200ms ease-out fade + scale
- **Hover**: 150ms transition for border glow
- **Click**: 100ms pulse effect with neon flash
- **Transitions**: Smooth 150-300ms cubic-bezier curves
- **Scan-lines**: 8s linear loop for subtle effect

## 🔐 Security & Privacy

### API Key Management

- Keys stored in **LocalStorage** with provider-specific namespacing
- No keys sent to backend or external services
- Validation happens client-side with real API test calls
- Keys can be deleted at any time
- No tracking or analytics on API keys

### Data Storage

- All query history stored locally in browser
- No data sent to external servers
- Timeline entries include full response data
- Semantic search performed entirely client-side

## 🎮 Usage Examples

### Example 1: Compare Multiple Models

1. Open Connection Vault and add OpenAI and Gemini API keys
2. Enter prompt: "Explain quantum computing in simple terms"
3. Select both models
4. Click "Send to Canvas"
5. Watch responses appear side-by-side on canvas
6. Drag nodes to organize layout
7. Connect nodes to show relationships

### Example 2: Code Review Workflow

1. Get code generation from DeepSeek
2. Open Self-Correction Panel
3. Link DeepSeek response to ChatGPT for review
4. ChatGPT analyzes code quality
5. View feedback in correction link
6. Iterate until satisfied

### Example 3: Search Query History

1. Click "Timeline" button
2. Search for "python" to find all Python-related queries
3. Filter by "openai" tag to see only OpenAI responses
4. Click entry to restore prompt and providers
5. Modify and send again

## 🐛 Known Limitations

- API validation requires actual API keys (test keys will fail)
- Mock responses used for demonstration (real API calls require backend proxy)
- LocalStorage limited to ~5-10MB depending on browser
- No offline support (requires internet for API validation)
- No data export/import functionality yet

## 🚧 Future Enhancements

- [ ] Backend API proxy for real multi-model orchestration
- [ ] Persistent cloud storage for timeline and responses
- [ ] Advanced prompt templates and variables
- [ ] Streaming responses for real-time output
- [ ] Custom model fine-tuning workflows
- [ ] Collaboration features (share prompts, responses)
- [ ] Advanced analytics and usage statistics
- [ ] Voice input/output support
- [ ] Plugin system for custom integrations
- [ ] Dark/Light theme toggle (currently dark-only)

## 📝 API Validation Details

### OpenAI

- Endpoint: `https://api.openai.com/v1/chat/completions`
- Model: `gpt-3.5-turbo`
- Test: Simple "Hello" completion

### Google Gemini

- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- Model: `gemini-pro`
- Test: Simple text generation

### DeepSeek

- Endpoint: `https://api.deepseek.com/chat/completions`
- Model: `deepseek-chat`
- Test: Simple chat completion

### Alibaba Qwen

- Endpoint: `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- Model: `qwen-turbo`
- Test: Simple text generation

## 🤝 Contributing

This is a personal project. For suggestions or improvements, please refer to the design philosophy and maintain consistency with the Cyberpunk Minimalism aesthetic.

## 📄 License

MIT License - Feel free to use this as a template for your own projects.

---

**Built with ❤️ using Next.js, React Flow, and Framer Motion**

*Luxury Terminal Aesthetic | Cyberpunk Minimalism | Multi-Model Orchestration*
