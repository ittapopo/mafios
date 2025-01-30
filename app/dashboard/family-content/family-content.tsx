import { FamilyDynasty } from "./family-dynasty/family-dynasty";
import { FamilyMembers } from "./family-members/family-members";

export const FamilyContent = () => (
    <div className="max-w-4xl mx-auto space-y-4">
        <FamilyDynasty />
        <FamilyMembers />
    </div>
);
export default FamilyContent;