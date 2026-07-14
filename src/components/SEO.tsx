import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    name?: string;
    type?: string;
    ogImage?: string;
    canonical?: string;
    robots?: string;
    productData?: any; // For Schema.org Product structured data
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    name = "first-auto",
    type = "website",
    ogImage = `${import.meta.env.VITE_SERVER}/images/logo.png`,
    canonical,
    robots = "index, follow",
    productData
}) => {
    const siteTitle = `${title} | ${name}`;
    const url = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name='description' content={description} />
            {keywords && <meta name='keywords' content={keywords} />}
            <meta name="robots" content={robots} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(productData ? {
                    "@context": "https://schema.org/",
                    "@type": "Product",
                    "name": productData.title,
                    "image": [
                        `${productData.img}`
                    ],
                    "description": productData.description,
                    "sku": productData._id,
                    "offers": {
                        "@type": "Offer",
                        "url": url,
                        "priceCurrency": "EGP",
                        "price": productData.price - (productData.discount || 0),
                        "availability": productData.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                    }
                } : {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": name,
                    "alternateName": title,
                    "description": description,
                    "url": url,
                })}
            </script>
        </Helmet>
    );
};