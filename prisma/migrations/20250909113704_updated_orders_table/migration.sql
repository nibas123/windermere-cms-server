/*
  Warnings:

  - Added the required column `amount` to the `EnquiryBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeId` to the `EnquiryBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EnquiryBooking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."EnquiryBooking" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "stripeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
