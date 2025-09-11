/*
  Warnings:

  - You are about to drop the `Wishlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_visitorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Wishlist" DROP CONSTRAINT "Wishlist_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Wishlist" DROP CONSTRAINT "Wishlist_userId_fkey";

-- DropTable
DROP TABLE "public"."Wishlist";

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
