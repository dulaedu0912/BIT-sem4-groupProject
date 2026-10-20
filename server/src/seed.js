import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { Place } from './models/Place.js'
import { Admin } from './models/Admin.js'
import { ORIGIN, haversineKm } from './constants.js'

const SEED_PLACES = [
  {
    name: 'Henarathgoda Botanical Garden',
    category: 'Nature',
    description:
      "Historic botanical garden featuring Sri Lanka's first rubber tree, lush lawns, and walking paths.",
    coordinates: { latitude: 7.0990332, longitude: 79.9858291 },
    openingHours: '7:30 AM - 6:00 PM',
    travelTips: 'Visit early morning for cooler weather and bird activity.'
  },
  {
    name: 'Guruge Nature Park',
    category: 'Recreation',
    description:
      'Family theme park with mini-amusement rides, dinosaur exhibits, and historic replica villages.',
    coordinates: { latitude: 7.0672982, longitude: 79.9013432 },
    openingHours: '9:00 AM - 7:00 PM',
    travelTips: 'Weekdays are quieter; bring sun protection for the open areas.'
  },
  {
    name: 'Pilikuttuwa Forest & Cave Area',
    category: 'Nature',
    description:
      'Scenic forest site featuring over 90 natural drip-ledge rock caves and shaded walking trails.',
    coordinates: { latitude: 7.0645967, longitude: 80.0505404 },
    openingHours: '6:00 AM - 6:00 PM',
    travelTips: 'Wear shoes with good grip for the cave steps and rocky paths.'
  },
  {
    name: 'Muthurajawela Wetland Visitor Centre',
    category: 'Eco-Tourism',
    description:
      'Protected coastal wetland sanctuary offering guided boat tours through mangrove channels.',
    coordinates: { latitude: 7.078892, longitude: 79.8530225 },
    openingHours: '8:00 AM - 5:00 PM',
    travelTips: 'Boat tours are best booked ahead, especially on weekends.'
  },
  {
    name: 'Dutch Canal',
    category: 'Heritage',
    description:
      'Historic 17th-century canal built during the Dutch era, ideal for photography and scenic boat tours.',
    coordinates: { latitude: 7.1232484, longitude: 79.8470794 },
    openingHours: 'Open all day',
    travelTips: 'Early morning light is best for photography along the canal.'
  },
  {
    name: 'Kelaniya Raja Maha Viharaya',
    category: 'Religious',
    description:
      'Sacred historic temple famous for its stone carvings, grand stupa, and detailed wall paintings.',
    coordinates: { latitude: 6.9515273, longitude: 79.918674 },
    openingHours: '6:00 AM - 9:00 PM',
    travelTips: 'Dress modestly and remove shoes before entering the temple grounds.'
  },
  {
    name: "Upali's by Nawaloka",
    category: 'Dining',
    description:
      'Highly rated restaurant situated near Viharamahadevi Park, famous for traditional Sri Lankan rice & curry and local dishes.',
    coordinates: { latitude: 6.9126683, longitude: 79.8650715 },
    openingHours: '11:00 AM - 10:30 PM',
    travelTips: 'Try the rice and curry; portions are generous.'
  },
  {
    name: 'Beddagana Wetland Park',
    category: 'Eco-Tourism',
    description:
      'Urban wetland park with elevated wooden boardwalks, butterfly gardens, and bird-watching towers.',
    coordinates: { latitude: 6.8904487, longitude: 79.9090936 },
    openingHours: '6:00 AM - 6:00 PM',
    travelTips: 'Bring binoculars and insect repellent for the boardwalk.'
  },
  {
    name: 'Colombo National Museum',
    category: 'Heritage',
    description:
      "Sri Lanka's premier museum displaying royal regalia, ancient artifacts, and historical galleries.",
    coordinates: { latitude: 6.9104168, longitude: 79.8609194 },
    openingHours: '9:00 AM - 5:00 PM (closed on public holidays)',
    travelTips: 'Allow at least two hours to cover the main galleries.'
  },
  {
    name: 'Paradise Road The Gallery Café',
    category: 'Dining',
    description:
      "Iconic restaurant set in Geoffrey Bawa's former office, offering international cuisine and world-class desserts.",
    coordinates: { latitude: 6.8986979, longitude: 79.8548816 },
    openingHours: '10:00 AM - 11:00 PM',
    travelTips: 'Ask for a garden table and reserve ahead for dinner.'
  }
]

await mongoose.connect(process.env.MONGODB_URI);

for (const place of SEED_PLACES) {
  const distanceKm = haversineKm(ORIGIN, place.coordinates)
  await Place.updateOne(
    { name: place.name },
    { $set: { ...place, distanceKm } },
    { upsert: true, runValidators: true }
  )
}
console.log(`Seeded ${SEED_PLACES.length} places.`)

const email = (process.env.ADMIN_EMAIL).toLowerCase()
if (!(await Admin.findOne({ email }))) {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
  await Admin.create({ email, passwordHash })
  console.log(`Admin created: ${email}`)
} else {
  console.log(`Admin already exists: ${email}`)
}

await mongoose.disconnect()
