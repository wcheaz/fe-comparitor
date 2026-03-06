'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Info } from "lucide-react";
import { Class } from "@/types/unit";
import AbilityPill from '@/components/ui/AbilityPill';
import MovementTypePill from '@/components/ui/MovementTypePill';

const classPillVariants = cva(
    "pill-base inline-flex items-center gap-1 rounded-full text-xs font-semibold px-2.5 py-1 cursor-pointer transition-colors duration-200",
    {
        variants: {
            variant: {
                default: "pill-variant-class-default",
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

export interface ClassPillProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof classPillVariants> {
    cls: Class;
}

const ClassPill: React.FC<ClassPillProps> = ({
    cls,
    variant,
    size,
    className,
    ...props
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <span
                className={cn(
                    classPillVariants({ variant, size }),
                    className
                )}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
                {...props}
            >
                {cls.name}
                <Info className="w-3 h-3 opacity-60" />
            </span>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="space-y-4 min-w-[300px] sm:min-w-[400px]">
                    <div className="flex items-center justify-between border-b pb-2 pr-8">
                        <h2 className="pill-modal-title">
                            {cls.name}
                        </h2>
                        <h3 className="pill-modal-subtitle">
                            {cls.tier || cls.type}
                        </h3>
                    </div>

                    <div className="space-y-2">

                        {cls.weapons && cls.weapons.length > 0 && (
                            <div>
                                <h3 className="pill-modal-label mb-2">Weapons</h3>
                                <p className="pill-modal-text">{cls.weapons.join(', ')}</p>
                            </div>
                        )}

                        {cls.movementType && (
                            <div>
                                <h3 className="pill-modal-label mb-2">Movement Type</h3>
                                <MovementTypePill movementType={cls.movementType} game={cls.game} />
                            </div>
                        )}

                        {cls.classAbilities && cls.classAbilities.length > 0 && (
                            <div>
                                <h3 className="pill-modal-label mb-2">Class Abilities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {cls.classAbilities.map((ability, index) => (
                                        <AbilityPill
                                            key={index}
                                            ability={ability}
                                            game={cls.game}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {cls.description && (
                            <div>
                                <h3 className="pill-modal-label mb-2">Description</h3>
                                <p className="pill-modal-text">{cls.description}</p>
                            </div>
                        )}


                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ClassPill;