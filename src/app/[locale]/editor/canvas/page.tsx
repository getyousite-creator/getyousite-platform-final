"use client";

import React, { useEffect, useState } from 'react';
import { ComponentLibrary } from '@/components/engine/ComponentLibrary';
import { ElementState } from '@/features/editor/store/useEditorStore';

/**
 * SOVEREIGN CANVAS KERNEL v3.2.2
 * An isolated, React-powered rendering environment for the SVE.
 * Communicates with the Shell via PostMessage Protocol.
 */
export default function EditorCanvas() {
    const [entities, setEntities] = useState<Record<string, ElementState>>({});
    const [rootIds, setRootIds] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data;

            switch (type) {
                case 'SYNC_STATE':
                    setEntities(payload.entities);
                    setRootIds(payload.rootIds);
                    setSelectedId(payload.selectedId);
                    break;
                case 'SELECT_ELEMENT':
                    setSelectedId(payload.id);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        // Notify Shell that Kernel is Ready
        window.parent.postMessage({ type: 'KERNEL_READY' }, '*');

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {rootIds.map((id) => {
                const entity = entities[id];
                if (!entity) return null;

                // Custom renderer for Sovereign Sections
                if (entity.metadata?.type) {
                    return (
                        <div
                            key={id}
                            id={id}
                            onClick={(e) => {
                                e.stopPropagation();
                                window.parent.postMessage({ type: 'SELECT_ELEMENT', id }, '*');
                            }}
                            className={`relative group cursor-pointer ${selectedId === id ? 'outline-2 outline-neon-lime outline-solid' : 'hover:outline-1 hover:outline-neon-lime/30 hover:outline-solid'}`}
                        >
                            <ComponentLibrary
                                id={id}
                                type={entity.metadata.type}
                                content={entity.metadata.data}
                                primaryColor="#bef264"
                                isEditable={false} // Managed by SVE Shell
                            />
                            {selectedId === id && (
                                <div className="absolute top-0 right-0 bg-neon-lime text-black text-[8px] font-black px-2 py-1 uppercase z-50">
                                    SEC_{id}
                                </div>
                            )}
                        </div>
                    );
                }

                // Fallback for raw entities
                const Tag = entity.tag as any;
                return (
                    <Tag
                        key={id}
                        id={id}
                        className={entity.classes.join(' ')}
                        style={entity.styles}
                        onClick={(e: any) => {
                            e.stopPropagation();
                            window.parent.postMessage({ type: 'SELECT_ELEMENT', id }, '*');
                        }}
                    >
                        {entity.content}
                    </Tag>
                );
            })}
        </div>
    );
}
