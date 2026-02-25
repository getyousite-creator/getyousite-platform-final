"use client";

import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { useLocale } from 'next-intl';

export default function SiteSandbox() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const entities = useEditorStore((state) => state.entities);
  const rootIds = useEditorStore((state) => state.rootIds);
  const selectedId = useEditorStore((state) => state.selectedId);
  const selectElement = useEditorStore((state) => state.selectElement);
  const locale = useLocale();

  // SYNC CIRCUIT
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const syncState = () => {
      iframe.contentWindow?.postMessage({
        type: 'SYNC_STATE',
        payload: { entities, rootIds, selectedId }
      }, '*');
    };

    // Push state to Kernel
    syncState();

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SELECT_ELEMENT') {
        selectElement(event.data.id);
      }
      if (event.data.type === 'KERNEL_READY') {
        syncState();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [entities, rootIds, selectedId, selectElement]);

  return (
    <div className="relative w-full h-full bg-zinc-950 rounded-t-2xl overflow-hidden border border-white/5 shadow-2xl">
      <iframe
        ref={iframeRef}
        id="kernel-sandbox"
        src={`/${locale}/editor/canvas`}
        className="w-full h-full border-none"
        title="Sovereign Site Renderer"
      />
    </div>
  );
}

function renderEntity(id: string, entities: Record<string, any>, doc: Document): HTMLElement | null {
  const data = entities[id];
  if (!data) return null;
  const el = doc.createElement(data.tag);
  el.id = data.id;
  el.className = data.classes.join(' ');
  el.innerHTML = data.content;
  el.setAttribute('data-editable', 'true');

  data.childIds.forEach((childId: string) => {
    const childEl = renderEntity(childId, entities, doc);
    if (childEl) el.appendChild(childEl);
  });

  return el;
}
