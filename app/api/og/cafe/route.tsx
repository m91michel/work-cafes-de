import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { countryFlag } from '@/config/countires';
import { domainName } from '@/config/config';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get dynamic params
    const name = searchParams.get('name');
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const imageUrl = searchParams.get('image');
    
    if (!name || !city) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              fontSize: 32,
              fontWeight: 600,
            }}
          >
            <div>{domainName}</div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    }

    const flag = country ? countryFlag(country) : '🌍';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            backgroundColor: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background image */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name || ''}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 0
              }}
            />
          )}
          
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              height: '100%',
              width: '100%',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0.95) 90%)',
              zIndex: 1
            }}
          />
          
          {/* Additional dark overlay at the bottom for better text contrast */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
                right: 0,
              height: '250px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
              zIndex: 1,
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '48px',
              position: 'relative',
              width: '100%',
              zIndex: 2
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '8px',
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: 48,
                color: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {flag} {city}
            </div>
            <div
              style={{
                fontSize: 32,
                color: 'rgba(255, 255, 255, 0.9)',
                marginTop: '24px',
              }}
            >
              {domainName}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    const error = e as Error;
    console.log(`${error.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 