/*
  Warnings:

  - You are about to drop the column `referralNumber` on the `referral` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referralCode]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referralCode` to the `Referral` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Referral_referralNumber_key` ON `referral`;

-- AlterTable
ALTER TABLE `referral` DROP COLUMN `referralNumber`,
    ADD COLUMN `referralCode` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Referral_referralCode_key` ON `Referral`(`referralCode`);
