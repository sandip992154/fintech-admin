/**
 * Retail Members Management Component
 * Optimized and refactored using BaseMemberComponent
 */
import React from "react";
import BaseMemberComponent from "../../components/members/BaseMemberComponent";
import SchemeManager from "../../components/members/retailer/SchemeManager";

export const Retail = () => {
  return (
    <BaseMemberComponent
      memberType="retailer"
      SchemeManagerComponent={SchemeManager}
    />
  );
};
