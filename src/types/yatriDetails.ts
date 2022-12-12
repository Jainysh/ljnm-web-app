export type YatriDetails = {
  yatriId: string; // id: 001-001 <hotiId>-<yatriId>
  dateOfBirth: any;
  fullName: string;
  gender: "Male" | "Female";
  idProof: string;
  city: string;
  mobile: string;
  profilePicture: string;
  ticketType: TicketType;
  hotiId: number;
  trainSeat?: string;
  busSeat?: string;
  rajgiriRoom?: string;
  pawapuriRoom?: string;
  lachwadRoom?: string;
  bhagalpurRoom?: string;
  shikharjiRoom?: string;
};

export type TicketType = "LABHARTI" | "HOTI" | "EXTRA" | "CHILD";
