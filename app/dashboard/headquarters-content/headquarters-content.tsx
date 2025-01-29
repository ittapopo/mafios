import { OperationsCenter } from "./security-status/operations-center";
import { SecurityStatus } from "./security-status/security-status";


export const HeadquartersContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SecurityStatus />
        <OperationsCenter />
    </div>
);
