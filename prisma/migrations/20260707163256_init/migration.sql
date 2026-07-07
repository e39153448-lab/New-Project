-- CreateEnum
CREATE TYPE "Role" AS ENUM ('parent', 'caregiver', 'admin');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('inquiry', 'free_trial', 'active', 'past_due', 'canceled');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('new', 'contacted', 'call_booked', 'training_booked', 'enrolled', 'lost');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('pending', 'accepted');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('locked', 'available', 'completed');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('not_started', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('locked', 'unlocked', 'collected');

-- CreateEnum
CREATE TYPE "CertificationStatus" AS ENUM ('locked', 'available', 'in_progress', 'passed', 'failed');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('not_prepared', 'preparing', 'shipped', 'delivered');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "parentUserId" TEXT NOT NULL,
    "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'free_trial',
    "trialStartDate" TIMESTAMP(3),
    "trialEndDate" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "currentLevel" TEXT NOT NULL,
    "rocketFuel" INTEGER NOT NULL DEFAULT 0,
    "currentCertificationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaregiverInvite" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "caregiverEmail" TEXT NOT NULL,
    "caregiverName" TEXT,
    "status" "InviteStatus" NOT NULL DEFAULT 'pending',
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaregiverInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildCaregiver" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "caregiverUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChildCaregiver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "parentFirstName" TEXT NOT NULL,
    "parentLastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "childFirstName" TEXT NOT NULL,
    "childAge" INTEGER NOT NULL,
    "childGrade" TEXT NOT NULL,
    "facilitatorType" TEXT NOT NULL,
    "caregiverName" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "notes" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildMilestone" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'locked',
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ChildMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "characterId" TEXT,
    "caregiverInstructions" TEXT NOT NULL,
    "rocketFuelReward" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionSection" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "MissionSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionQuestion" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "choices" JSONB,
    "rocketFuelReward" INTEGER NOT NULL,

    CONSTRAINT "MissionQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildMission" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'not_started',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ChildMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildMissionSection" (
    "id" TEXT NOT NULL,
    "childMissionId" TEXT NOT NULL,
    "missionSectionId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ChildMissionSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "superpower" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "rocketFuelCost" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildCard" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "status" "CardStatus" NOT NULL DEFAULT 'locked',
    "collectedAt" TIMESTAMP(3),

    CONSTRAINT "ChildCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Pin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pinId" TEXT NOT NULL,
    "rocketFuelReward" INTEGER NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationMilestone" (
    "id" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,

    CONSTRAINT "CertificationMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildCertification" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "status" "CertificationStatus" NOT NULL DEFAULT 'locked',
    "passedAt" TIMESTAMP(3),

    CONSTRAINT "ChildCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'not_prepared',
    "trackingNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentItem" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ShipmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RocketFuelTransaction" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RocketFuelTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CaregiverInvite_token_key" ON "CaregiverInvite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ChildCaregiver_childId_caregiverUserId_key" ON "ChildCaregiver"("childId", "caregiverUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildMilestone_childId_milestoneId_key" ON "ChildMilestone"("childId", "milestoneId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildMission_childId_missionId_key" ON "ChildMission"("childId", "missionId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildMissionSection_childMissionId_missionSectionId_key" ON "ChildMissionSection"("childMissionId", "missionSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildCard_childId_cardId_key" ON "ChildCard"("childId", "cardId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationMilestone_certificationId_milestoneId_key" ON "CertificationMilestone"("certificationId", "milestoneId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildCertification_childId_certificationId_key" ON "ChildCertification"("childId", "certificationId");

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_currentCertificationId_fkey" FOREIGN KEY ("currentCertificationId") REFERENCES "Certification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaregiverInvite" ADD CONSTRAINT "CaregiverInvite_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaregiverInvite" ADD CONSTRAINT "CaregiverInvite_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildCaregiver" ADD CONSTRAINT "ChildCaregiver_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildCaregiver" ADD CONSTRAINT "ChildCaregiver_caregiverUserId_fkey" FOREIGN KEY ("caregiverUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildMilestone" ADD CONSTRAINT "ChildMilestone_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildMilestone" ADD CONSTRAINT "ChildMilestone_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionSection" ADD CONSTRAINT "MissionSection_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionQuestion" ADD CONSTRAINT "MissionQuestion_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildMission" ADD CONSTRAINT "ChildMission_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildMission" ADD CONSTRAINT "ChildMission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildMissionSection" ADD CONSTRAINT "ChildMissionSection_childMissionId_fkey" FOREIGN KEY ("childMissionId") REFERENCES "ChildMission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildMissionSection" ADD CONSTRAINT "ChildMissionSection_missionSectionId_fkey" FOREIGN KEY ("missionSectionId") REFERENCES "MissionSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildCard" ADD CONSTRAINT "ChildCard_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildCard" ADD CONSTRAINT "ChildCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_pinId_fkey" FOREIGN KEY ("pinId") REFERENCES "Pin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationMilestone" ADD CONSTRAINT "CertificationMilestone_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationMilestone" ADD CONSTRAINT "CertificationMilestone_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildCertification" ADD CONSTRAINT "ChildCertification_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildCertification" ADD CONSTRAINT "ChildCertification_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentItem" ADD CONSTRAINT "ShipmentItem_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RocketFuelTransaction" ADD CONSTRAINT "RocketFuelTransaction_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
