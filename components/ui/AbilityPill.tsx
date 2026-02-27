'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getAbilityByName, type AbilityData } from "@/lib/abilities";
import { Modal } from "@/components/ui/modal";
import { Info } from "lucide-react";

const abilityPillVariants = cva(
    "inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 border",
    {
        variants: {
            variant: {
                default: "bg-fe-gold-100 text-fe-blue-900 border-fe-gold-300 hover:bg-fe-gold-200",
                stat: "bg-fe-blue-100 text-fe-blue-900 border-fe-blue-300 hover:bg-fe-blue-200",
                weapon: "bg-fe-green-100 text-fe-blue-900 border-fe-green-300 hover:bg-fe-green-200",
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

export { abilityPillVariants };

export interface AbilityPillProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof abilityPillVariants> {
    ability: string;
    game?: string;
}

const AbilityPill: React.FC<AbilityPillProps> = ({
    ability,
    variant,
    size,
    game,
    className,
    ...props
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const abilityData = getAbilityByName(ability);

    // Determine variant based on ability content
    let finalVariant = variant;
    if (!variant) {
        if (ability.startsWith('+')) {
            finalVariant = 'stat';
        } else if (['Swords', 'Lances', 'Axes', 'Bows', 'Light', 'Dark', 'Anima', 'Staves'].includes(ability)) {
            finalVariant = 'weapon';
        } else {
            finalVariant = 'default';
        }
    }

    const isClickable = !!abilityData;

    return (
        <>
            <span
                className={cn(
                    abilityPillVariants({ variant: finalVariant, size, className }),
                    isClickable ? 'cursor-pointer gap-1' : 'cursor-default'
                )}
                onClick={isClickable ? () => setIsModalOpen(true) : undefined}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(true); } : undefined}
                {...props}
            >
                {ability}
                {isClickable && (
                    <Info className="w-3 h-3 opacity-60" />
                )}
            </span>

            {isClickable && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-fe-blue-900">
                            {abilityData!.name}
                        </h3>
                        <p className="text-sm text-fe-blue-700">
                            {abilityData!.description}
                        </p>
                        {abilityData!.procCondition && (
                            <div className="text-sm">
                                <span className="font-semibold text-fe-blue-900">Condition: </span>
                                <span className="text-fe-blue-700">{abilityData!.procCondition}</span>
                            </div>
                        )}
                        {abilityData!.procChance && (
                            <div className="text-sm">
                                <span className="font-semibold text-fe-blue-900">Proc Chance: </span>
                                <span className="text-fe-blue-700">{abilityData!.procChance}</span>
                            </div>
                        )}
                        {game && abilityData!.gameSpecificDetails?.[game] && (
                            <div className="text-sm mt-2 p-2 bg-fe-gold-50 rounded border border-fe-gold-200">
                                <span className="text-fe-blue-700">{abilityData!.gameSpecificDetails[game]}</span>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AbilityPill;
