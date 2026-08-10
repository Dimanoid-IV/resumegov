import type { NextRequest } from 'next/server';
import { GA_MEASUREMENT_ID } from '@/lib/gtag-server';

export function getGAIdentifiersFromCookies(request: NextRequest): {
  clientId?: string;
  sessionId?: string;
} {
  const gaCookie = request.cookies.get('_ga')?.value;
  const clientMatch = gaCookie?.match(/^(?:GA\d+\.\d+\.)?(\d+\.\d+)$/);

  const propertySuffix = GA_MEASUREMENT_ID.replace(/^G-/, '');
  const sessionCookie = request.cookies.get(`_ga_${propertySuffix}`)?.value;
  const modernSessionMatch = sessionCookie?.match(/(?:^|[.$])s(\d{8,})/);
  const legacySessionMatch = sessionCookie?.match(/^GS\d+\.\d+\.(\d{8,})/);

  return {
    clientId: clientMatch?.[1],
    sessionId: modernSessionMatch?.[1] ?? legacySessionMatch?.[1],
  };
}
