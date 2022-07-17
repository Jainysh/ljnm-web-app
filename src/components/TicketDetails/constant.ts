import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";

export const FormFields = (hotiAllocationDetail: HotiAllocationDetail) => {
  return {
    CHILD: {
      title: "Child details",
      subtitle:
        "Children below 5 years of age. No ticket fare shall be charged and no berth will be alloted.",
      seatQuota: -1,
      next: hotiAllocationDetail.labhartiTicketQuota
        ? "labhartiTickets"
        : "hotiTickets",
    },
    LABHARTI: {
      title: "Enter details",
      subtitle: "",
      seatQuota: hotiAllocationDetail.labhartiTicketQuota,
      next: "hotiTickets",
    },
    HOTI: {
      title: "Enter details",
      subtitle: "",
      seatQuota: hotiAllocationDetail.hotiTicketQuota,
      next: "extraTickets",
    },
    EXTRA: {
      title: "Enter details",
      subtitle: "",
      seatQuota: hotiAllocationDetail.extraTicketQuota,
      next: null,
    },
  };
};
