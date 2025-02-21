import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { countryFlag } from '@/config/countires';
import { domainName } from '@/config/config';
import { isGerman } from '@/libs/environment';

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
              height: '630px',
              width: '1200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              fontSize: '32px',
              fontWeight: 600
            }}
          >
            {domainName}
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    }

    const flag = country ? countryFlag(country) : '🌍';
    const checkoutText = isGerman ? "Entdecken" : "Discover";

    return new ImageResponse(
      (
        <div
          style={{
            height: '630px',
            width: '1200px',
            display: 'flex',
            backgroundColor: '#fff',
            padding: '40px',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '660px',
              height: '550px'
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {domainName}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em'
                }}
              >
                {checkoutText}
              </div>
              <div
                style={{
                  fontSize: '64px',
                  fontWeight: 'bold',
                  color: '#000',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontSize: '32px',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {flag} {city}
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              right: '-40px',
              top: '60px',
              width: '500px',
              height: '550px',
              display: 'flex',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              transform: 'rotate(-5deg)',
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scale(1.1)'
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#666'
                }}
              >
                No Image
              </div>
            )}
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