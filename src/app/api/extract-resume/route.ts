import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 6 * 1024 * 1024;
const EXTRACTION_WINDOW_MS = 60 * 1000;
const EXTRACTIONS_PER_WINDOW = 5;
const extractionAttempts = new Map<string, { count: number; resetAt: number }>();

function allowExtraction(request: NextRequest): boolean {
  const forwarded = request.headers.get('x-forwarded-for');
  const clientKey = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const existing = extractionAttempts.get(clientKey);

  if (!existing || existing.resetAt <= now) {
    extractionAttempts.set(clientKey, { count: 1, resetAt: now + EXTRACTION_WINDOW_MS });
    return true;
  }
  if (existing.count >= EXTRACTIONS_PER_WINDOW) return false;

  existing.count += 1;
  return true;
}

function extension(name: string): string {
  return name.toLowerCase().split('.').pop() || '';
}

function cleanExtractedText(value: string): string {
  return value
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n')
    .trim();
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }
  if (!allowExtraction(request)) {
    return NextResponse.json(
      { error: 'Too many files were submitted. Wait one minute and try again.' },
      { status: 429 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Choose a resume file.' }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'File must be smaller than 6 MB.' }, { status: 413 });
    }

    const ext = extension(file.name);
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      return NextResponse.json({ error: 'Supported formats: PDF, DOCX, and TXT.' }, { status: 415 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    let text = '';

    if (ext === 'txt') {
      text = new TextDecoder('utf-8').decode(bytes);
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
      text = result.value;
    } else {
      const parser = new PDFParse({ data: bytes });
      try {
        const result = await parser.getText();
        text = result.text;
      } finally {
        await parser.destroy();
      }
    }

    text = cleanExtractedText(text);
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 50) {
      return NextResponse.json(
        { error: 'Very little text could be extracted. If this is a scanned PDF, paste the text manually.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ text, wordCount: words, fileName: file.name });
  } catch (error) {
    console.error('Resume extraction error:', error);
    return NextResponse.json(
      { error: 'We could not read this file. Try another PDF/DOCX or paste the text.' },
      { status: 422 }
    );
  }
}
