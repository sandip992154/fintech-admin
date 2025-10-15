/**
 * WhiteLabel Members Management Component
 * Optimized and refactored using BaseMemberComponent
 */
import React from "react";
import BaseMemberComponent from "../../components/members/BaseMemberComponent";
import SchemeManager from "../../components/members/whitelabel/SchemeManager";
import StockTableForm from "../../components/members/whitelabel/StockTableForm";

export const WhiteLabel = () => {
  return (
    <BaseMemberComponent
      memberType="whitelabel"
      SchemeManagerComponent={SchemeManager}
      StockManagerComponent={StockTableForm}
    />
  );
};
