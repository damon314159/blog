/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Comment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_uuid_key" ON "Comment"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Post_uuid_key" ON "Post"("uuid");
