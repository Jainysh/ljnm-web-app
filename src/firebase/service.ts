import {
  setDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  Firestore,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getFirebaseFirestoreDB, storage } from ".";
import { labhartiDetails } from "../constants/labharti";
import { Hoti } from "../types/hoti";
import { HotiAllocationDetail } from "../types/hotiAllocationDetail";
import { YatriDetails } from "../types/yatriDetails";

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
  const passengerDetailRaw = querySnapShot.docs.map((doc) =>
    doc.data()
  ) as YatriDetails[];
  const passengerDetails = passengerDetailRaw.map((passenger) => ({
    ...passenger,
    dateOfBirth: passenger.dateOfBirth.toDate(),
  }));
  return passengerDetails;
};

export const addPassengerDetails = async (
  passengerDetail: YatriDetails,
  hotiAllocationDetail: HotiAllocationDetail,
  fileDate: any
): Promise<YatriDetails> => {
  console.log(passengerDetail);
  const db = await getFirebaseFirestoreDB();
  const storageFirebase = await storage;
  const path = `EventMaster/event-1/hotiAllocation/hoti-${hotiAllocationDetail.hotiId}/yatriDetails`;
  const yatriId = `${hotiAllocationDetail.hotiId
    .toString()
    .padStart(3, "0")}-${(hotiAllocationDetail.nextYatriId || 1)
    .toString()
    .padStart(3, "0")}`;
  return new Promise(async (resolve) => {
    const storageRef = ref(storageFirebase, `/${path}/${yatriId}`);
    const uploadTask = uploadBytesResumable(storageRef, fileDate);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        console.log("percent", percent);
      },
      (err) => console.log(err),
      () => {
        submitYatriDetails(
          db,
          path,
          yatriId,
          passengerDetail,
          hotiAllocationDetail.hotiId
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
              yatriId: yatriId,
              fullName: passengerDetail.fullName || "",
              gender: passengerDetail.gender || "Male",
              mobile: passengerDetail.mobile || "",
              ticketType: passengerDetail.ticketType,
              dateOfBirth: new Date(passengerDetail.dateOfBirth) || new Date(),
              idProof: passengerDetail.idProof || "",
              hotiId: hotiAllocationDetail.hotiId,
              profilePicture: `${path}/${yatriId}`,
            });
          })
          .catch((err) => console.log(err));
        // download url
        console.log("uploadTask", uploadTask);
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("imageURL", url);
        });
      }
    );
  });
};

export const editYatriById = async (
  yatriDetails: YatriDetails
): Promise<YatriDetails> => {
  const db = await getFirebaseFirestoreDB();
  const path = `EventMaster/event-1/hotiAllocation/hoti-${yatriDetails.hotiId}/yatriDetails`;
  return new Promise(async (resolve) => {
    submitYatriDetails(
      db,
      path,
      yatriDetails.yatriId,
      yatriDetails,
      yatriDetails.hotiId
    ).then(async (data) => {
      resolve(yatriDetails);
    });
  });
};

export const deleteYatriById = async (
  hotiId: number,
  yatriDetails: YatriDetails
) => {
  const db = await getFirebaseFirestoreDB();
  const storageFirebase = await storage;
  const path = `EventMaster/event-1/hotiAllocation/hoti-${hotiId}/yatriDetails`;
  return new Promise(async (resolve) => {
    if (yatriDetails.profilePicture) {
      const storageRef = ref(storageFirebase, yatriDetails.profilePicture);
      deleteObject(storageRef).then(async () => {
        console.log("asset deleted");
        const yatriDocRef = doc(db, path, yatriDetails.yatriId);
        await deleteDoc(yatriDocRef);
        resolve({
          success: true,
        });
      });
    } else {
      console.log("asset not found");
      const yatriDocRef = doc(db, path, yatriDetails.yatriId);
      await deleteDoc(yatriDocRef);
      resolve({
        success: true,
      });
    }
  });
};

function submitYatriDetails(
  db: Firestore,
  path: string,
  yatriId: string,
  passengerDetail: YatriDetails,
  hotiId: number
) {
  return setDoc(doc(db, path, yatriId), {
    yatriId: yatriId,
    fullName: passengerDetail.fullName || "",
    gender: passengerDetail.gender || "Male",
    mobile: passengerDetail.mobile || "",
    ticketType: passengerDetail.ticketType,
    dateOfBirth: new Date(passengerDetail.dateOfBirth) || new Date(),
    idProof: passengerDetail.idProof || "",
    hotiId: hotiId,
    profilePicture: `${path}/${yatriId}`,
  });
}

export const getImageDownloadUrl = async (refUrl: string) => {
  const imageRef = ref(await storage, refUrl);
  const image = await getDownloadURL(imageRef);
  return image;
};
