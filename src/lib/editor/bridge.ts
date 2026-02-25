import { SiteBlueprint, Section } from "../schemas";
import { ElementState } from "@/features/editor/store/useEditorStore";

/**
 * SOVEREIGN GENETIC BRIDGE v3.2.2
 * Converts legacy SiteBlueprint (Layout-based) to Sovereign Entity Model (Flat Record-based).
 * This is the cornerstone of the Digital Empire Architecture unification.
 */
export function convertBlueprintToEntities(blueprint: SiteBlueprint): {
    entities: Record<string, ElementState>;
    rootIds: string[];
} {
    const entities: Record<string, ElementState> = {};
    const rootIds: string[] = [];

    // 1. Process Global Navigation as a root entity
    const navId = 'nav-global';
    entities[navId] = {
        id: navId,
        tag: 'nav',
        content: blueprint.navigation.logo,
        classes: ['sovereign-nav'],
        styles: {},
        parentId: null,
        childIds: [] // Links could be child entities in the future
    };
    rootIds.push(navId);

    // 2. Process Sections (The Layout)
    const sections = blueprint.layout || [];
    sections.forEach((section: Section) => {
        const entityId = section.id || `section-${Math.random().toString(36).substr(2, 9)}`;

        entities[entityId] = {
            id: entityId,
            tag: 'section',
            content: '', // Container content usually empty if using child logic
            classes: ['sovereign-section', section.type],
            styles: section.styles || {},
            parentId: null,
            childIds: [],
            // Metadata for the renderer to know which component to pick
            metadata: {
                type: section.type,
                data: section.content
            }
        };
        rootIds.push(entityId);
    });

    // 3. Process Footer
    const footerId = 'footer-global';
    entities[footerId] = {
        id: footerId,
        tag: 'footer',
        content: blueprint.footer.copyright,
        classes: ['sovereign-footer'],
        styles: {},
        parentId: null,
        childIds: []
    };
    rootIds.push(footerId);

    return { entities, rootIds };
}

/**
 * Reconstructs a Blueprint from Entities for persistence.
 */
export function convertEntitiesToBlueprint(
    entities: Record<string, ElementState>,
    rootIds: string[],
    originalBlueprint: SiteBlueprint
): SiteBlueprint {
    const nextBlueprint = structuredClone(originalBlueprint);

    // We only update the 'layout' for now as it maps to the main body entities
    const newLayout: Section[] = [];

    rootIds.forEach(id => {
        const entity = entities[id];
        if (entity && entity.metadata?.type) {
            newLayout.push({
                id: entity.id,
                type: entity.metadata.type as any,
                content: entity.metadata.data,
                styles: entity.styles,
                animation: 'fade-in'
            });
        }
    });

    nextBlueprint.layout = newLayout;
    nextBlueprint.timestamp = new Date().toISOString();

    return nextBlueprint;
}
