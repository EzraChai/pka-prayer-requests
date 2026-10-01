import CellGroupPage from "@/components/cell-group-page";

export default async function CellGroupRoute({
  params,
}: {
  params: Promise<{ cgName: string }>;
}) {
  const { cgName } = await params;
  return <CellGroupPage slug={cgName.toLowerCase()} />;
}
