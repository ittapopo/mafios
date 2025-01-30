import { FamilyStatus } from "./family-status/family-status";
import { MemberProfile } from "./member-profile/member-profile";

const FamilyContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FamilyStatus />
        <MemberProfile />
    </div>
);

export default FamilyContent;