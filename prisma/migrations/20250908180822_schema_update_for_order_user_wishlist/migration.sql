/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `EnquiryBooking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refNo]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `EnquiryBooking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."EnquiryBooking" ADD COLUMN     "pets" INTEGER,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Property" ALTER COLUMN "refNo" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "EnquiryBooking_userId_key" ON "public"."EnquiryBooking"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_refNo_key" ON "public"."Property"("refNo");

-- RenameIndex
ALTER INDEX "public"."Wishlist_userId_propertyId_key" RENAME TO "wishlist_key";
