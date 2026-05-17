import { readLinks } from "@/lib/store";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const links = await readLinks();
  return <HomeClient initialLinks={links} />;
}
