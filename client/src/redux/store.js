import { configureStore } from "@reduxjs/toolkit";
import { openTabs } from "./features";
import {
  countryMasterApi, pageMasterApi, stateMasterApi,
  cityMasterApi, departmentMasterApi, employeeCategoryMasterApi,
  finYearMasterApi, rolesMasterApi, employeeMasterApi, userMasterApi,
  branchMasterApi, companyMasterApi, pageGroupMasterApi, productBrandMasterApi, productCategoryMasterApi, productMasterApi, partyMasterApi, partyCategoryMasterApi, purchaseBillApi, stockApi, salesBillApi, purchaseReturnApi, salesReturnApi, uomMasterApi
} from "./services"







const commonReducers = {
  openTabs,
  countryMaster: countryMasterApi.reducer,
  pageMaster: pageMasterApi.reducer,
  stateMaster: stateMasterApi.reducer,
  cityMaster: cityMasterApi.reducer,
  departmentMaster: departmentMasterApi.reducer,
  employeeCategoryMaster: employeeCategoryMasterApi.reducer,
  finYearMaster: finYearMasterApi.reducer,
  roleMaster: rolesMasterApi.reducer,
  userMaster: userMasterApi.reducer,
  employeeMaster: employeeMasterApi.reducer,
  branchMaster: branchMasterApi.reducer,
  companyMaster: companyMasterApi.reducer,
  pageGroupMaster: pageGroupMasterApi.reducer,
  productBrandMaster: productBrandMasterApi.reducer,
  productCategoryMaster: productCategoryMasterApi.reducer,
  productMaster: productMasterApi.reducer,
  partyMaster: partyMasterApi.reducer,
  partyCategoryMaster: partyCategoryMasterApi.reducer,
  purchaseBill: purchaseBillApi.reducer,
  stock: stockApi.reducer,
  salesBill: salesBillApi.reducer,
  purchaseReturn: purchaseReturnApi.reducer,
  salesReturn: salesReturnApi.reducer,
  uomMaster: uomMasterApi.reducer,

}
const commonMiddleware = [countryMasterApi.middleware,
pageMasterApi.middleware,
stateMasterApi.middleware,
cityMasterApi.middleware,
departmentMasterApi.middleware,
employeeCategoryMasterApi.middleware,
finYearMasterApi.middleware,
rolesMasterApi.middleware,
userMasterApi.middleware,
employeeMasterApi.middleware,
branchMasterApi.middleware,
companyMasterApi.middleware,
pageGroupMasterApi.middleware,
productBrandMasterApi.middleware,
productCategoryMasterApi.middleware,
productMasterApi.middleware,
partyMasterApi.middleware,
partyCategoryMasterApi.middleware,
purchaseBillApi.middleware,
stockApi.middleware,
salesBillApi.middleware,
purchaseReturnApi.middleware,
salesReturnApi.middleware,
uomMasterApi.middleware,
];




const store = configureStore({
  reducer: {
    ...commonReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(commonMiddleware),
});

export default store;