import { PassengerDetail } from "./pasengerDetail";

export type HotiAllocationDetail = {
  hotiId: number;
  extraTicketQuota: number;
  hotiTicketQuota: number;
  labhartiTicketQuota: number;
  yatriDetails: PassengerDetail[];
};
