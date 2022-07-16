import {
  setDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { getFirebaseFirestoreDB } from ".";
import { hotiDetails } from "../constants/hoti";
import { labhartiDetails } from "../constants/labharti";
import { Hoti } from "../types/hoti";

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
      if(typeof data.labhartiTicketQuota !== 'undefined' && data.labhartiTicketQuota !== null )
      {
        const docRef = await setDoc(
          doc(await getFirebaseFirestoreDB(), "EventMaster/event-1/labhartiDetails", `hoti-${data.hotiNo}`),
          {
            labhartiType: data.labhartiType??"",
            hotiName: data.hotiName,
            seatsQuota: data.labhartiTicketQuota,
            contributionInRupees: data.contributionInRupees
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
          doc(await getFirebaseFirestoreDB(), "EventMaster/event-1/hotiAllocation", `hoti-${data.hotiNo}`),
          {
            hotiId: data.hotiNo.toString(),
            extraTicketQuota: 0,
            hotiTicketQuota: 2,
            labhartiTicketQuota: data.labhartiTicketQuota??0
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
  const q = query(collection(db, "EventMaster/event-1/hotiAllocation"),...constraints);
  const querySnapShot = await getDocs(q);
  if (querySnapShot.empty) {
    return null;
  }
  const [hotiDetails] = querySnapShot.docs.map((doc) => doc.data());
  return hotiDetails;
};
