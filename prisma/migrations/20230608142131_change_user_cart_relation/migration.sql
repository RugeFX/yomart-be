/*
  Warnings:

  - You are about to drop the column `cart_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_cart_id_fkey";

-- DropIndex
DROP INDEX "User_cart_id_key";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cart_id";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_id_key" ON "Cart"("user_id");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
