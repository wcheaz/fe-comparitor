'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getMovementByName, type MovementData } from "@/lib/movements";
import { Modal } from "@/components/ui/modal";
import { Info } from "lucide-react";

const movementTypePillVariants = cva(
    "pill-base inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 border",
    {
        variants: {
            variant: {
                default: "pill-variant-movement-default",
                infantry: "pill-variant-movement-infantry",
                armored: "pill-variant-movement-armored",
                cavalry: "pill-variant-movement-cavalry",
                flying: "pill-variant-movement-flying",
                wyvern: "pill-variant-movement-wyvern",
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
                    movementTypePillVariants({ variant: finalVariant, size }),
                    isClickable ? 'cursor-pointer gap-1' : 'cursor-default',
                    className
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
                        <h3 className="pill-modal-title">
                            {movementData!.name} Movement
                        </h3>
                        <p className="pill-modal-text">
                            {movementData!.description}
                        </p>
                        
                        {movementData!.abilities && (
                            <div>
                                <h4 className="pill-modal-label">Abilities</h4>
                                <p className="pill-modal-text">
                                    {movementData!.abilities}
                                </p>
                            </div>
                        )}
                        
                        {movementData!.weaknesses && (
                            <div>
                                <h4 className="pill-modal-label">Terrain Interactions</h4>
                                <p className="pill-modal-text">
                                    {movementData!.weaknesses}
                                </p>
                            </div>
                        )}
                        
                        {game && movementData!.gameSpecificDetails?.[game] && (
                            <div className="mt-3 pt-3 border-t border-fe-blue-200">
                                <h4 className="pill-modal-label">Game Specific Details</h4>
                                <p className="pill-modal-text bg-fe-blue-50 p-2 rounded">
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