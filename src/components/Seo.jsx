import { useEffect } from "react";
import { getContent, profile } from "../data/content";
import { useLanguage } from "../context/LanguageContext";

const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
const LOCALE_PATHS = { "es-MX": "/es-mx/", en: "/en/" };

function setMeta(name, content, attribute = "name") {
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setLink(rel, href, hreflang) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    if (hreflang) tag.setAttribute("hreflang", hreflang);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

export default function Seo() {
  const { language } = useLanguage();
  const { seo } = getContent(language);

  useEffect(() => {
    const localeUrl = `${SITE_URL}${LOCALE_PATHS[language]}`;
    document.title = seo.title;
    document.documentElement.lang = language;

    setMeta("description", seo.description);
    setMeta("og:title", seo.title, "property");
    setMeta("og:description", seo.description, "property");
    setMeta("og:type", "profile", "property");
    setMeta("og:url", localeUrl, "property");
    setMeta("og:site_name", "Santiago Ortega", "property");
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setLink("canonical", localeUrl);

    Object.entries(LOCALE_PATHS).forEach(([locale, path]) => {
      setLink("alternate", `${SITE_URL}${path}`, locale);
    });
    setLink("alternate", `${SITE_URL}/`, "x-default");

    let schema = document.head.querySelector('script[data-seo-schema="portfolio"]');
    if (!schema) {
      schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.dataset.seoSchema = "portfolio";
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.role,
          email: `mailto:${profile.email}`,
          address: { "@type": "PostalAddress", addressCountry: "MX" },
          sameAs: [profile.github, profile.linkedin],
          url: localeUrl,
        },
        {
          "@type": "WebSite",
          name: seo.title,
          url: localeUrl,
          inLanguage: language,
        },
      ],
    });
  }, [language, seo]);

  return null;
}
