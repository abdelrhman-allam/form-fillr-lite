import { Faker, en, ar, ja, es, fr, de, pt_BR } from '@faker-js/faker'

type FieldKey =
  | 'id' | 'name' | 'firstName' | 'lastName' | 'email' | 'phone'
  | 'username' | 'company' | 'jobTitle' | 'address' | 'city' | 'state'
  | 'zip' | 'country' | 'dob' | 'avatar'

export async function generateFakeUsers(count: number, fields: FieldKey[], locale = 'en') {
  // initialize a per-call faker instance with selected locale
  const selected = locale === 'ar' ? ar
    : locale === 'ja' ? ja
    : locale === 'es' ? es
    : locale === 'fr' ? fr
    : locale === 'de' ? de
    : locale === 'pt_BR' ? pt_BR
    : en
  const f = new Faker({ locale: [selected, en] })

  const rows: Record<string, any>[] = []
  for (let i = 0; i < count; i++) {
    const u: Record<string, any> = {}
    for (const fkey of fields) {
      switch (fkey) {
        case 'id': u.id = f.string.uuid(); break
        case 'name': u.name = f.person.fullName(); break
        case 'firstName': u.firstName = f.person.firstName(); break
        case 'lastName': u.lastName = f.person.lastName(); break
        case 'email': u.email = f.internet.email(); break
        case 'phone': u.phone = f.phone.number(); break
        case 'username': u.username = f.internet.userName(); break
        case 'company': u.company = f.company.name(); break
        case 'jobTitle': u.jobTitle = f.person.jobTitle(); break
        case 'address':
          u.address = `${f.location.streetAddress()}, ${f.location.city()}, ${f.location.state()} ${f.location.zipCode()}, ${f.location.country()}`
          break
        case 'city': u.city = f.location.city(); break
        case 'state': u.state = f.location.state(); break
        case 'zip': u.zip = f.location.zipCode(); break
        case 'country': u.country = f.location.country(); break
        case 'dob': u.dob = f.date.birthdate({ min: 18, max: 75, mode: 'age' }).toISOString().slice(0,10); break
        case 'avatar': u.avatar = f.image.avatar(); break
        default: u[fkey] = null
      }
    }
    rows.push(u)
  }
  return rows
}
