import { HotiAllocationDetail } from "./hotiAllocationDetail";
import { YatriDetails } from "./yatriDetails";

export type BookingSummary = HotiAllocationDetail & {
  extraTicketYatri: YatriDetails[];
  hotiTicketYatri: YatriDetails[];
  labhartiTicketYatri: YatriDetails[];
  childTicketYatri: YatriDetails[];
};
