import { TeamDashboard } from '@/components/teams/TeamDashboard';

export default async function TeamRoute({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  return <TeamDashboard teamId={Number(teamId)} />;
}
