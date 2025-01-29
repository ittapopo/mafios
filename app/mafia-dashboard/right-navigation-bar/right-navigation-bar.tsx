import { Bell, Gift, Mail, MessageSquare, UserPlus } from "lucide-react";
import { NavigationItem } from "../../../components/navigation/navigation-item";


const navigationItems = [
    { icon: <MessageSquare />, label: 'Messages', route: 'messages', count: 3 },
    { icon: <Bell />, label: 'Notifications', route: 'notifications', count: 5 },
    { icon: <Mail />, label: 'Invites', route: 'invites', count: 2 },
    { icon: <UserPlus />, label: 'Recruitment', route: 'recruitment' },
    { icon: <Gift />, label: 'Rewards', route: 'rewards' },
];

export const RightNavigationBar = () => (
    <nav className="w-64 bg-[#1A150F] p-4 space-y-4">
        <div className="mb-8">
            <h2 className="text-[#D4C5B2] text-xl font-bold">Social</h2>
        </div>

        <div className="space-y-2">
            {navigationItems.map((item) => (
                <NavigationItem key={item.label} item={item} justifyBetween />
            ))}
        </div>
    </nav>
);