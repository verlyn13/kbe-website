import { WeeklyChallenges } from "@/components/weekly-challenges";

export default function WeeklyChallengesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Weekly Challenges</h1>
      <WeeklyChallenges />
    </div>
  );
}
