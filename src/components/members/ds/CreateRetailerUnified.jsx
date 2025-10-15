/**
 * Unified Create Distributor Component
 * Uses the UnifiedMemberForm with distributor configuration
 */
import UnifiedMemberForm from "../UnifiedMemberForm";

const CreateDistributorUnified = ({ onSubmit }) => {
  return <UnifiedMemberForm memberType="distributor" onSubmit={onSubmit} />;
};

export default CreateDistributorUnified;
