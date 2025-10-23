import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_ONCHAINKIT_API_KEY: !!process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
    NEXT_PUBLIC_DIARY_TOKEN_ADDRESS: !!process.env.NEXT_PUBLIC_DIARY_TOKEN_ADDRESS,
    OWNER_PRIVATE_KEY: !!process.env.OWNER_PRIVATE_KEY,
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXT_PUBLIC_CHAIN_ID: !!process.env.NEXT_PUBLIC_CHAIN_ID,
    GROQ_API_KEY: !!process.env.GROQ_API_KEY,
    OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
    ADMIN_API_KEY: !!process.env.ADMIN_API_KEY,
    MUBERT_COMPANY_ID: !!process.env.MUBERT_COMPANY_ID,
    MUBERT_LICENSE_TOKEN: !!process.env.MUBERT_LICENSE_TOKEN,
  };

  return NextResponse.json({
    message: 'Environment variables check (true = set, false = missing)',
    env: envVars,
  });
}
