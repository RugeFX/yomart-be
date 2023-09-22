/*
  Warnings:

  - A unique constraint covering the columns `[cart_item_id]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cart_item_id` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_item_id_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "cart_item_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_cart_item_id_key" ON "Item"("cart_item_id");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_cart_item_id_fkey" FOREIGN KEY ("cart_item_id") REFERENCES "CartItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
