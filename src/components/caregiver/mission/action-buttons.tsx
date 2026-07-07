"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Flame, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  startMission,
  completeMissionSection,
  markWorksheetComplete,
  awardQuestionFuel,
} from "@/app/caregiver/children/[childId]/actions";

export function StartMissionButton({
  childId,
  missionId,
  started,
}: {
  childId: string;
  missionId: string;
  started: boolean;
}) {
  const [pending, startTransition] = useTransition();
  if (started) return null;
  return (
    <Button
      size="lg"
      disabled={pending}
      onClick={() => startTransition(() => startMission(childId, missionId))}
    >
      <Play className="h-4 w-4" /> Start Mission
    </Button>
  );
}

export function SectionCompleteButton({
  childId,
  missionId,
  missionSectionId,
  completed,
}: {
  childId: string;
  missionId: string;
  missionSectionId: string;
  completed: boolean;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      size="sm"
      variant={completed ? "outline" : "primary"}
      disabled={pending || completed}
      onClick={() =>
        startTransition(() => completeMissionSection(childId, missionId, missionSectionId))
      }
    >
      <CheckCircle2 className="h-4 w-4" />
      {completed ? "Section Complete" : "Mark Section Complete"}
    </Button>
  );
}

export function WorksheetCompleteButton({
  childId,
  missionId,
  completed,
}: {
  childId: string;
  missionId: string;
  completed: boolean;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant={completed ? "outline" : "nebula"}
      disabled={pending || completed}
      onClick={() => startTransition(() => markWorksheetComplete(childId, missionId))}
    >
      <CheckCircle2 className="h-4 w-4" />
      {completed ? "Worksheet Complete" : "Mark Worksheet Complete"}
    </Button>
  );
}

export function QuestionCard({
  childId,
  questionId,
  question,
  answer,
  choices,
  rocketFuelReward,
}: {
  childId: string;
  questionId: string;
  question: string;
  answer: string;
  choices: string[] | null;
  rocketFuelReward: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const [awarded, setAwarded] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-lg bg-white/5 p-4">
      <p className="font-medium">{question}</p>
      {choices && choices.length > 0 && (
        <ul className="mt-2 grid grid-cols-1 gap-1 text-sm text-foreground/60 sm:grid-cols-2">
          {choices.map((c) => (
            <li key={c}>• {c}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          className="text-sm font-medium text-cosmic-blue hover:underline"
        >
          {revealed ? `Answer: ${answer}` : "Reveal answer"}
        </button>
        <Button
          size="sm"
          variant={awarded ? "outline" : "primary"}
          disabled={pending || awarded}
          onClick={() =>
            startTransition(async () => {
              await awardQuestionFuel(childId, questionId, question);
              setAwarded(true);
            })
          }
        >
          <Flame className="h-3.5 w-3.5" />
          {awarded ? "Awarded" : `Award ${rocketFuelReward} Rocket Fuel`}
        </Button>
      </div>
    </div>
  );
}
