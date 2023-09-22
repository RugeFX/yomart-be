/*
  Warnings:

  - You are about to drop the column `cart_item_id` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[item_id]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_cart_item_id_fkey";

-- DropIndex
DROP INDEX "Item_cart_item_id_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "cart_item_id";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_item_id_key" ON "CartItem"("item_id");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
