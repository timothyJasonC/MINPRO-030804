/*
  Warnings:

  - Made the column `ticket` on table `event` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `organizerId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `ticket` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `organizerId` INTEGER NOT NULL;
