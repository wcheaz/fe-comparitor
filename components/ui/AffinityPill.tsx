'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getAffinityByName, calculateSupportBonuses, type AffinityData } from "@/lib/affinities";
import { Modal } from "@/components/ui/modal";
import { Info } from "lucide-react";

const affinityPillVariants = cva(
    "pill-base inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 border",
    {
        variants: {
            variant: {
                default: "pill-variant-support-default",
                fire: "pill-variant-affinity-fire",
                thunder: "pill-variant-affinity-thunder",
                wind: "pill-variant-affinity-wind",
                ice: "pill-variant-affinity-ice",
                dark: "pill-variant-affinity-dark",
                light: "pill-variant-affinity-light",
                anima: "pill-variant-affinity-anima",
                water: "pill-variant-affinity-water",
                earth: "pill-variant-affinity-earth",
                heaven: "pill-variant-affinity-heaven",
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
                    affinityPillVariants({ variant: finalVariant, size }),
                    isClickable ? 'cursor-pointer gap-1' : 'cursor-default',
                    className
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
                        <h3 className="pill-modal-title">
                            {affinityData!.name} Affinity
                        </h3>
                        <p className="pill-modal-text">
                            {affinityData!.description}
                        </p>
                        
                        {game && (
                            <div className="space-y-3">
                                <h4 className="pill-modal-label">Support Bonuses</h4>
                                <p className="pill-modal-text">
                                    These bonuses are added per support level when fighting near the supported partner.
                                </p>
                                
                                {(['C', 'B', 'A'] as const).map(level => {
                                    const bonuses = calculateSupportBonuses(affinityData!, game, level);
                                    if (bonuses.length === 0) return null;

                                    return (
                                        <div key={level} className="border-l-4 border-fe-blue-300 pl-3">
                                            <h5 className="pill-modal-label">{level} Support</h5>
                                            <ul className="mt-1 space-y-1">
                                                {bonuses.map((bonus, index) => (
                                                    <li key={index} className="pill-modal-text">
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