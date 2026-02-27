import { handleCheckoutPost } from "@/src/server/checkout/http";

export async function POST(request: Request) {
  return handleCheckoutPost(request);
}
