/**
 * Structure of info about event
 */
export type Event = {
  id: number;
  name: string;
  description: string;
  image: string;
  contact: Contact[] | null;
  date: string;
  categories?: string[];
}

export type Contact = {
  [key: string]: string;
}
