/*
  Warnings:

  - You are about to drop the column `subtotal` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "subtotal",
DROP COLUMN "tax",
ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "condition_payement" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT;
