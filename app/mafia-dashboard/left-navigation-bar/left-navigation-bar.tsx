import { Home, User, Users, Briefcase, Map, Shield } from "lucide-react";
import { NavigationItem } from "./navigation-item";

const navigationItems = [
    { icon: User, label: "Character" },
    { icon: Home, label: "Headquarters" },
    { icon: Users, label: "Family" },
    { icon: Briefcase, label: "Business" },
    { icon: Map, label: "Territory" },
    { icon: Shield, label: "Defense" },
];

const LeftNavigationBar = () => {
    return (
        <nav className="w-64 bg-[#1A150F] p-4 space-y-4">
            <div className="mb-8">
                <h2 className="text-[#D4C5B2] text-xl font-bold">Operations</h2>
            </div>

            <div className="space-y-2">
                {navigationItems.map((item) => (
                    <NavigationItem key={item.label} item={item} />
                ))}
            </div>
        </nav>
    );
};

export { LeftNavigationBar };
