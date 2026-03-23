import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Hr,
} from '@react-email/components'

interface AutoResponseEmailProps {
  firstName: string
  locale: 'de' | 'en'
}

export function AutoResponseEmail({ firstName, locale }: AutoResponseEmailProps) {
  const name = firstName.split(' ')[0] // Use first name only

  if (locale === 'de') {
    return (
      <Html lang="de">
        <Head />
        <Body style={{ fontFamily: 'Georgia, serif', color: '#1A1814', background: '#FAF8F5' }}>
          <Container style={{ maxWidth: '560px', margin: '40px auto', padding: '0 24px' }}>
            <Text style={{ fontSize: '18px', lineHeight: '1.6' }}>
              Liebe/r {name},
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#6B6560' }}>
              Vielen Dank für deine Anfrage — ich freue mich sehr, von dir zu hören!
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#6B6560' }}>
              Ich melde mich innerhalb von 24 Stunden bei dir. Bis gleich!
            </Text>
            <Hr style={{ border: 'none', borderTop: '1px solid #E8E3DC', margin: '32px 0' }} />
            <Text style={{ fontSize: '14px', color: '#A09890' }}>
              Sha — Fotografin
              <br />
              Zürich & Umgebung
              <br />
              photosha.ch
            </Text>
          </Container>
        </Body>
      </Html>
    )
  }

  return (
    <Html lang="en">
      <Head />
      <Body style={{ fontFamily: 'Georgia, serif', color: '#1A1814', background: '#FAF8F5' }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto', padding: '0 24px' }}>
          <Text style={{ fontSize: '18px', lineHeight: '1.6' }}>
            Dear {name},
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#6B6560' }}>
            Thank you so much for your message — I'm really glad to hear from you!
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#6B6560' }}>
            I'll reply within 24 hours. Talk soon!
          </Text>
          <Hr style={{ border: 'none', borderTop: '1px solid #E8E3DC', margin: '32px 0' }} />
          <Text style={{ fontSize: '14px', color: '#A09890' }}>
            Sha — Photographer
            <br />
            Zürich & surroundings
            <br />
            photosha.ch
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
