// Simple test examples for the chatbot
// Run with: npm test (if you have Jest configured)

import { Chatbot } from '../chatbot';
import { getAllProducts } from '../products';

describe('Chatbot', () => {
  let chatbot: Chatbot;
  let products: any[];

  beforeEach(() => {
    chatbot = new Chatbot();
    products = getAllProducts();
  });

  test('should detect greeting intent', () => {
    const intent = chatbot.detectIntent('Hello there!');
    expect(intent).toBe('greeting');
  });

  test('should detect size intent', () => {
    const intent = chatbot.detectIntent('What sizes do you have?');
    expect(intent).toBe('size');
  });

  test('should detect price intent', () => {
    const intent = chatbot.detectIntent('How much does this cost?');
    expect(intent).toBe('price');
  });

  test('should extract category from message', () => {
    const category = chatbot.extractCategory('Show me some t-shirts');
    expect(category).toBe('t-shirts');
  });

  test('should extract color from message', () => {
    const color = chatbot.extractColor('Do you have black shoes?');
    expect(color).toBe('black');
  });

  test('should handle greeting message', async () => {
    const response = await chatbot.processMessage('Hi', products);
    expect(response.message).toContain('Welcome');
    expect(response.quickReplies).toBeDefined();
  });

  test('should handle product query', async () => {
    const response = await chatbot.processMessage('Show me footwear', products);
    expect(response.message).toContain('products');
  });

  test('should handle size query', async () => {
    const response = await chatbot.processMessage('What sizes are available?', products);
    expect(response.message).toContain('Size Guide');
  });

  test('should handle shipping query', async () => {
    const response = await chatbot.processMessage('How long does shipping take?', products);
    expect(response.message).toContain('Shipping');
  });

  test('should handle unknown intent', async () => {
    const response = await chatbot.processMessage('asdfghjkl', products);
    expect(response.message).toContain('not sure');
  });
});

// Manual testing examples (copy to browser console):
/*
import { Chatbot } from './lib/chatbot';
import { getAllProducts } from './lib/products';

const chatbot = new Chatbot();
const products = getAllProducts();

// Test queries:
await chatbot.processMessage('Hi', products);
await chatbot.processMessage('Show me black t-shirts', products);
await chatbot.processMessage('What sizes do you have?', products);
await chatbot.processMessage('How much are dresses?', products);
await chatbot.processMessage('Shipping information', products);
await chatbot.processMessage('Return policy', products);
*/
