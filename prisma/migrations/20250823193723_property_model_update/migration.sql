/*
  Warnings:

  - You are about to alter the column `guests` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `rooms` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `size` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."Property" ALTER COLUMN "guests" SET DATA TYPE INTEGER,
ALTER COLUMN "rooms" SET DATA TYPE INTEGER,
ALTER COLUMN "size" SET DATA TYPE INTEGER;
