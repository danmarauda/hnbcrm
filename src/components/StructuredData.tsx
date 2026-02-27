import { Helmet } from 'react-helmet-async';

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "HNBCRM",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    },
    "operatingSystem": "Web",
    "description": "Multi-tenant CRM with human-AI collaboration. Manage leads, pipeline, contacts, and conversations with integrated AI agents.",
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
