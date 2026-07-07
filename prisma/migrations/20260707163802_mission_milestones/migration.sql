-- CreateTable
CREATE TABLE "_MissionMilestones" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MissionMilestones_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MissionMilestones_B_index" ON "_MissionMilestones"("B");

-- AddForeignKey
ALTER TABLE "_MissionMilestones" ADD CONSTRAINT "_MissionMilestones_A_fkey" FOREIGN KEY ("A") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MissionMilestones" ADD CONSTRAINT "_MissionMilestones_B_fkey" FOREIGN KEY ("B") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
