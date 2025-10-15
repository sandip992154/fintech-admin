import React from "react";
import BaseMemberComponent from "../../components/members/BaseMemberComponent";
import SchemeManager from "../../components/members/customer/SchemeManager";

export const Customer = () => {
  return (
    <BaseMemberComponent
      memberType="customer"
      SchemeManagerComponent={SchemeManager}
    />
  );
};
