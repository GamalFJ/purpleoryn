import { servePdf } from "@/lib/docs-server";

export const dynamic = "force-dynamic";

export async function GET() {
  return servePdf("oryn-presence");
}
