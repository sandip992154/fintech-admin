/**
 * Unified Create Customer Component
 * Uses the UnifiedMemberForm with customer configuration
 */
import React from "react";
import UnifiedMemberForm from "../UnifiedMemberForm";

const CreateCustomerUnified = ({ onSubmit }) => {
  return <UnifiedMemberForm memberType="customer" onSubmit={onSubmit} />;
};

export default CreateCustomerUnified;
