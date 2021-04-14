import { NextSeo } from 'next-seo';
import React from 'react';

interface SEOProps {
  title: string
  description: string
  image?: string
}

function SEO({ title, description, image = 'https://imgur.com/q1svA5G.png' }: SEOProps) {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={
        {
          title,
          description,
          images: [
            {
              url: image,
              width: 600,
              height: 600,
              alt: 'Og Image Alt',
            }
          ]
        }
      }
      additionalLinkTags={
        [
          {
            rel: 'icon',
            href: '/favicon.ico'
          }
        ]
      }
      twitter={{
        handle: '@handle',
        site: '@site',
        cardType: 'summary',
      }}
    />
  );
}

export default SEO;