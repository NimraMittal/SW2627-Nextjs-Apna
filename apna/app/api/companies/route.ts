import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/companies -> { name, email }
export async function POST(req: NextRequest) {
  const body = await req.json();

  const company = await prisma.company.create({
    data: { name: body.name, email: body.email },
  });

  return NextResponse.json(company);
}