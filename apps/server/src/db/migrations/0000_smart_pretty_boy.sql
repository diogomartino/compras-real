CREATE TYPE "public"."household_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."product_import_status" AS ENUM('pending', 'completed', 'failed', 'not_implemented');--> statement-breakpoint
CREATE TYPE "public"."shopping_item_source" AS ENUM('base', 'ongoing');--> statement-breakpoint
CREATE TYPE "public"."shopping_item_status" AS ENUM('pending', 'done', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."shopping_session_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."unit_kind" AS ENUM('unit', 'kg', 'g', 'liter', 'ml', 'pack', 'bottle', 'box', 'other');--> statement-breakpoint
CREATE TABLE "base_list_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity_amount" numeric(12, 3) NOT NULL,
	"quantity_unit" "unit_kind" DEFAULT 'unit' NOT NULL,
	"created_by" uuid,
	"created_at" numeric NOT NULL,
	"updated_at" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" numeric NOT NULL,
	"updated_at" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "household_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "household_role" DEFAULT 'member' NOT NULL,
	"created_at" numeric NOT NULL,
	"updated_at" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "households" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_by" uuid,
	"created_at" numeric NOT NULL,
	"updated_at" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ongoing_list_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity_amount" numeric(12, 3) NOT NULL,
	"quantity_unit" "unit_kind" DEFAULT 'unit' NOT NULL,
	"created_by" uuid,
	"carried_over_from_session_id" uuid,
	"created_at" numeric NOT NULL,
	"updated_at" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_import_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"requested_by" uuid,
	"url" text NOT NULL,
	"status" "product_import_status" DEFAULT 'not_implemented' NOT NULL,
	"parsed_data" jsonb,
	"error_message" text,
	"created_at" numeric NOT NULL,
	"updated_at" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"title" text NOT NULL,
	"image_key" text,
	"image_url" text,
	"category_id" uuid,
	"unit_kind" "unit_kind" DEFAULT 'unit' NOT NULL,
	"default_quantity_amount" numeric(12, 3) NOT NULL,
	"default_quantity_unit" "unit_kind" DEFAULT 'unit' NOT NULL,
	"source_url" text,
	"is_archived" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" numeric NOT NULL,
	"updated_at" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shopping_session_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"base_list_item_id" uuid,
	"ongoing_list_item_id" uuid,
	"source" "shopping_item_source" NOT NULL,
	"quantity_amount" numeric(12, 3) NOT NULL,
	"quantity_unit" "unit_kind" DEFAULT 'unit' NOT NULL,
	"status" "shopping_item_status" DEFAULT 'pending' NOT NULL,
	"status_updated_at" numeric,
	"status_updated_by" uuid,
	"created_at" numeric NOT NULL,
	"updated_at" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shopping_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"status" "shopping_session_status" DEFAULT 'active' NOT NULL,
	"started_at" numeric NOT NULL,
	"completed_at" numeric,
	"created_by" uuid,
	"completed_by" uuid,
	"created_at" numeric NOT NULL,
	"updated_at" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"avatar_url" text,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" numeric NOT NULL,
	"updated_at" numeric NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "base_list_items" ADD CONSTRAINT "base_list_items_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "base_list_items" ADD CONSTRAINT "base_list_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "base_list_items" ADD CONSTRAINT "base_list_items_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "households" ADD CONSTRAINT "households_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ongoing_list_items" ADD CONSTRAINT "ongoing_list_items_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ongoing_list_items" ADD CONSTRAINT "ongoing_list_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ongoing_list_items" ADD CONSTRAINT "ongoing_list_items_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_import_requests" ADD CONSTRAINT "product_import_requests_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_import_requests" ADD CONSTRAINT "product_import_requests_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_session_items" ADD CONSTRAINT "shopping_session_items_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_session_items" ADD CONSTRAINT "shopping_session_items_session_id_shopping_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."shopping_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_session_items" ADD CONSTRAINT "shopping_session_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_session_items" ADD CONSTRAINT "shopping_session_items_base_list_item_id_base_list_items_id_fk" FOREIGN KEY ("base_list_item_id") REFERENCES "public"."base_list_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_session_items" ADD CONSTRAINT "shopping_session_items_ongoing_list_item_id_ongoing_list_items_id_fk" FOREIGN KEY ("ongoing_list_item_id") REFERENCES "public"."ongoing_list_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_session_items" ADD CONSTRAINT "shopping_session_items_status_updated_by_users_id_fk" FOREIGN KEY ("status_updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_sessions" ADD CONSTRAINT "shopping_sessions_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_sessions" ADD CONSTRAINT "shopping_sessions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_sessions" ADD CONSTRAINT "shopping_sessions_completed_by_users_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "base_list_items_household_id_idx" ON "base_list_items" USING btree ("household_id");--> statement-breakpoint
CREATE INDEX "base_list_items_product_id_idx" ON "base_list_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "base_list_items_created_by_idx" ON "base_list_items" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "base_list_items_household_product_unique_idx" ON "base_list_items" USING btree ("household_id","product_id");--> statement-breakpoint
CREATE INDEX "categories_household_id_idx" ON "categories" USING btree ("household_id");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_household_name_unique_idx" ON "categories" USING btree ("household_id","name");--> statement-breakpoint
CREATE INDEX "household_members_household_id_idx" ON "household_members" USING btree ("household_id");--> statement-breakpoint
CREATE INDEX "household_members_user_id_idx" ON "household_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "household_members_household_user_unique_idx" ON "household_members" USING btree ("household_id","user_id");--> statement-breakpoint
CREATE INDEX "households_created_by_idx" ON "households" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "ongoing_list_items_household_id_idx" ON "ongoing_list_items" USING btree ("household_id");--> statement-breakpoint
CREATE INDEX "ongoing_list_items_product_id_idx" ON "ongoing_list_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "ongoing_list_items_created_by_idx" ON "ongoing_list_items" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "ongoing_list_items_carried_over_from_session_id_idx" ON "ongoing_list_items" USING btree ("carried_over_from_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ongoing_list_items_household_product_unique_idx" ON "ongoing_list_items" USING btree ("household_id","product_id");--> statement-breakpoint
CREATE INDEX "product_import_requests_household_id_idx" ON "product_import_requests" USING btree ("household_id");--> statement-breakpoint
CREATE INDEX "product_import_requests_requested_by_idx" ON "product_import_requests" USING btree ("requested_by");--> statement-breakpoint
CREATE INDEX "product_import_requests_status_idx" ON "product_import_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_household_id_idx" ON "products" USING btree ("household_id");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_is_archived_idx" ON "products" USING btree ("is_archived");--> statement-breakpoint
CREATE UNIQUE INDEX "products_household_title_unique_idx" ON "products" USING btree ("household_id","title");--> statement-breakpoint
CREATE INDEX "shopping_session_items_household_id_idx" ON "shopping_session_items" USING btree ("household_id");--> statement-breakpoint
CREATE INDEX "shopping_session_items_session_id_idx" ON "shopping_session_items" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "shopping_session_items_product_id_idx" ON "shopping_session_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "shopping_session_items_status_idx" ON "shopping_session_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "shopping_session_items_source_idx" ON "shopping_session_items" USING btree ("source");--> statement-breakpoint
CREATE INDEX "shopping_session_items_base_list_item_id_idx" ON "shopping_session_items" USING btree ("base_list_item_id");--> statement-breakpoint
CREATE INDEX "shopping_session_items_ongoing_list_item_id_idx" ON "shopping_session_items" USING btree ("ongoing_list_item_id");--> statement-breakpoint
CREATE INDEX "shopping_session_items_status_updated_by_idx" ON "shopping_session_items" USING btree ("status_updated_by");--> statement-breakpoint
CREATE UNIQUE INDEX "shopping_session_items_session_product_unique_idx" ON "shopping_session_items" USING btree ("session_id","product_id");--> statement-breakpoint
CREATE INDEX "shopping_sessions_household_id_idx" ON "shopping_sessions" USING btree ("household_id");--> statement-breakpoint
CREATE INDEX "shopping_sessions_status_idx" ON "shopping_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "shopping_sessions_created_by_idx" ON "shopping_sessions" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "shopping_sessions_completed_by_idx" ON "shopping_sessions" USING btree ("completed_by");--> statement-breakpoint
CREATE UNIQUE INDEX "shopping_sessions_one_active_per_household_unique_idx" ON "shopping_sessions" USING btree ("household_id") WHERE "shopping_sessions"."status" = 'active';--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");