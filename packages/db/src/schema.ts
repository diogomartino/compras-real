import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const householdRoleEnum = pgEnum("household_role", [
  "owner",
  "admin",
  "member",
]);

const unitKindEnum = pgEnum("unit_kind", [
  "unit",
  "kg",
  "g",
  "liter",
  "ml",
  "pack",
  "bottle",
  "box",
  "other",
]);

const shoppingSessionStatusEnum = pgEnum("shopping_session_status", [
  "active",
  "completed",
  "cancelled",
]);

const shoppingItemSourceEnum = pgEnum("shopping_item_source", [
  "base",
  "ongoing",
]);

const shoppingItemStatusEnum = pgEnum("shopping_item_status", [
  "pending",
  "done",
  "skipped",
]);

const productImportStatusEnum = pgEnum("product_import_status", [
  "pending",
  "completed",
  "failed",
  "not_implemented",
]);

const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    avatarUrl: text("avatar_url"),
    isAdmin: boolean("is_admin").notNull().default(false),
    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  }),
);

const households = pgTable(
  "households",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: text("name").notNull(),

    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    createdByIdx: index("households_created_by_idx").on(table.createdBy),
  }),
);

const householdMembers = pgTable(
  "household_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, {
        onDelete: "cascade",
      }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    role: householdRoleEnum("role").notNull().default("member"),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("household_members_household_id_idx").on(
      table.householdId,
    ),
    userIdx: index("household_members_user_id_idx").on(table.userId),
    householdUserUniqueIdx: uniqueIndex(
      "household_members_household_user_unique_idx",
    ).on(table.householdId, table.userId),
  }),
);

const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, {
        onDelete: "cascade",
      }),

    name: text("name").notNull(),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("categories_household_id_idx").on(table.householdId),
    householdNameUniqueIdx: uniqueIndex(
      "categories_household_name_unique_idx",
    ).on(table.householdId, table.name),
  }),
);

const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, {
        onDelete: "cascade",
      }),

    title: text("title").notNull(),

    imageKey: text("image_key"),
    imageUrl: text("image_url"),

    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),

    unitKind: unitKindEnum("unit_kind").notNull().default("unit"),

    defaultQuantityAmount: numeric("default_quantity_amount", {
      precision: 12,
      scale: 3,
      mode: "number",
    }).notNull(),

    defaultQuantityUnit: unitKindEnum("default_quantity_unit")
      .notNull()
      .default("unit"),

    sourceUrl: text("source_url"),

    metadata: jsonb("metadata").$type<Record<string, unknown>>(),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("products_household_id_idx").on(table.householdId),
    categoryIdx: index("products_category_id_idx").on(table.categoryId),
    householdTitleUniqueIdx: uniqueIndex(
      "products_household_title_unique_idx",
    ).on(table.householdId, table.title),
  }),
);

const productImportRequests = pgTable(
  "product_import_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, {
        onDelete: "cascade",
      }),

    requestedBy: uuid("requested_by").references(() => users.id, {
      onDelete: "set null",
    }),

    url: text("url").notNull(),

    status: productImportStatusEnum("status")
      .notNull()
      .default("not_implemented"),

    parsedData: jsonb("parsed_data").$type<{
      title?: string;
      imageUrl?: string;
      categoryName?: string;
      unitKind?: string;
      defaultQuantityAmount?: number;
      defaultQuantityUnit?: string;
    }>(),

    errorMessage: text("error_message"),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("product_import_requests_household_id_idx").on(
      table.householdId,
    ),
    requestedByIdx: index("product_import_requests_requested_by_idx").on(
      table.requestedBy,
    ),
    statusIdx: index("product_import_requests_status_idx").on(table.status),
  }),
);

const baseLists = pgTable(
  "base_lists",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, {
        onDelete: "cascade",
      }),

    name: text("name").notNull(),

    isEnabled: boolean("is_enabled").notNull().default(true),

    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("base_lists_household_id_idx").on(table.householdId),
    createdByIdx: index("base_lists_created_by_idx").on(table.createdBy),
    householdNameUniqueIdx: uniqueIndex(
      "base_lists_household_name_unique_idx",
    ).on(table.householdId, table.name),
  }),
);

const baseListItems = pgTable(
  "base_list_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, {
        onDelete: "cascade",
      }),

    baseListId: uuid("base_list_id")
      .notNull()
      .references(() => baseLists.id, {
        onDelete: "cascade",
      }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    quantityAmount: numeric("quantity_amount", {
      precision: 12,
      scale: 3,
      mode: "number",
    }).notNull(),

    quantityUnit: unitKindEnum("quantity_unit").notNull().default("unit"),

    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("base_list_items_household_id_idx").on(
      table.householdId,
    ),
    baseListIdx: index("base_list_items_base_list_id_idx").on(table.baseListId),
    productIdx: index("base_list_items_product_id_idx").on(table.productId),
    createdByIdx: index("base_list_items_created_by_idx").on(table.createdBy),
    baseListProductUniqueIdx: uniqueIndex(
      "base_list_items_base_list_product_unique_idx",
    ).on(table.baseListId, table.productId),
  }),
);

const ongoingListItems = pgTable(
  "ongoing_list_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, {
        onDelete: "cascade",
      }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    quantityAmount: numeric("quantity_amount", {
      precision: 12,
      scale: 3,
      mode: "number",
    }).notNull(),

    quantityUnit: unitKindEnum("quantity_unit").notNull().default("unit"),

    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),

    carriedOverFromSessionId: uuid("carried_over_from_session_id"),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("ongoing_list_items_household_id_idx").on(
      table.householdId,
    ),
    productIdx: index("ongoing_list_items_product_id_idx").on(table.productId),
    createdByIdx: index("ongoing_list_items_created_by_idx").on(
      table.createdBy,
    ),
    carriedOverFromSessionIdx: index(
      "ongoing_list_items_carried_over_from_session_id_idx",
    ).on(table.carriedOverFromSessionId),
    householdProductUniqueIdx: uniqueIndex(
      "ongoing_list_items_household_product_unique_idx",
    ).on(table.householdId, table.productId),
  }),
);

const shoppingSessions = pgTable(
  "shopping_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, {
        onDelete: "cascade",
      }),

    status: shoppingSessionStatusEnum("status").notNull().default("active"),

    startedAt: numeric("started_at", { mode: "number" }).notNull(),
    completedAt: numeric("completed_at", { mode: "number" }),

    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),

    completedBy: uuid("completed_by").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("shopping_sessions_household_id_idx").on(
      table.householdId,
    ),
    statusIdx: index("shopping_sessions_status_idx").on(table.status),
    createdByIdx: index("shopping_sessions_created_by_idx").on(table.createdBy),
    completedByIdx: index("shopping_sessions_completed_by_idx").on(
      table.completedBy,
    ),

    oneActivePerHouseholdUniqueIdx: uniqueIndex(
      "shopping_sessions_one_active_per_household_unique_idx",
    )
      .on(table.householdId)
      .where(sql`${table.status} = 'active'`),
  }),
);

const shoppingSessionItems = pgTable(
  "shopping_session_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, {
        onDelete: "cascade",
      }),

    sessionId: uuid("session_id")
      .notNull()
      .references(() => shoppingSessions.id, {
        onDelete: "cascade",
      }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    baseListItemId: uuid("base_list_item_id").references(
      () => baseListItems.id,
      {
        onDelete: "set null",
      },
    ),

    ongoingListItemId: uuid("ongoing_list_item_id").references(
      () => ongoingListItems.id,
      {
        onDelete: "set null",
      },
    ),

    source: shoppingItemSourceEnum("source").notNull(),

    quantityAmount: numeric("quantity_amount", {
      precision: 12,
      scale: 3,
      mode: "number",
    }).notNull(),

    quantityUnit: unitKindEnum("quantity_unit").notNull().default("unit"),

    status: shoppingItemStatusEnum("status").notNull().default("pending"),

    statusUpdatedAt: numeric("status_updated_at", { mode: "number" }),
    statusUpdatedBy: uuid("status_updated_by").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("shopping_session_items_household_id_idx").on(
      table.householdId,
    ),
    sessionIdx: index("shopping_session_items_session_id_idx").on(
      table.sessionId,
    ),
    productIdx: index("shopping_session_items_product_id_idx").on(
      table.productId,
    ),
    statusIdx: index("shopping_session_items_status_idx").on(table.status),
    sourceIdx: index("shopping_session_items_source_idx").on(table.source),
    baseListItemIdx: index("shopping_session_items_base_list_item_id_idx").on(
      table.baseListItemId,
    ),
    ongoingListItemIdx: index(
      "shopping_session_items_ongoing_list_item_id_idx",
    ).on(table.ongoingListItemId),
    statusUpdatedByIdx: index(
      "shopping_session_items_status_updated_by_idx",
    ).on(table.statusUpdatedBy),

    sessionProductUniqueIdx: uniqueIndex(
      "shopping_session_items_session_product_unique_idx",
    ).on(table.sessionId, table.productId),
  }),
);

export {
  householdRoleEnum,
  unitKindEnum,
  shoppingSessionStatusEnum,
  shoppingItemSourceEnum,
  shoppingItemStatusEnum,
  productImportStatusEnum,
  users,
  households,
  householdMembers,
  categories,
  products,
  productImportRequests,
  baseLists,
  baseListItems,
  ongoingListItems,
  shoppingSessions,
  shoppingSessionItems,
};
