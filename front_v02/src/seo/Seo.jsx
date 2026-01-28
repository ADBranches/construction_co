// src/seo/Seo.jsx
import { Helmet } from "@vuer-ai/react-helmet-async"

const DEFAULTS = {
  title: "Brisk Farm Solutions & Construction Company",
  description:
    "Leaders in integrated agro-systems, modern construction, biogas systems, livestock farming, and crop production in Uganda.",
  siteName: "Brisk Farm Solutions & Construction",
  type: "website",
  image: "/brand/hero.jpg",
  url: "https://briskfarmsolutions.com",
};

export default function Seo({
  title,
  description,
  image,
  url,
  type = "website",
}) {
  const pageTitle = title
    ? `${title} | ${DEFAULTS.siteName}`
    : DEFAULTS.title;

  const metaDescription = description || DEFAULTS.description;
  const metaImage = image || DEFAULTS.image;
  const metaUrl =
    url ||
    (typeof window !== "undefined" ? window.location.href : DEFAULTS.url);

  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: DEFAULTS.siteName,
    url: DEFAULTS.url,
    logo: DEFAULTS.image,
    description: DEFAULTS.description,
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={DEFAULTS.siteName} />
      <meta property="og:locale" content="en_UG" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* SEO Enhancements */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={metaUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdOrganization)}
      </script>
    </Helmet>
  );
}
