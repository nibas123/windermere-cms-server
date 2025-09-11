/*
  Warnings:

  - A unique constraint covering the columns `[stripeId]` on the table `EnquiryBooking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."EnquiryBooking" ADD COLUMN     "infant" INTEGER DEFAULT 0,
ADD COLUMN     "teens" INTEGER DEFAULT 0,
ALTER COLUMN "adults" SET DEFAULT 0,
ALTER COLUMN "children" SET DEFAULT 0,
ALTER COLUMN "pets" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "EnquiryBooking_stripeId_key" ON "public"."EnquiryBooking"("stripeId");
