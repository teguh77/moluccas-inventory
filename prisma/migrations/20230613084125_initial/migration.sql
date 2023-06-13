-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'RT', 'KSBU');

-- CreateEnum
CREATE TYPE "Rules" AS ENUM ('ALLOW', 'PREVENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVED', 'REJECTED', 'NOTHING', 'READY', 'INSTRUCTION', 'PURE');

-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('STOCKIN', 'STOCKOUT', 'PROPOSAL', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "role" "Role" DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "latest_quantity" INTEGER NOT NULL DEFAULT 0,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocks" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocks_in" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" VARCHAR(255),
    "productId" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,
    "created_month" TEXT,

    CONSTRAINT "stocks_in_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocks_out" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" VARCHAR(255),
    "productId" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,
    "created_month" TEXT,

    CONSTRAINT "stocks_out_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incarts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "incarts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incarts_detail" (
    "id" TEXT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_category" VARCHAR(255) NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_incart" INTEGER NOT NULL,
    "product_code" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "incart_id" TEXT,

    CONSTRAINT "incarts_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rules" (
    "id" TEXT NOT NULL,
    "allow_add_to_cart" "Rules" DEFAULT 'ALLOW',
    "active_step" SMALLINT DEFAULT 1,
    "user_id" TEXT,

    CONSTRAINT "rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_category" VARCHAR(255) NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_code" TEXT NOT NULL,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifs" (
    "id" TEXT NOT NULL,
    "status" "Status" DEFAULT 'NOTHING',
    "type" "NotifType",
    "description" TEXT,
    "note" TEXT,
    "user_id" TEXT,
    "proposal_id" TEXT,

    CONSTRAINT "notifs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifs_cart" (
    "id" TEXT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_category" VARCHAR(255) NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_code" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "productId" TEXT,
    "notif_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifs_cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "user_id" TEXT,
    "when_needed" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_notes" (
    "id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "incart_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_notes" (
    "id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adjustment" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "adjust_quantity" INTEGER NOT NULL,
    "note" VARCHAR(255),
    "notif_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "categories_title_key" ON "categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "rules_user_id_key" ON "rules"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "notifs_proposal_id_key" ON "notifs"("proposal_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_notes_reference_number_key" ON "request_notes"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "request_notes_incart_id_key" ON "request_notes"("incart_id");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_notes_reference_number_key" ON "delivery_notes"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_notes_order_id_key" ON "delivery_notes"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "adjustment_product_id_key" ON "adjustment"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "adjustment_notif_id_key" ON "adjustment"("notif_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks_in" ADD CONSTRAINT "stocks_in_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks_in" ADD CONSTRAINT "stocks_in_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks_out" ADD CONSTRAINT "stocks_out_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks_out" ADD CONSTRAINT "stocks_out_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incarts" ADD CONSTRAINT "incarts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incarts_detail" ADD CONSTRAINT "incarts_detail_incart_id_fkey" FOREIGN KEY ("incart_id") REFERENCES "incarts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rules" ADD CONSTRAINT "rules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifs" ADD CONSTRAINT "notifs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifs" ADD CONSTRAINT "notifs_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifs_cart" ADD CONSTRAINT "notifs_cart_notif_id_fkey" FOREIGN KEY ("notif_id") REFERENCES "notifs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_notes" ADD CONSTRAINT "request_notes_incart_id_fkey" FOREIGN KEY ("incart_id") REFERENCES "incarts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adjustment" ADD CONSTRAINT "adjustment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adjustment" ADD CONSTRAINT "adjustment_notif_id_fkey" FOREIGN KEY ("notif_id") REFERENCES "notifs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
