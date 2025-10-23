"use client";

import { useState } from "react";
import { ShoppingCart, DollarSign, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { useGameState } from "@/app/lib/hooks";
import { CharacterService } from "@/app/lib/data/services/character.service";
import { EquipmentItemType, EquipmentSlot } from "@/app/lib/types";

type ShopTab = 'shop' | 'inventory';

export const EquipmentShop = () => {
    const { state, buyEquipment, sellEquipment, equipItem, unequipItem } = useGameState();
    const [activeTab, setActiveTab] = useState<ShopTab>('shop');
    const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | 'All'>('All');
    const [purchaseResult, setPurchaseResult] = useState<{ success: boolean; message: string } | null>(null);

    const shopInventory = CharacterService.getShopInventory();
    const playerInventory = state.inventory;
    const equippedItems = state.equipment;

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'Common': return 'text-nordic-text-muted';
            case 'Uncommon': return 'text-green-400';
            case 'Rare': return 'text-blue-400';
            case 'Epic': return 'text-purple-400';
            default: return 'text-nordic-text-muted';
        }
    };

    const getRarityBorder = (rarity: string) => {
        switch (rarity) {
            case 'Common': return 'border-nordic-border';
            case 'Uncommon': return 'border-green-400';
            case 'Rare': return 'border-blue-400';
            case 'Epic': return 'border-purple-400';
            default: return 'border-nordic-border';
        }
    };

    const handleBuyItem = (item: EquipmentItemType) => {
        const success = buyEquipment(item);
        if (success) {
            setPurchaseResult({
                success: true,
                message: `Purchased ${item.label} for ${item.price.toLocaleString()} SEK`,
            });
        } else {
            setPurchaseResult({
                success: false,
                message: `Not enough cash! Need ${item.price.toLocaleString()} SEK`,
            });
        }
        setTimeout(() => setPurchaseResult(null), 3000);
    };

    const handleSellItem = (item: EquipmentItemType) => {
        const sellPrice = Math.floor(item.price * 0.6);
        sellEquipment(item.id);
        setPurchaseResult({
            success: true,
            message: `Sold ${item.label} for ${sellPrice.toLocaleString()} SEK`,
        });
        setTimeout(() => setPurchaseResult(null), 3000);
    };

    const handleEquipItem = (item: EquipmentItemType) => {
        equipItem(item.id);
        setPurchaseResult({
            success: true,
            message: `Equipped ${item.label}`,
        });
        setTimeout(() => setPurchaseResult(null), 2000);
    };

    const handleUnequipItem = (slot: EquipmentSlot) => {
        unequipItem(slot);
        setPurchaseResult({
            success: true,
            message: `Unequipped ${slot}`,
        });
        setTimeout(() => setPurchaseResult(null), 2000);
    };

    const filteredShopItems = selectedSlot === 'All'
        ? shopInventory
        : shopInventory.filter(item => item.slot === selectedSlot);

    const filteredInventoryItems = selectedSlot === 'All'
        ? playerInventory
        : playerInventory.filter(item => item.slot === selectedSlot);

    return (
        <div className="bg-nordic-bg p-6">
            <div className="mb-6">
                <h2 className="text-nordic-text-primary text-2xl font-bold mb-2">Equipment Shop</h2>
                <p className="text-nordic-text-secondary">
                    Purchase weapons, armor, and vehicles for your operations
                </p>
                <div className="mt-4 flex items-center gap-2 text-nordic-text-primary">
                    <DollarSign className="h-5 w-5 text-nordic-accent" />
                    <span className="font-semibold">Available: {state.player.kontanter.toLocaleString()} SEK</span>
                </div>
            </div>

            {/* Purchase Result Notification */}
            {purchaseResult && (
                <div className={`mb-6 p-4 rounded-lg border ${
                    purchaseResult.success
                        ? 'bg-nordic-status-success/20 border-nordic-status-success'
                        : 'bg-nordic-status-danger/20 border-nordic-status-danger'
                }`}>
                    <p className={`font-semibold flex items-center gap-2 ${
                        purchaseResult.success ? 'text-nordic-status-success' : 'text-nordic-status-danger'
                    }`}>
                        {purchaseResult.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        {purchaseResult.message}
                    </p>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('shop')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                        activeTab === 'shop'
                            ? 'bg-nordic-accent text-white'
                            : 'bg-nordic-bg-dark text-nordic-text-secondary hover:bg-nordic-border'
                    }`}
                >
                    Shop
                </button>
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                        activeTab === 'inventory'
                            ? 'bg-nordic-accent text-white'
                            : 'bg-nordic-bg-dark text-nordic-text-secondary hover:bg-nordic-border'
                    }`}
                >
                    Inventory ({playerInventory.length})
                </button>
            </div>

            {/* Slot Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {(['All', 'Weapon', 'Armor', 'Accessory', 'Vehicle'] as const).map((slot) => (
                    <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedSlot === slot
                                ? 'bg-nordic-accent text-white'
                                : 'bg-nordic-bg-dark text-nordic-text-secondary hover:bg-nordic-border'
                        }`}
                    >
                        {slot}
                    </button>
                ))}
            </div>

            {/* Shop Tab */}
            {activeTab === 'shop' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredShopItems.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-nordic-bg-dark p-4 rounded-lg border-2 ${getRarityBorder(item.rarity)} hover:border-nordic-accent transition-colors`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-nordic-text-primary font-bold">{item.label}</h3>
                                    <p className="text-xs text-nordic-text-muted">{item.slot}</p>
                                </div>
                                <span className={`text-xs font-semibold ${getRarityColor(item.rarity)}`}>
                                    {item.rarity}
                                </span>
                            </div>

                            <p className="text-nordic-text-secondary text-sm mb-4">{item.stats}</p>

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-nordic-text-primary font-bold text-lg">
                                    {item.price.toLocaleString()} SEK
                                </span>
                            </div>

                            <button
                                onClick={() => handleBuyItem(item)}
                                disabled={state.player.kontanter < item.price}
                                className="w-full py-2 bg-nordic-accent hover:bg-nordic-accent-muted text-white font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Purchase
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
                <>
                    {/* Currently Equipped */}
                    <div className="mb-6">
                        <h3 className="text-nordic-text-primary text-xl font-semibold mb-4">Currently Equipped</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {(['Weapon', 'Armor', 'Accessory', 'Vehicle'] as EquipmentSlot[]).map((slot) => {
                                const item = equippedItems.find(e => e.slot === slot);
                                return (
                                    <div
                                        key={slot}
                                        className={`bg-nordic-bg-dark p-4 rounded-lg border-2 ${
                                            item ? getRarityBorder(item.rarity) : 'border-nordic-border'
                                        }`}
                                    >
                                        <p className="text-xs text-nordic-text-muted mb-2">{slot}</p>
                                        {item ? (
                                            <>
                                                <h4 className="text-nordic-text-primary font-bold mb-1">{item.label}</h4>
                                                <p className="text-nordic-text-secondary text-xs mb-3">{item.stats}</p>
                                                <button
                                                    onClick={() => handleUnequipItem(slot)}
                                                    className="w-full py-1 text-xs bg-nordic-border hover:bg-nordic-accent text-nordic-text-primary hover:text-white rounded transition-colors"
                                                >
                                                    Unequip
                                                </button>
                                            </>
                                        ) : (
                                            <p className="text-nordic-text-muted text-sm">Empty slot</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Owned Items */}
                    <div>
                        <h3 className="text-nordic-text-primary text-xl font-semibold mb-4">Owned Items</h3>
                        {filteredInventoryItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredInventoryItems.map((item) => {
                                    const sellPrice = Math.floor(item.price * 0.6);
                                    return (
                                        <div
                                            key={item.id}
                                            className={`bg-nordic-bg-dark p-4 rounded-lg border-2 ${getRarityBorder(item.rarity)}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-nordic-text-primary font-bold">{item.label}</h3>
                                                    <p className="text-xs text-nordic-text-muted">{item.slot}</p>
                                                </div>
                                                <span className={`text-xs font-semibold ${getRarityColor(item.rarity)}`}>
                                                    {item.rarity}
                                                </span>
                                            </div>

                                            <p className="text-nordic-text-secondary text-sm mb-4">{item.stats}</p>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEquipItem(item)}
                                                    className="flex-1 py-2 bg-nordic-accent hover:bg-nordic-accent-muted text-white font-medium rounded-lg transition-colors text-sm"
                                                >
                                                    Equip
                                                </button>
                                                <button
                                                    onClick={() => handleSellItem(item)}
                                                    className="flex-1 py-2 bg-nordic-border hover:bg-nordic-accent text-nordic-text-primary hover:text-white font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
                                                    title={`Sell for ${sellPrice.toLocaleString()} SEK`}
                                                >
                                                    <TrendingUp className="h-3 w-3" />
                                                    {sellPrice.toLocaleString()}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-nordic-bg-dark p-8 rounded-lg border border-nordic-border text-center">
                                <p className="text-nordic-text-muted">No items in inventory</p>
                                <p className="text-nordic-text-secondary text-sm mt-2">Purchase items from the shop to get started</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
