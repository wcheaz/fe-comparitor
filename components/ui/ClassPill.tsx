'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Info } from "lucide-react";
import { Class } from "@/types/unit";
import AbilityPill from '@/components/ui/AbilityPill';

const classPillVariants = "inline-flex items-center gap-1 rounded-full text-xs font-semibold px-2.5 py-1 bg-fe-blue-100 text-fe-blue-900 border border-fe-blue-300 hover:bg-fe-blue-200 cursor-pointer transition-colors duration-200";

export interface ClassPillProps {
    cls: Class;
    className?: string;
}

const ClassPill: React.FC<ClassPillProps> = ({
    cls,
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
                    classPillVariants,
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
                    <div className="flex items-center justify-between border-b pb-2">
                        <h2 className="text-2xl font-bold text-foreground">
                            {cls.name}
                        </h2>
                    </div>
                    
                    <div className="space-y-2">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Class Type</h3>
                            <p className="text-sm text-fe-blue-700 capitalize">{cls.type}</p>
                        </div>
                        
                        {cls.weapons && cls.weapons.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Weapons</h3>
                                <p className="text-sm text-fe-blue-700">{cls.weapons.join(', ')}</p>
                            </div>
                        )}
                        
                        {cls.movementType && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Movement Type</h3>
                                <p className="text-sm text-fe-blue-700">{cls.movementType}</p>
                            </div>
                        )}
                        
                        {cls.classAbilities && cls.classAbilities.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Class Abilities</h3>
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
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Description</h3>
                                <p className="text-sm text-fe-blue-700">{cls.description}</p>
                            </div>
                        )}
                        
                        
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ClassPill;