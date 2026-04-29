'use client';

import React, { useState, useEffect } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getSkillByName, type SkillData } from "@/lib/skills";
import { Modal } from "@/components/ui/modal";
import { Info } from "lucide-react";

const skillPillVariants = cva(
    "pill-base inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 border",
    {
        variants: {
            variant: {
                default: "pill-variant-skill-default",
                stat: "pill-variant-skill-stat",
                weapon: "pill-variant-skill-weapon",
                "unpromoted-lv1": "pill-variant-skill-unpromoted-lv1",
                "unpromoted-lv5": "pill-variant-skill-unpromoted-lv5",
                "unpromoted-lv10": "pill-variant-skill-unpromoted-lv10",
                "promoted-lv1": "pill-variant-skill-promoted-lv1",
                "promoted-lv5": "pill-variant-skill-promoted-lv5",
                "promoted-lv10": "pill-variant-skill-promoted-lv10",
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

export { skillPillVariants };

export interface SkillPillProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof skillPillVariants> {
    skill: string;
    game?: string;
}

const SkillPill: React.FC<SkillPillProps> = ({
    skill,
    variant,
    size,
    game,
    className,
    ...props
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [skillData, setSkillData] = useState<SkillData | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!game) {
            setLoading(false);
            setSkillData(undefined);
            return;
        }
        setLoading(true);
        getSkillByName(skill, game).then((data) => {
            setSkillData(data);
            setLoading(false);
        });
    }, [skill, game]);

    let finalVariant = variant;
    if (!variant) {
        if (skill.startsWith('+')) {
            finalVariant = 'stat';
        } else if (['Swords', 'Lances', 'Axes', 'Bows', 'Light', 'Dark', 'Anima', 'Staves'].includes(skill)) {
            finalVariant = 'weapon';
        } else {
            finalVariant = 'default';
        }
    }

    const isClickable = !!skillData;

    return (
        <>
            <span
                className={cn(
                    skillPillVariants({ variant: finalVariant, size }),
                    isClickable ? 'cursor-pointer gap-1' : 'cursor-default',
                    className
                )}
                onClick={isClickable ? () => setIsModalOpen(true) : undefined}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(true); } : undefined}
                {...props}
            >
                {skill}
                {isClickable && (
                    <Info className="w-3 h-3 opacity-60" />
                )}
            </span>

            {isClickable && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="space-y-4 min-w-[250px] sm:min-w-[300px]">
                        <div className="flex items-center justify-between border-b pb-2 pr-8">
                            <h2 className="pill-modal-title">
                                {skillData!.name}
                            </h2>
                            <h4 className="pill-modal-subtitle">
                                {finalVariant === "stat" ? "Stat Bonus" : finalVariant === "weapon" ? "Weapon Type" : "Skill"}
                            </h4>
                        </div>
                        <p className="pill-modal-text">
                            {skillData!.description}
                        </p>
                        {skillData!.procCondition && (
                            <div className="text-sm">
                                <span className="pill-modal-label">Condition: </span>
                                <span className="pill-modal-text">{skillData!.procCondition}</span>
                            </div>
                        )}
                        {skillData!.procChance && (
                            <div className="text-sm">
                                <span className="pill-modal-label">Proc Chance: </span>
                                <span className="pill-modal-text">{skillData!.procChance}</span>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default SkillPill;
