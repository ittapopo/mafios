import { Button } from "@/components/ui/button"
import { LogIn, UserPlus } from "lucide-react"

const HomepageNavBar = () => {
    return (
        <nav className="bg-[#1A150F] p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-[#D4C5B2] text-2xl font-bold">Mafios</h1>
                <div className="space-x-4">
                    <Button
                        variant="ghost"
                        className="bg-[#8B7355] hover:bg-[#6B563D] text-[#D4C5B2]"
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                    </Button>
                    <Button
                        variant="ghost"
                        className="bg-[#8B7355] hover:bg-[#6B563D] text-[#D4C5B2]"
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export { HomepageNavBar }