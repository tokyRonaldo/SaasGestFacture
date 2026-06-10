/*
  Warnings:

  - You are about to drop the column `subtotal` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "subtotal",
DROP COLUMN "tax",
ADD COLUMN     "billingAddress" TEXT;
