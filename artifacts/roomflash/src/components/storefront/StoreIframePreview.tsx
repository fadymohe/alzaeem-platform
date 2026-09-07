import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface StoreIframePreviewProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  reloadKey?: number | string;
}

export function StoreIframePreview({
  children,
  width = '100%',
  height = '100%',
  className = '',
  style = {},
  reloadKey = 0
}: StoreIframePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Reset doc content with clean RTL base
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
          <style>
            *, ::before, ::after { box-sizing: border-box; }
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              min-height: 100%;
              font-family: 'IBM Plex Sans Arabic', 'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              direction: rtl;
              text-align: right;
              background-color: transparent;
            }
            /* Clean custom scrollbar */
            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.4); border-radius: 9999px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.7); }
          </style>
        </head>
        <body class="selection:bg-teal-500 selection:text-white">
          <div id="preview-root"></div>
        </body>
      </html>
    `);
    doc.close();

    // Copy all style tags and stylesheets from main parent document head
    const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    parentStyles.forEach((node) => {
      doc.head.appendChild(node.cloneNode(true));
    });

    // Listen for any newly added styles in parent
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node.nodeName === 'STYLE' || (node.nodeName === 'LINK' && (node as HTMLLinkElement).rel === 'stylesheet'))
          ) {
            doc.head.appendChild(node.cloneNode(true));
          }
        });
      });
    });
    observer.observe(document.head, { childList: true });

    const root = doc.getElementById('preview-root');
    setMountNode(root);

    return () => {
      observer.disconnect();
    };
  }, [reloadKey]);

  return (
    <iframe
      ref={iframeRef}
      title="Live Store Preview"
      className={className}
      style={{
        width,
        height,
        border: 'none',
        display: 'block',
        backgroundColor: 'transparent',
        ...style
      }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
}

export default StoreIframePreview;
