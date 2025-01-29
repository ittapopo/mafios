import { Building, Car, Phone, Watch } from "lucide-react";
import { MaterialStatusItem } from "./material-status-item";

const MaterialStatus = () => {
    const materials = [
        { icon: <Car />, label: 'Vehicle', value: 'Rolls-Royce Phantom', status: 'Pristine' },
        { icon: <Building />, label: 'Residence', value: 'Upper East Side Penthouse', status: 'Secured' },
        { icon: <Phone />, label: 'Communications', value: 'Encrypted Satellite Phone', status: 'Active' },
        { icon: <Watch />, label: 'Accessories', value: 'Patek Philippe Watch', status: 'Pristine' },
    ];

    return (
        <div className="bg-[#1A150F] p-6 rounded-lg">
            <h3 className="text-[#D4C5B2] text-xl mb-4">Material Status</h3>
            <div className="space-y-4">
                {materials.map((item) => (
                    <MaterialStatusItem key={item.label} item={item} />
                ))}
            </div>
        </div>
    );
};

export { MaterialStatus }