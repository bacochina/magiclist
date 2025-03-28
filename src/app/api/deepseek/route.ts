import { NextRequest, NextResponse } from 'next/server';
import { DeepseekService } from './service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, pageTitle, pageSubtitle, tableName, context, prompt } = body;

    const service = DeepseekService.getInstance();

    let fields;
    if (type === 'context') {
      fields = await service.generateFieldsFromContext(
        pageTitle,
        pageSubtitle,
        tableName,
        context
      );
    } else if (type === 'specific') {
      fields = await service.generateSpecificFields(
        pageTitle,
        pageSubtitle,
        tableName,
        prompt
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "context" or "specific".' },
        { status: 400 }
      );
    }

    return NextResponse.json({ fields });
  } catch (error) {
    console.error('Error in DeepSeek API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 