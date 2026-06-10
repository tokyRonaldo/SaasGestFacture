/*
  Warnings:

  - The `quoteNumber` column on the `Quote` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "quoteNumber",
ADD COLUMN     "quoteNumber" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Quote_quoteNumber_key" ON "Quote"("quoteNumber");
