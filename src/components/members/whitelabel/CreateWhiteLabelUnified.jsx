/**
 * Unified Create White Label Component
 * Uses the UnifiedMemberForm with whitelabel configuration
 */
import UnifiedMemberForm from "../UnifiedMemberForm";

const CreateWhiteLabelUnified = ({ onSubmit }) => {
  return <UnifiedMemberForm memberType="whitelabel" onSubmit={onSubmit} />;
};

export default CreateWhiteLabelUnified;
