import { Heart, Home, Users, Map } from "lucide-react";
import { FamilyMemberItem } from "./family-member-item";

export const FamilyStatus = () => {
    const members = [
        { icon: <Heart />, label: 'Spouse', value: 'Sarah Johnson', status: 'Married 5y' },
        { icon: <Users />, label: 'Children', value: 'Emma & James', status: 'Ages 3, 5' },
        { icon: <Home />, label: 'Residence', value: 'Suburban House', status: 'Owned' },
        { icon: <Map />, label: 'Location', value: 'Portland, OR', status: 'Current' },
    ];

    return (
        <div className="bg-[#1A150F] p-6 rounded-lg">
            <h3 className="text-[#D4C5B2] text-xl mb-4">Family Status</h3>
            <div className="space-y-4">
                {members.map((item) => (
                    <FamilyMemberItem key={item.label} item={item} />
                ))}
            </div>
        </div>
    );
};