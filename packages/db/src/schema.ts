import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  index,
  integer,
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

const ongoingListStatusEnum = pgEnum("ongoing_list_status", [
  "active",
  "shopping",
  "finished",
]);

const ongoingListItemStatusEnum = pgEnum("ongoing_list_item_status", [
  "pending",
  "checked",
  "ignored",
  "discarded",
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

type TUserSettings = {
  defaultShoppingMode?: "list" | "swipe";
  compactShoppingList?: boolean;
  hapticsEnabled?: boolean;
  soundEnabled?: boolean;
  wakeLockEnabled?: boolean;
};

const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    avatarUrl: text("avatar_url"),
    isAdmin: boolean("is_admin").notNull().default(false),
    activeHouseholdId: uuid("active_household_id").references(
      (): AnyPgColumn => households.id,
      {
        onDelete: "set null",
      },
    ),
    settings: jsonb("settings")
      .$type<TUserSettings>()
      .notNull()
      .default({
        defaultShoppingMode: "list",
        compactShoppingList: true,
        hapticsEnabled: true,
        soundEnabled: false,
        wakeLockEnabled: true,
      }),
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

    position: integer("position").notNull().default(0),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("categories_household_id_idx").on(table.householdId),
    householdPositionIdx: index("categories_household_position_idx").on(
      table.householdId,
      table.position,
    ),
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

const productUsageStats = pgTable(
  "product_usage_stats",
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

    totalAddedToOngoingCount: numeric("total_added_to_ongoing_count", {
      mode: "number",
    })
      .notNull()
      .default(0),

    totalCheckedCount: numeric("total_checked_count", { mode: "number" })
      .notNull()
      .default(0),

    totalSkippedCount: numeric("total_skipped_count", { mode: "number" })
      .notNull()
      .default(0),

    totalDiscardedCount: numeric("total_discarded_count", { mode: "number" })
      .notNull()
      .default(0),

    lastAddedToOngoingAt: numeric("last_added_to_ongoing_at", {
      mode: "number",
    }),

    lastCheckedAt: numeric("last_checked_at", { mode: "number" }),
    lastSkippedAt: numeric("last_skipped_at", { mode: "number" }),
    lastDiscardedAt: numeric("last_discarded_at", { mode: "number" }),
    lastUsedAt: numeric("last_used_at", { mode: "number" }),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("product_usage_stats_household_id_idx").on(
      table.householdId,
    ),
    productIdx: index("product_usage_stats_product_id_idx").on(
      table.productId,
    ),
    householdLastUsedIdx: index(
      "product_usage_stats_household_last_used_idx",
    ).on(table.householdId, table.lastUsedAt),
    householdTotalAddedIdx: index(
      "product_usage_stats_household_total_added_idx",
    ).on(table.householdId, table.totalAddedToOngoingCount),
    householdTotalCheckedIdx: index(
      "product_usage_stats_household_total_checked_idx",
    ).on(table.householdId, table.totalCheckedCount),
    householdProductUniqueIdx: uniqueIndex(
      "product_usage_stats_household_product_unique_idx",
    ).on(table.householdId, table.productId),
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

const ongoingLists = pgTable(
  "ongoing_lists",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, {
        onDelete: "cascade",
      }),

    status: ongoingListStatusEnum("status").notNull().default("active"),

    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),

    shoppingStartedBy: uuid("shopping_started_by").references(() => users.id, {
      onDelete: "set null",
    }),

    shoppingStartedAt: numeric("shopping_started_at", { mode: "number" }),

    finishedBy: uuid("finished_by").references(() => users.id, {
      onDelete: "set null",
    }),

    finishedAt: numeric("finished_at", { mode: "number" }),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("ongoing_lists_household_id_idx").on(
      table.householdId,
    ),
    statusIdx: index("ongoing_lists_status_idx").on(table.status),
    createdByIdx: index("ongoing_lists_created_by_idx").on(table.createdBy),
    shoppingStartedByIdx: index("ongoing_lists_shopping_started_by_idx").on(
      table.shoppingStartedBy,
    ),
    finishedByIdx: index("ongoing_lists_finished_by_idx").on(
      table.finishedBy,
    ),
    oneOpenPerHouseholdUniqueIdx: uniqueIndex(
      "ongoing_lists_one_open_per_household_unique_idx",
    )
      .on(table.householdId)
      .where(sql`${table.status} in ('active', 'shopping')`),
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

    ongoingListId: uuid("ongoing_list_id")
      .notNull()
      .references(() => ongoingLists.id, {
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

    status: ongoingListItemStatusEnum("status").notNull().default("pending"),

    statusUpdatedAt: numeric("status_updated_at", { mode: "number" }),
    statusUpdatedBy: uuid("status_updated_by").references(() => users.id, {
      onDelete: "set null",
    }),

    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: numeric("created_at", { mode: "number" }).notNull(),
    updatedAt: numeric("updated_at", { mode: "number" }).notNull(),
  },
  (table) => ({
    householdIdx: index("ongoing_list_items_household_id_idx").on(
      table.householdId,
    ),
    ongoingListIdx: index("ongoing_list_items_ongoing_list_id_idx").on(
      table.ongoingListId,
    ),
    productIdx: index("ongoing_list_items_product_id_idx").on(table.productId),
    statusIdx: index("ongoing_list_items_status_idx").on(table.status),
    statusUpdatedByIdx: index("ongoing_list_items_status_updated_by_idx").on(
      table.statusUpdatedBy,
    ),
    createdByIdx: index("ongoing_list_items_created_by_idx").on(
      table.createdBy,
    ),
    ongoingListProductUniqueIdx: uniqueIndex(
      "ongoing_list_items_ongoing_list_product_unique_idx",
    ).on(table.ongoingListId, table.productId),
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
  ongoingListStatusEnum,
  ongoingListItemStatusEnum,
  shoppingItemSourceEnum,
  shoppingItemStatusEnum,
  productImportStatusEnum,
  users,
  households,
  householdMembers,
  categories,
  products,
  productImportRequests,
  productUsageStats,
  baseLists,
  baseListItems,
  ongoingLists,
  ongoingListItems,
  shoppingSessions,
  shoppingSessionItems,
};
