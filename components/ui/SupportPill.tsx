'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getAffinityByName, type AffinityData } from "@/lib/affinities";
import { Modal } from "@/components/ui/modal";
import { Info } from "lucide-react";

const supportPillVariants = cva(
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
                    supportPillVariants({ variant, size }),
                    'cursor-pointer gap-1',
                    className
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

            {/* Support Partner Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="space-y-3">
                    <h3 className="pill-modal-title">
                        Support Partner: {partnerName}
                    </h3>
                    <h4 className="pill-modal-subtitle">
                        Game Information
                    </h4>
                    <p className="pill-modal-text">
                        {game}
                    </p>
                    <div>
                        <h4 className="pill-modal-label">Support Details</h4>
                        <p className="pill-modal-text">
                            Support bonuses information will be displayed here.
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SupportPill;