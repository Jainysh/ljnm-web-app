import { query, collection, where, getDocs } from "firebase/firestore";
import { getFirebaseFirestoreDB } from ".";
import { Hoti } from "../types/hoti";
// import { hotiDetails } from "../constants/hoti";

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

export const getHotiDetailById = async (id: number): Promise<Hoti> => {
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
