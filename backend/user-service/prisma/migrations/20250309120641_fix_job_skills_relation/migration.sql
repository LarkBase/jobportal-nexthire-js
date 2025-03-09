-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "JobLevel" DROP CONSTRAINT "JobLevel_jobId_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "JobSkills" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,

    CONSTRAINT "JobSkills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobSkills_jobId_idx" ON "JobSkills"("jobId");

-- AddForeignKey
ALTER TABLE "JobSkills" ADD CONSTRAINT "JobSkills_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobLevel" ADD CONSTRAINT "JobLevel_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
