/*
  Warnings:

  - You are about to drop the column `institutionId` on the `users` table. All the data in the column will be lost.
  - Added the required column `institutionId` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_institutionId_fkey";

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "institutionId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "institutionId",
ADD COLUMN     "crm" TEXT;

-- CreateTable
CREATE TABLE "UserInstitution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInstitution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInstitution_userId_institutionId_key" ON "UserInstitution"("userId", "institutionId");

-- AddForeignKey
ALTER TABLE "UserInstitution" ADD CONSTRAINT "UserInstitution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInstitution" ADD CONSTRAINT "UserInstitution_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
