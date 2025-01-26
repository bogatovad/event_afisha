export const Services: Service[] = [
  { name: "События", illustration: "events", description: "Текст, который должен быть про события" },
  { name: "Места", illustration: "places", description: "Текст, который должен быть про места" },
  { name: "Организаторы", illustration: "organizers", description: "Текст, который должен быть про организаторов" },
  { name: "Путешествия", illustration: "trips", description: "Текст, который должен быть про путешествия" },
]

export const ServicesColors: string[] = [
  "#FF47FF",
  "#E1F44B",
  "#6361DD",
  "#930CFF",
]

export type Service = {
  name: "События" | "Места" | "Организаторы" | "Путешествия";
  illustration: "events" | "places" | "organizers" | "trips"
  description: string;
}
