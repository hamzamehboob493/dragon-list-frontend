import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { envVars } from '@/config';

const openai = new OpenAI({
  apiKey: envVars.openApiKey,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || !messages.every(msg => msg.role && msg.content)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const reply = completion.choices[0]?.message;
    if (!reply) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    console.error('OpenAI Error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
