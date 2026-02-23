import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default async function Home() {
  const getSession = await authClient.getSession();
  console.log(getSession);
  return (
   <div>
    <Button variant="outline">Click Here</Button>
   </div>
  );
}
