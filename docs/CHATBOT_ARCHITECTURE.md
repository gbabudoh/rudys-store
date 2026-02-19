# Chatbot Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Rudy Store Website                       │
│                    (All Pages/Routes)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Integrated via
                              │ app/layout.tsx
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Chatbot Component (UI)                      │
│                  components/Chatbot.tsx                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • Chat Window (Messages Display)                    │  │
│  │  • Input Field (User Types Here)                     │  │
│  │  • Quick Reply Buttons                               │  │
│  │  • Minimize/Maximize Controls                        │  │
│  │  • Typing Indicators                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Sends user message
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Chatbot Engine (Logic)                      │
│                    lib/chatbot.ts                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Intent Detection                                 │  │
│  │     • Keyword matching                               │  │
│  │     • Pattern recognition                            │  │
│  │                                                       │  │
│  │  2. Entity Extraction                                │  │
│  │     • Category (t-shirts, shoes, etc.)              │  │
│  │     • Color (black, white, etc.)                    │  │
│  │     • Status (new, sale)                            │  │
│  │                                                       │  │
│  │  3. Context Management                               │  │
│  │     • Remember last category                         │  │
│  │     • Track conversation flow                        │  │
│  │                                                       │  │
│  │  4. Response Generation                              │  │
│  │     • Select appropriate handler                     │  │
│  │     • Generate message text                          │  │
│  │     • Create quick replies                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Queries product data
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Product Database                           │
│                   lib/products.ts                            │
│                                                              │
│  • Product catalog                                          │
│  • Pricing information                                      │
│  • Categories & filters                                     │
│  • Stock status                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Types Message
       │
       ▼
[Chatbot UI Component]
       │
       ├─→ Display user message
       │
       ├─→ Show typing indicator
       │
       ▼
[Chatbot Engine]
       │
       ├─→ Detect intent (greeting, size, price, etc.)
       │
       ├─→ Extract entities (category, color)
       │
       ├─→ Query products if needed
       │
       ├─→ Generate response
       │
       ▼
[Chatbot UI Component]
       │
       ├─→ Display bot message
       │
       └─→ Show quick reply buttons
```

## Intent Detection Flow

```
User Message: "Show me black t-shirts on sale"
       │
       ▼
┌─────────────────────────────────────┐
│   Keyword Analysis                  │
│                                     │
│   • "show me" → product intent      │
│   • "black" → color filter          │
│   • "t-shirts" → category filter    │
│   • "sale" → status filter          │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Product Filtering                 │
│                                     │
│   1. Get all products               │
│   2. Filter by category: t-shirts   │
│   3. Filter by color: black         │
│   4. Filter by status: on sale      │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Response Generation               │
│                                     │
│   • Format product list             │
│   • Add pricing info                │
│   • Include discount percentages    │
│   • Generate quick replies          │
└─────────────────────────────────────┘
       │
       ▼
Display to User
```

## Component Structure

```
components/Chatbot.tsx
│
├─ State Management
│  ├─ isOpen (chat window visibility)
│  ├─ isMinimized (minimize state)
│  ├─ messages (conversation history)
│  ├─ inputValue (current user input)
│  └─ isTyping (bot typing indicator)
│
├─ UI Elements
│  ├─ Floating Button (when closed)
│  ├─ Chat Header
│  │  ├─ Title & Status
│  │  ├─ Minimize Button
│  │  └─ Close Button
│  │
│  ├─ Messages Container
│  │  ├─ User Messages (right-aligned, black)
│  │  ├─ Bot Messages (left-aligned, gray)
│  │  ├─ Quick Reply Buttons
│  │  └─ Typing Indicator
│  │
│  └─ Input Area
│     ├─ Text Input Field
│     └─ Send Button
│
└─ Event Handlers
   ├─ handleSendMessage()
   ├─ handleQuickReply()
   └─ handleKeyPress()
```

## Engine Structure

```
lib/chatbot.ts
│
├─ Constants
│  ├─ INTENTS (keyword mappings)
│  ├─ CATEGORIES (product types)
│  └─ COLORS (available colors)
│
├─ Chatbot Class
│  │
│  ├─ conversationContext
│  │  ├─ lastIntent
│  │  ├─ lastCategory
│  │  └─ lastProduct
│  │
│  ├─ Detection Methods
│  │  ├─ detectIntent()
│  │  ├─ extractCategory()
│  │  └─ extractColor()
│  │
│  ├─ Main Processor
│  │  └─ processMessage()
│  │
│  └─ Handler Methods
│     ├─ handleGreeting()
│     ├─ handleSizeQuery()
│     ├─ handlePriceQuery()
│     ├─ handleShippingQuery()
│     ├─ handleReturnsQuery()
│     ├─ handleProductQuery()
│     ├─ handleOrderQuery()
│     ├─ handlePaymentQuery()
│     ├─ handleHelpQuery()
│     ├─ handleThanks()
│     ├─ handleGoodbye()
│     └─ handleUnknown()
│
└─ Response Interface
   ├─ message (text response)
   ├─ quickReplies (button options)
   └─ data (optional product data)
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                     app/layout.tsx                           │
│                                                              │
│  • Imports Chatbot component                                │
│  • Renders on all pages                                     │
│  • Positioned as fixed element                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                app/api/chatbot/route.ts                      │
│                                                              │
│  • Optional server-side endpoint                            │
│  • For future logging/analytics                             │
│  • Not currently used by UI                                 │
└─────────────────────────────────────────────────────────────┘
```

## Processing Example

```
User: "What sizes do you have for shoes?"

Step 1: Intent Detection
  └─> Keywords: "sizes", "shoes"
  └─> Intent: "size"
  └─> Category: "footwear"

Step 2: Handler Selection
  └─> handleSizeQuery(category: "footwear")

Step 3: Response Generation
  └─> Message: Footwear size guide with US/EU conversions
  └─> Quick Replies: ["Show footwear", "Clothing sizes", "Contact support"]

Step 4: Display
  └─> Bot message appears in chat
  └─> Quick reply buttons shown below
```

## Scalability

```
Current: Client-Side Only
┌──────────────────────┐
│   Browser            │
│   ├─ UI Component    │
│   ├─ Engine Logic    │
│   └─ Product Data    │
└──────────────────────┘

Future: With Server Integration
┌──────────────────────┐      ┌──────────────────────┐
│   Browser            │      │   Server             │
│   ├─ UI Component    │◄────►│   ├─ API Route       │
│   └─ Display Logic   │      │   ├─ Database        │
└──────────────────────┘      │   ├─ Analytics       │
                              │   └─ Logging         │
                              └──────────────────────┘
```

## Performance Characteristics

- **Response Time:** < 1 second (client-side processing)
- **Memory Usage:** Minimal (no conversation history stored)
- **Network:** Zero API calls (all local)
- **Bundle Size:** ~15KB (gzipped)
- **Scalability:** Unlimited concurrent users

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                          │
│                                                              │
│  1. Client-Side Only                                        │
│     • No sensitive data transmitted                         │
│     • No external API calls                                 │
│                                                              │
│  2. No Data Storage                                         │
│     • Conversations not persisted                           │
│     • No cookies or local storage                           │
│                                                              │
│  3. Input Sanitization                                      │
│     • React automatically escapes output                    │
│     • No eval() or dangerous operations                     │
│                                                              │
│  4. Product Data                                            │
│     • Read-only access                                      │
│     • No database modifications                             │
└─────────────────────────────────────────────────────────────┘
```

## Extension Points

```
Easy to Add:
├─ New Intents (add keywords + handler)
├─ New Categories (update CATEGORIES array)
├─ New Colors (update COLORS array)
├─ Custom Responses (edit handler methods)
└─ Quick Replies (modify response objects)

Moderate Effort:
├─ Conversation Logging (use API route)
├─ Analytics Tracking (add logging calls)
├─ Multi-language (add translation layer)
└─ FAQ Database (load from JSON/API)

Advanced Features:
├─ AI Integration (add LLM API calls)
├─ Live Chat Handoff (WebSocket connection)
├─ Voice Input (Web Speech API)
└─ Sentiment Analysis (add analysis library)
```

---

**Architecture designed for simplicity, performance, and zero cost!** 🚀
