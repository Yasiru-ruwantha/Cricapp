import { TeamForm } from '@/components/teams/TeamForm';

export default async function EditTeamRoute({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  return <TeamForm teamId={Number(teamId)} />;
}
