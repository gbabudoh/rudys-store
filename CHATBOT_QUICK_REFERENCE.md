# Chatbot Quick Reference Card

## 🎯 What It Does
Rule-based customer support chatbot - **100% free, no external costs**

## 📍 Location
Bottom-right corner of every page (floating button)

## 💬 Supported Queries

| Topic | Example Questions |
|-------|------------------|
| **Products** | "Show me t-shirts", "Do you have black shoes?" |
| **Sizes** | "What sizes?", "Size guide for shoes" |
| **Prices** | "How much?", "Price range for dresses" |
| **Shipping** | "Delivery time?", "Shipping costs?" |
| **Returns** | "Return policy?", "Can I exchange?" |
| **Orders** | "Track order", "Order status" |
| **Payment** | "Payment methods?", "Is it secure?" |
| **Help** | "Help", "I have a question" |

## 🎨 Customization Quick Guide

### Change Button Color
**File:** `components/Chatbot.tsx`
```typescript
// Line ~60
className="bg-black" → className="bg-blue-600"
```

### Add New Response
**File:** `lib/chatbot.ts`
```typescript
// 1. Add keywords
const INTENTS = {
  newIntent: ['keyword1', 'keyword2'],
};

// 2. Add handler
private handleNewIntent(): ChatbotResponse {
  return {
    message: "Your response here",
    quickReplies: ['Option 1', 'Option 2']
  };
}

// 3. Add to switch statement (line ~90)
case 'newIntent':
  return this.handleNewIntent();
```

### Modify Existing Message
**File:** `lib/chatbot.ts`
Find the handler method and edit the message string.

## 🔧 Files Overview

```
lib/chatbot.ts              → Core logic
components/Chatbot.tsx      → UI component
app/layout.tsx              → Integration point
app/api/chatbot/route.ts    → Optional API
```

## 🧪 Test Commands

```bash
# Start dev server
npm run dev

# Visit any page
http://localhost:3000

# Click chat button (bottom-right)
# Try: "Hi", "Show me products", "Size guide"
```

## 📊 Key Features

✅ Product search (category, color, sale status)
✅ Size guides (clothing & footwear)
✅ Pricing information
✅ Shipping & returns policies
✅ Order tracking help
✅ Payment information
✅ Quick reply buttons
✅ Mobile responsive
✅ Minimize/maximize
✅ Typing indicators

## 💰 Cost

**₦0 / $0** - Completely free!

## 🐛 Quick Fixes

**Not showing?**
- Clear cache
- Check console
- Verify import in layout.tsx

**Not responding?**
- Check lib/products.ts exists
- Test with "Hi"
- Check browser console

## 📚 Full Documentation

- `CHATBOT_GUIDE.md` - Complete guide
- `CHATBOT_EXAMPLES.md` - Usage examples
- `CHATBOT_SUMMARY.md` - Implementation details

## 🚀 Deploy

Works automatically when you deploy your Next.js app. No additional configuration needed!

---

**Quick Start:** `npm run dev` → Click chat button → Type "Hi"
