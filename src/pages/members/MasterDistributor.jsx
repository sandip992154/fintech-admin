/**
 * Master Distributor Members Management Component
 * Optimized and refactored using BaseMemberComponent
 */
import React from "react";
import BaseMemberComponent from "../../components/members/BaseMemberComponent";
import SchemeManager from "../../components/members/mds/SchemeManager";
import StockTableForm from "../../components/members/mds/StockTableForm";

export const MasterDistributor = () => {
  return (
    <BaseMemberComponent
      memberType="mds"
      SchemeManagerComponent={SchemeManager}
      StockManagerComponent={StockTableForm}
    />
  );
};
