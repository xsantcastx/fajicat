import Script from "next/script";

const GA = process.env.NEXT_PUBLIC_GA_ID;

// Google Analytics 4. Renders nothing unless NEXT_PUBLIC_GA_ID is set.
export function Analytics() {
  if (!GA) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA}');`}
      </Script>
    </>
  );
}
