export type YatriDetails = {
  yatriId: number; // id: 001-001 <hotiId>-<yatriId>
  dateOfBirth: Date;
  fullName: string;
  gender: "Male" | "Female";
  idProof: string;
  mobile: string;
  profilePicture: string;
  ticketType: "LABHARTI" | "HOTI" | "EXTRA" | "CHILD";
};
