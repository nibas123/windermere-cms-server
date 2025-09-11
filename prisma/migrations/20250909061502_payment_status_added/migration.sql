-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'UNSUCCESSFUL');

-- AlterTable
ALTER TABLE "public"."EnquiryBooking" ADD COLUMN     "payment" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING';
