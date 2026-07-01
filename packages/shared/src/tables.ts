import {
  baseLists,
  baseListItems,
  categories,
  householdMembers,
  households,
  ongoingLists,
  ongoingListItems,
  productUsageStats,
  products,
  shoppingSessionItems,
  shoppingSessions,
  unitKindEnum,
  users,
} from "@myapp/db";

type TUser = Omit<typeof users.$inferSelect, "passwordHash">;
type TIUser = typeof users.$inferInsert;
type THousehold = typeof households.$inferSelect;
type TIHousehold = typeof households.$inferInsert;
type THouseholdMember = typeof householdMembers.$inferSelect;
type TIHouseholdMember = typeof householdMembers.$inferInsert;
type TProduct = typeof products.$inferSelect;
type TIProduct = typeof products.$inferInsert;
type TProductUsageStats = typeof productUsageStats.$inferSelect;
type TIProductUsageStats = typeof productUsageStats.$inferInsert;
type TCategory = typeof categories.$inferSelect;
type TICategory = typeof categories.$inferInsert;
type TBaseList = typeof baseLists.$inferSelect;
type TIBaseList = typeof baseLists.$inferInsert;
type TBaseListItem = typeof baseListItems.$inferSelect;
type TIBaseListItem = typeof baseListItems.$inferInsert;
type TOngoingList = typeof ongoingLists.$inferSelect;
type TIOngoingList = typeof ongoingLists.$inferInsert;
type TOngoingListItem = typeof ongoingListItems.$inferSelect;
type TIOngoingListItem = typeof ongoingListItems.$inferInsert;
type TShoppingSession = typeof shoppingSessions.$inferSelect;
type TIShoppingSession = typeof shoppingSessions.$inferInsert;
type TShoppingSessionItem = typeof shoppingSessionItems.$inferSelect;
type TIShoppingSessionItem = typeof shoppingSessionItems.$inferInsert;
type TUnitKind = (typeof unitKindEnum.enumValues)[number];

export type {
  TBaseListItem,
  TBaseList,
  TCategory,
  THousehold,
  THouseholdMember,
  TIBaseListItem,
  TIBaseList,
  TICategory,
  TIHousehold,
  TIHouseholdMember,
  TIOngoingList,
  TIOngoingListItem,
  TIProduct,
  TIProductUsageStats,
  TIShoppingSession,
  TIShoppingSessionItem,
  TIUser,
  TOngoingList,
  TOngoingListItem,
  TProduct,
  TProductUsageStats,
  TShoppingSession,
  TShoppingSessionItem,
  TUnitKind,
  TUser,
};
