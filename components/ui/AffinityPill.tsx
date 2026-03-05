'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getAffinityByName, calculateSupportBonuses, type AffinityData } from "@/lib/affinities";
import { Modal } from "@/components/ui/modal";
import { Info } from "lucide-react";

const affinityPillVariants = cva(
    "inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 border",
    {
        variants: {
            variant: {
                default: "bg-fe-purple-100 text-fe-blue-900 border-fe-purple-300 hover:bg-fe-purple-200",
                fire: "bg-red-100 text-fe-blue-900 border-red-300 hover:bg-red-200",
                thunder: "bg-blue-100 text-fe-blue-900 border-blue-300 hover:bg-blue-200",
                wind: "bg-green-100 text-fe-blue-900 border-green-300 hover:bg-green-200",
                ice: "bg-cyan-100 text-fe-blue-900 border-cyan-300 hover:bg-cyan-200",
                dark: "bg-gray-100 text-fe-blue-900 border-gray-300 hover:bg-gray-200",
                light: "bg-yellow-100 text-fe-blue-900 border-yellow-300 hover:bg-yellow-200",
                anima: "bg-purple-100 text-fe-blue-900 border-purple-300 hover:bg-purple-200",
                water: "bg-indigo-100 text-fe-blue-900 border-indigo-300 hover:bg-indigo-200",
                earth: "bg-amber-100 text-fe-blue-900 border-amber-300 hover:bg-amber-200",
                heaven: "bg-pink-100 text-fe-blue-900 border-pink-300 hover:bg-pink-200",
            },
            size: {
                default: "h-6 py-1 px-2",
                sm: "h-5 px-1.5 text-xs",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export { affinityPillVariants };

export interface AffinityPillProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof affinityPillVariants> {
    affinityName: string;
    game?: string;
}

const AffinityPill: React.FC<AffinityPillProps> = ({
    affinityName,
    variant,
    size,
    game,
    className,
    ...props
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const affinityData = getAffinityByName(affinityName);

    // Determine variant based on affinity name
    let finalVariant = variant;
    if (!variant) {
        const affinityLower = affinityName.toLowerCase();
        const validVariants = ["default", "fire", "thunder", "wind", "ice", "dark", "light", "anima", "water", "earth", "heaven"];
        if (validVariants.includes(affinityLower)) {
            finalVariant = affinityLower as any;
        } else {
            finalVariant = "default";
        }
    }

    const isClickable = !!affinityData;

    const handleClick = () => {
        if (isClickable) {
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <span
                className={cn(
                    affinityPillVariants({ variant: finalVariant, size, className }),
                    isClickable ? 'cursor-pointer gap-1' : 'cursor-default'
                )}
                onClick={isClickable ? handleClick : undefined}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(true); } : undefined}
                {...props}
            >
                {affinityName}
                {isClickable && (
                    <Info className="w-3 h-3 opacity-60" />
                )}
            </span>

            {isClickable && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-fe-blue-900">
                            {affinityData!.name} Affinity
                        </h3>
                        <p className="text-sm text-fe-blue-700">
                            {affinityData!.description}
                        </p>
                        
                        {game && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-fe-blue-900">Support Bonuses</h4>
                                <p className="text-xs text-fe-blue-700">
                                    These bonuses are added per support level when fighting near the supported partner.
                                </p>
                                
                                {(['C', 'B', 'A'] as const).map(level => {
                                    const bonuses = calculateSupportBonuses(affinityData!, game, level);
                                    if (bonuses.length === 0) return null;

                                    return (
                                        <div key={level} className="border-l-4 border-fe-blue-300 pl-3">
                                            <h5 className="font-semibold text-fe-blue-900">{level} Support</h5>
                                            <ul className="mt-1 space-y-1">
                                                {bonuses.map((bonus, index) => (
                                                    <li key={index} className="text-sm text-fe-blue-700">
                                                        {bonus}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AffinityPill;