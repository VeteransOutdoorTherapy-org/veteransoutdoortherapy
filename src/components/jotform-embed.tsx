"use client";

import Script from "next/script";
import { useRef } from "react";
import { EmbedFallback } from "./embed-fallback";

const JOTFORM_ORIGIN = "https://form.jotform.com/";

declare global {
	interface Window {
		jotformEmbedHandler?: (selector: string, origin: string) => void;
	}
}

export function JotformEmbed({ formId, title }: { formId: string; title: string }) {
	const iframeId = `JotFormIFrame-${formId}`;
	const initialized = useRef(false);
	const initializeResize = () => {
		if (initialized.current || !window.jotformEmbedHandler) return;
		initialized.current = true;
		window.jotformEmbedHandler(`iframe[id='${iframeId}']`, JOTFORM_ORIGIN);
	};

	return (
		<div className="jotform-shell">
			<EmbedFallback href={`${JOTFORM_ORIGIN}${formId}`} label="Open it in a new tab." position="above" />
			<iframe
				id={iframeId}
				title={title}
				src={`${JOTFORM_ORIGIN}${formId}`}
				allow="geolocation; microphone; camera; fullscreen; payment"
				loading="eager"
				scrolling="no"
				onLoad={initializeResize}
			/>
			<Script
				id="jotform-embed-handler"
				src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js"
				strategy="afterInteractive"
				onLoad={initializeResize}
				onReady={initializeResize}
			/>
			<EmbedFallback href={`${JOTFORM_ORIGIN}${formId}`} label="Open it in a new tab." position="below" />
		</div>
	);
}
