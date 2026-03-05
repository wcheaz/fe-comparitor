'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getMovementByName, type MovementData } from "@/lib/movements";
import { Modal } from "@/components/ui/modal";
import { Info } from "lucide-react";

const movementTypePillVariants = cva(
    "inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 border",
    {
        variants: {
            variant: {
                default: "bg-fe-blue-100 text-fe-blue-900 border-fe-blue-300 hover:bg-fe-blue-200",
                infantry: "bg-green-100 text-fe-blue-900 border-green-300 hover:bg-green-200",
                armored: "bg-gray-100 text-fe-blue-900 border-gray-300 hover:bg-gray-200",
                cavalry: "bg-amber-100 text-fe-blue-900 border-amber-300 hover:bg-amber-200",
                flying: "bg-sky-100 text-fe-blue-900 border-sky-300 hover:bg-sky-200",
                wyvern: "bg-purple-100 text-fe-blue-900 border-purple-300 hover:bg-purple-200",
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

export { movementTypePillVariants };

export interface MovementTypePillProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof movementTypePillVariants> {
    movementType: string;
    game?: string;
}

const MovementTypePill: React.FC<MovementTypePillProps> = ({
    movementType,
    variant,
    size,
    game,
    className,
    ...props
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const movementData = getMovementByName(movementType);

    // Determine variant based on movement type
    let finalVariant = variant;
    if (!variant) {
        const movementLower = movementType.toLowerCase();
        const validVariants = ["default", "infantry", "armored", "cavalry", "flying", "wyvern"];
        if (validVariants.includes(movementLower)) {
            finalVariant = movementLower as any;
        } else {
            finalVariant = "default";
        }
    }

    const isClickable = !!movementData;

    const handleClick = () => {
        if (isClickable) {
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <span
                className={cn(
                    movementTypePillVariants({ variant: finalVariant, size, className }),
                    isClickable ? 'cursor-pointer gap-1' : 'cursor-default'
                )}
                onClick={isClickable ? handleClick : undefined}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(true); } : undefined}
                {...props}
            >
                {movementType}
                {isClickable && (
                    <Info className="w-3 h-3 opacity-60" />
                )}
            </span>

            {isClickable && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-fe-blue-900">
                            {movementData!.name} Movement
                        </h3>
                        <p className="text-sm text-fe-blue-700">
                            {movementData!.description}
                        </p>
                        
                        {movementData!.abilities && (
                            <div>
                                <h4 className="font-semibold text-fe-blue-900">Abilities</h4>
                                <p className="text-sm text-fe-blue-700">
                                    {movementData!.abilities}
                                </p>
                            </div>
                        )}
                        
                        {movementData!.weaknesses && (
                            <div>
                                <h4 className="font-semibold text-fe-blue-900">Terrain Interactions</h4>
                                <p className="text-sm text-fe-blue-700">
                                    {movementData!.weaknesses}
                                </p>
                            </div>
                        )}
                        
                        {game && movementData!.gameSpecificDetails?.[game] && (
                            <div className="mt-3 pt-3 border-t border-fe-blue-200">
                                <h4 className="font-semibold text-fe-blue-900">Game Specific Details</h4>
                                <p className="text-sm text-fe-blue-700 bg-fe-blue-50 p-2 rounded">
                                    {movementData!.gameSpecificDetails[game]}
                                </p>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default MovementTypePill;