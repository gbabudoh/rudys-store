# Chatbot Feature Guide

## Overview
A rule-based chatbot assistant for Rudy Store that helps customers with product inquiries, sizing, shipping, returns, and more - **completely free with no external API costs**.

## Features

### What the Chatbot Can Do:
✅ **Product Search** - Find products by category, color, or type
✅ **Size Guidance** - Provide detailed sizing information for clothing and footwear
✅ **Price Information** - Share pricing details and current sales
✅ **Shipping Details** - Explain delivery times and costs
✅ **Returns Policy** - Guide customers through the return process
✅ **Order Tracking** - Direct customers to order tracking resources
✅ **Payment Info** - Explain accepted payment methods
✅ **General Help** - Answer common questions

### Key Capabilities:
- **Keyword Detection** - Understands natural language queries
- **Context Awareness** - Remembers conversation context
- **Quick Replies** - Provides suggested responses for faster interaction
- **Product Filtering** - Searches products by category, color, sale status
- **Real-time Responses** - Instant answers with typing indicators

## How It Works

### Intent Detection
The chatbot uses keyword matching to detect user intent:
- **Greeting**: "hi", "hello", "hey"
- **Size**: "size", "fit", "measurements"
- **Price**: "price", "cost", "how much"
- **Shipping**: "ship", "delivery", "shipping"
- **Returns**: "return", "refund", "exchange"
- **Product**: "product", "show me", "looking for"
- **Order**: "order", "track", "tracking"
- **Payment**: "payment", "pay", "checkout"

### Product Search
Filters products based on:
- **Category**: t-shirts, shirts, trousers, footwear, dresses, bags, glasses
- **Color**: black, white, navy, gray, red, blue, pink, green, brown
- **Status**: new arrivals, on sale

### Example Queries:
- "Show me black t-shirts"
- "What sizes do you have for footwear?"
- "How much are your dresses?"
- "Do you have any sales?"
- "What's your shipping policy?"
- "How do I return an item?"

## Files Structure

```
lib/chatbot.ts          - Core chatbot engine with intent detection
components/Chatbot.tsx  - React component with UI
app/layout.tsx          - Chatbot integrated into main layout
```

## Customization

### Adding New Intents
Edit `lib/chatbot.ts` and add to the `INTENTS` object:

```typescript
const INTENTS = {
  // ... existing intents
  warranty: ['warranty', 'guarantee', 'defect'],
};
```

Then add a handler method:

```typescript
private handleWarrantyQuery(): ChatbotResponse {
  return {
    message: "Our warranty information...",
    quickReplies: ['Contact support', 'View products']
  };
}
```

### Adding New Categories
Update the `CATEGORIES` array in `lib/chatbot.ts`:

```typescript
const CATEGORIES = [
  't-shirts', 'shirts', 'trousers', 
  'footwear', 'dresses', 'bags', 
  'glasses', 'crocs', 'accessories' // Add new category
];
```

### Customizing Responses
All response messages are in the handler methods. Simply edit the message text:

```typescript
private handleGreeting(): ChatbotResponse {
  return {
    message: "Your custom greeting message here!",
    quickReplies: ['Option 1', 'Option 2']
  };
}
```

### Styling
The chatbot UI can be customized in `components/Chatbot.tsx`:
- Colors: Change Tailwind classes (e.g., `bg-black` to `bg-blue-600`)
- Size: Modify `w-96 h-[600px]` for different dimensions
- Position: Change `bottom-6 right-6` for different placement

## Usage

The chatbot automatically appears on all pages as a floating button in the bottom-right corner.

### User Actions:
1. Click the chat button to open
2. Type a message or click quick reply buttons
3. Minimize or close as needed
4. Conversation persists during session

### Admin Monitoring:
Currently, conversations are client-side only. To add analytics:
1. Log messages to your database
2. Track common queries
3. Identify areas for improvement

## Future Enhancements

### Potential Additions (Still Free):
- **FAQ Database** - Load common Q&As from a JSON file
- **Product Recommendations** - Suggest related products
- **Conversation History** - Save chats to database
- **Admin Dashboard** - View chat analytics
- **Multi-language** - Support multiple languages
- **Voice Input** - Add speech recognition

### If Budget Allows Later:
- **AI Integration** - Add OpenAI/Anthropic for smarter responses
- **Live Chat Handoff** - Connect to human support
- **Sentiment Analysis** - Detect customer satisfaction

## Testing

### Test Scenarios:
1. **Greeting**: "Hi" → Should welcome user
2. **Product Search**: "Show me black shoes" → Should list footwear
3. **Size Query**: "What sizes do you have?" → Should show size guide
4. **Shipping**: "How long does shipping take?" → Should explain delivery
5. **Returns**: "Can I return this?" → Should explain return policy
6. **Unknown**: "Random text" → Should offer help options

## Troubleshooting

### Chatbot Not Appearing:
- Check browser console for errors
- Verify `Chatbot` component is imported in `layout.tsx`
- Clear browser cache and reload

### Responses Not Working:
- Check `lib/products.ts` is properly imported
- Verify product data structure matches expected format
- Check browser console for JavaScript errors

### Styling Issues:
- Ensure Tailwind CSS is properly configured
- Check for CSS conflicts with existing styles
- Verify responsive classes for mobile devices

## Performance

- **No API Calls** - All processing happens client-side
- **Lightweight** - Minimal bundle size impact
- **Fast Responses** - Instant keyword matching
- **No Rate Limits** - Unlimited conversations

## Cost Analysis

**Total Cost: ₦0 / $0**
- No external API fees
- No subscription costs
- No per-message charges
- No infrastructure costs

Perfect for businesses wanting to provide customer support without ongoing expenses!

## Support

For questions or issues with the chatbot:
1. Check this guide first
2. Review code comments in `lib/chatbot.ts`
3. Test with example queries
4. Contact your development team

---

**Built for Rudy Store** - A cost-effective customer support solution! 🚀
