import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

const NavigationItem = ({ item }: { item: { icon: LucideIcon; label: string } }) => {
    const { icon: Icon, label } = item;

    return (
        <Button
            variant="ghost"
            className="w-full justify-start text-[#B8A99A] hover:text-[#D4C5B2] hover:bg-[#2A241D]"
        >
            <Icon className="mr-2 h-4 w-4" />
            {label}
        </Button>
    );
};

export { NavigationItem }