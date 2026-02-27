'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getAffinityByName, type AffinityData } from "@/lib/affinities";
import { Modal } from "@/components/ui/modal";
import { Info } from "lucide-react";

const supportPillVariants = cva(
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

export { supportPillVariants };

export interface SupportPillProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof supportPillVariants> {
    partnerName: string;
    game: string;
    onPartnerClick?: (partnerName: string) => void;
}

const SupportPill: React.FC<SupportPillProps> = ({
    partnerName,
    variant,
    size,
    game,
    onPartnerClick,
    className,
    ...props
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        if (onPartnerClick) {
            onPartnerClick(partnerName);
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <span
                className={cn(
                    supportPillVariants({ variant, size, className }),
                    'cursor-pointer gap-1'
                )}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
                {...props}
            >
                {partnerName}
                <Info className="w-3 h-3 opacity-60" />
            </span>

            {/* Basic modal for support info - this will be enhanced later */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-fe-blue-900">
                        Support Partner: {partnerName}
                    </h3>
                    <p className="text-sm text-fe-blue-700">
                        Support bonuses information will be displayed here.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Game: {game}
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default SupportPill;