export const site = {
  name: "The Bark of the Town",
  legalName: "The Bark of the Town, Inc.",
  description:
    "One-on-one salon and mobile dog grooming in Chicago, with gentle care tailored to every coat, age, and temperament.",
  email: "tbottinc1@gmail.com",
  instagram: "https://www.instagram.com/tbottinc/",
  instagramLabel: "@TBOTTINC",
  address: {
    street: "1041 W Lawrence Avenue",
    city: "Chicago",
    region: "IL",
    postalCode: "60640",
    full: "1041 W Lawrence Avenue, Chicago, IL 60640",
    maps:
      "https://www.google.com/maps/search/?api=1&query=1041+W+Lawrence+Avenue+Chicago+IL+60640",
  },
  bookingNote:
    "Appointment requests are reviewed by our team. Your appointment is not confirmed until we reply.",
  /** Salon booking windows — Chicago local time. */
  hours: {
    open: "09:00",
    close: "18:00",
    label: "9:00 AM – 6:00 PM",
  },
} as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Salon" },
  { href: "/mobile-services", label: "Mobile" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export const services = [
  {
    id: "nails",
    title: "Nail trim",
    eyebrow: "Quick care",
    description: "Trim and gentle dremel when your pet is comfortable.",
    price: "From $20",
    image: "/images/services/nail-trim.png",
  },
  {
    id: "bath",
    title: "Bath & tidy",
    eyebrow: "Fresh & clean",
    description:
      "Hypoallergenic bath, careful drying, ear cleaning, and nail trim.",
    price: "From $65",
    image: "/images/services/bath.png",
  },
  {
    id: "fullgroom",
    title: "Full groom",
    eyebrow: "The full treatment",
    description:
      "A complete bath, haircut, hand-scissor finish, ears, and nails.",
    price: "From $85",
    image: "/images/services/full-groom.png",
  },
] as const;

export const salonPricing = {
  nails: [
    ["1 pet", "$20"],
    ["2 pets", "$30"],
    ["3 pets", "$40"],
    ["4 or more pets", "+$50"],
  ],
  addOns: [
    ["Ear Cleaning", "$5 - $10"],
    ["Paw and Pad trim", "$10"],
    ["Face Trim", "$15"],
    ["Sanitary Trim", "$15"],
    ["Teethbrush", "$10"],
    ["Anal Glands", "$15"],
  ],
  bath: [
    ["SMALL", "$65+"],
    ["MEDIUM", "$75+"],
    ["LARGE", "$85+"],
    ["LONG HAIR", "$10 - $20+"],
  ],
  groom: [
    ["Toy/Small", "$85+"],
    ["MEDIUM", "$100+"],
    ["LARGE", "$125+"],
    ["X-Large", "$140+"],
  ],
} as const;

/** Mobile starting prices — wording mirrors the live WordPress services page. */
export const mobilePricing = {
  bath: {
    title: "BATH ONLY",
    price: "$130.00",
    lead: "MOBILE SERVICES START@",
  },
  groom: {
    title: "Full Groom/HAIR CUT",
    price: "$145.00",
    lead: "MOBILE SERVICES START@",
  },
} as const;

export const galleryImages = [
  {
    src: "/images/gallery/1.jpg",
    alt: "Before and after grooming of a gray-and-white doodle",
  },
  {
    src: "/images/gallery/2.jpg",
    alt: "Before and after grooming of a fluffy cream dog",
  },
  {
    src: "/images/gallery/3.jpg",
    alt: "Before and after grooming of a small curly-coated dog",
  },
  {
    src: "/images/gallery/4.jpg",
    alt: "Before and after grooming of a white West Highland terrier",
  },
  {
    src: "/images/gallery/5.jpg",
    alt: "Before and after grooming of a long-haired small dog",
  },
  {
    src: "/images/gallery/6.jpg",
    alt: "Before and after grooming of a freshly trimmed dog",
  },
] as const;

export const policies = [
  {
    title: "Pickup & drop-off",
    body: "After the first grooming, pre-booked front-door pickup or drop-off is available for $5 per trip when access is arranged in advance.",
  },
  {
    title: "Arrival",
    body: "We will call or text 10–15 minutes before arrival. Please walk your pet first. Appointments are considered a no-show after a 15-minute wait.",
  },
  {
    title: "Cancellations",
    body: "Please give at least 24 hours' notice. Late cancellations may require a fee equal to the scheduled groom before another appointment is confirmed.",
  },
  {
    title: "Payment",
    body: "We accept cash and credit or debit cards. Card payments include a 3.5% processing fee.",
  },
] as const;
