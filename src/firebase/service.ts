import {
  setDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseFirestoreDB } from ".";
import { labhartiDetails } from "../constants/labharti";
import { Hoti } from "../types/hoti";
import { HotiAllocationDetail } from "../types/hotiAllocationDetail";
import { TicketType, YatriDetails } from "../types/yatriDetails";

// refernce function to add any new doc to firestore
// export const addHotiDetails = () => {
//   hotiDetails.forEach(async (data) => {
//     try {
//       const docRef = await setDoc(
//         doc(await getFirebaseFirestoreDB(), "hotiMaster", `hoti-${data.id}`),
//         {
//           city: data.city,
//           hindiName: data.hindiName,
//           mobile: data.phone,
//           name: data.name,
//           hotiId: data.id,
//         }
//       );
//       console.log("Document written with ID: ", docRef);
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }
//   });
//   console.log("here");
// };

// refernce function to add labharti details to firestore
export const addLabhartiDetails = () => {
  labhartiDetails.forEach(async (data) => {
    try {
      if (
        typeof data.labhartiTicketQuota !== "undefined" &&
        data.labhartiTicketQuota !== null
      ) {
        const docRef = await setDoc(
          doc(
            await getFirebaseFirestoreDB(),
            "EventMaster/event-1/labhartiDetails",
            `hoti-${data.hotiNo}`
          ),
          {
            labhartiType: data.labhartiType ?? "",
            hotiName: data.hotiName,
            seatsQuota: data.labhartiTicketQuota,
            contributionInRupees: data.contributionInRupees,
          }
        );
        console.log("Document written with ID: ", docRef);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });
  console.log("here");
};

// refernce function to add labharti details to firestore
export const addHotiAllocationDetails = () => {
  labhartiDetails.forEach(async (data) => {
    try {
      const docRef = await setDoc(
        doc(
          await getFirebaseFirestoreDB(),
          "EventMaster/event-1/hotiAllocation",
          `hoti-${data.hotiNo}`
        ),
        {
          hotiId: data.hotiNo.toString(),
          extraTicketQuota: 0,
          hotiTicketQuota: 2,
          labhartiTicketQuota: data.labhartiTicketQuota ?? 0,
        }
      );
      console.log("Document written with ID: ", docRef);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });
  console.log("here");
};

export const getHotiDetailById = async (id: number) => {
  const db = await getFirebaseFirestoreDB();
  const constraints = [where("hotiId", "==", id)];
  const q = query(collection(db, "hotiMaster"), ...constraints);
  const querySnapShot = await getDocs(q);
  if (querySnapShot.empty) {
    return {} as Hoti;
  }
  const [hotiDetails] = querySnapShot.docs.map((doc) => doc.data()) as Hoti[];
  return hotiDetails;
};

export const getHotiAllocationDetailById = async (id: number) => {
  const db = await getFirebaseFirestoreDB();
  const constraints = [where("hotiId", "==", id)];
  const q = query(
    collection(db, "EventMaster/event-1/hotiAllocation"),
    ...constraints
  );
  const querySnapShot = await getDocs(q);
  if (querySnapShot.empty) {
    return {} as HotiAllocationDetail;
  }
  const [hotiAllocationDetail] = querySnapShot.docs.map((doc) =>
    doc.data()
  ) as HotiAllocationDetail[];
  return hotiAllocationDetail;
};

export const getAllYatriDetailsById = async (hotiId: number) => {
  const db = await getFirebaseFirestoreDB();
  const path = `EventMaster/event-1/hotiAllocation/hoti-${hotiId}/yatriDetails`;
  const q = query(collection(db, path));
  const querySnapShot = await getDocs(q);
  if (querySnapShot.empty) {
    return [] as YatriDetails[];
  }
  const passengerDetaila = querySnapShot.docs.map((doc) =>
    doc.data()
  ) as YatriDetails[];
  return passengerDetaila;
};

export const addPassengerDetails = async (
  passengerDetail: YatriDetails,
  hotiAllocationDetail: HotiAllocationDetail,
  ticketType: TicketType
): Promise<YatriDetails> => {
  console.log(passengerDetail);
  const db = await getFirebaseFirestoreDB();

  const path = `EventMaster/event-1/hotiAllocation/hoti-${hotiAllocationDetail.hotiId}/yatriDetails`;
  return new Promise((resolve) => {
    setDoc(
      doc(
        db,
        path,
        `${hotiAllocationDetail.hotiId.toString().padStart(3, "0")}-${(
          hotiAllocationDetail.nextYatriId || 1
        )
          .toString()
          .padStart(3, "0")}`
      ),
      {
        yatriId: `${hotiAllocationDetail.hotiId.toString().padStart(3, "0")}-${(
          hotiAllocationDetail.nextYatriId || 1
        )
          ?.toString()
          .padStart(3, "0")}`,
        fullName: passengerDetail.fullName || "",
        gender: passengerDetail.gender || "Male",
        mobile: passengerDetail.mobile || "",
        ticketType: ticketType,
        dateOfBirth: new Date(passengerDetail.dateOfBirth) || new Date(),
        idProof: passengerDetail.idProof || "",
        hotiId: hotiAllocationDetail.hotiId,
      }
    )
      .then(async (data) => {
        const hotiAllocationDocRef = doc(
          db,
          "EventMaster/event-1/hotiAllocation",
          `hoti-${hotiAllocationDetail.hotiId}`
        );
        // update the next yatri id in hotiAllocation
        await updateDoc(hotiAllocationDocRef, {
          nextYatriId: (hotiAllocationDetail.nextYatriId || 1) + 1,
        });
        resolve({
          yatriId: `${hotiAllocationDetail.hotiId
            .toString()
            .padStart(3, "0")}-${(hotiAllocationDetail.nextYatriId || 1)
            ?.toString()
            .padStart(3, "0")}`,
          fullName: passengerDetail.fullName || "",
          gender: passengerDetail.gender || "Male",
          mobile: passengerDetail.mobile || "",
          ticketType: ticketType,
          dateOfBirth: new Date(passengerDetail.dateOfBirth) || new Date(),
          idProof: passengerDetail.idProof || "",
          hotiId: hotiAllocationDetail.hotiId,
          profilePicture: "",
        });
      })
      .catch((err) => console.log(err));
  });
};
