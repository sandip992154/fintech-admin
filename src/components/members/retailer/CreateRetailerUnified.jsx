/**
 * Unified Create Retailer Component
 * Uses the UnifiedMemberForm with retailer configuration
 */
import UnifiedMemberForm from "../UnifiedMemberForm";

const CreateRetailerUnified = ({ onSubmit }) => {
  return <UnifiedMemberForm memberType="retailer" onSubmit={onSubmit} />;
};

export default CreateRetailerUnified;
