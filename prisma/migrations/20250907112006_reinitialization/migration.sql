/*
  Warnings:

  - You are about to drop the column `rooms` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `uplisting_id` on the `Property` table. All the data in the column will be lost.
  - Added the required column `enquiryId` to the `EnquiryBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bathrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cleaning_fee` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pets` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pets_fee` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `slug` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."EnquiryBooking" ADD COLUMN     "enquiryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Property" DROP COLUMN "rooms",
DROP COLUMN "size",
DROP COLUMN "uplisting_id",
ADD COLUMN     "bathrooms" TEXT NOT NULL,
ADD COLUMN     "bedrooms" TEXT NOT NULL,
ADD COLUMN     "cleaning_fee" INTEGER NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "pets" INTEGER NOT NULL,
ADD COLUMN     "pets_fee" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "mobile" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_propertyId_key" ON "public"."Wishlist"("userId", "propertyId");

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
