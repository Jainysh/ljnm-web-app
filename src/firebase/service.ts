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
  collectionGroup,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getFirebaseFirestoreDB, storage } from ".";
import { BookingSummary } from "../types/bookingSummary";
import { Hoti } from "../types/hoti";
import { HotiAllocationDetail } from "../types/hotiAllocationDetail";
import { YatriDetails } from "../types/yatriDetails";

// refernce function to add any new doc to firestore
// export const addHotiDetails = () => {
//   hotiDetails.forEach(async (data) => {
//       try {
//         const docRef = await setDoc(
//           doc(await getFirebaseFirestoreDB(), "hotiMaster", `hoti-${data.id}`),
//           {
//             city: data.city,
//             hindiName: data.hindiName,
//             mobile: data.phone,
//             name: data.name,
//             hotiId: +data.id,
//           }
//         );
//         console.log("Document written with ID: ", docRef);
//       } catch (e) {
//         console.error("Error adding document: ", e);
//       }
//     });
//   console.log("here");
// };

// refernce function to add labharti details to firestore
// export const addLabhartiDetails = () => {
//   labhartiDetails.forEach(async (data) => {
//     try {
//       if (
//         typeof data.labhartiTicketQuota !== "undefined" &&
//         data.labhartiTicketQuota !== null
//       ) {
//         const docRef = await setDoc(
//           doc(
//             await getFirebaseFirestoreDB(),
//             "EventMaster/event-1/labhartiDetails",
//             `hoti-${data.hotiId}`
//           ),
//           {
//             labhartiType: data.labhartiType || "",
//             hotiName: data.hotiName,
//             seatsQuota: data.labhartiTicketQuota,
//             contributionInRupees: data.contributionInRupees || 0,
//             hotiId: data.hotiId,
//           }
//         );
//         console.log("Document written with ID: ", docRef);
//       }
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }
//   });
//   console.log("here");
// };

// refernce function to add labharti details to firestore
// export const addHotiAllocationDetails = () => {
//   labhartiDetails.forEach(async (data) => {
//     try {
//       const docRef = await setDoc(
//         doc(
//           await getFirebaseFirestoreDB(),
//           "EventMaster/event-1/hotiAllocation",
//           `hoti-${data.hotiId}`
//         ),
//         {
//           hotiId: data.hotiId,
//           extraTicketQuota: data.extraTicketQuota,
//           hotiTicketQuota: data.hotiTicketQuota,
//           labhartiTicketQuota: data.labhartiTicketQuota,
//         }
//       );
//       console.log("Document written with ID: ", docRef);
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }
//   });
//   console.log("here");
// };

export const getHotiDetailsByMobileNumber = async (mobile: string) => {
  const constraints = [where("mobile", "==", mobile)];
  const db = await getFirebaseFirestoreDB();
  const q = query(collection(db, "hotiMaster"), ...constraints);
  const querySnapShot = await getDocs(q);
  if (querySnapShot.empty) {
    return {} as Hoti;
  }
  const [hotiDetails] = querySnapShot.docs.map((doc) => doc.data()) as Hoti[];
  return hotiDetails;
};

export const getHotiDetailById = async (id: number) => {
  try {
    const db = await getFirebaseFirestoreDB();
    const constraints = [where("hotiId", "==", id.toString())];
    const q = query(collection(db, "hotiMaster"), ...constraints);
    const querySnapShot = await getDocs(q);
    if (querySnapShot.empty) {
      return {} as Hoti;
    }
    const [hotiDetails] = querySnapShot.docs.map((doc) => doc.data()) as Hoti[];
    return hotiDetails;
  } catch (error) {
    return {} as Hoti;
  }
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

export const getBookingSummary = async (): Promise<BookingSummary[]> => {
  let bookingSummary: BookingSummary[] = [];
  let hotiAllocation: HotiAllocationDetail[] = [];
  const db = await getFirebaseFirestoreDB();
  const path = `EventMaster/event-1/hotiAllocation`;
  const q = query(collection(db, path));
  const querySnapShot = await getDocs(q);
  if (querySnapShot.empty) {
    return bookingSummary;
  } else {
    const data = querySnapShot.docs.map((doc) =>
      doc.data()
    ) as HotiAllocationDetail[];
    hotiAllocation = data;
  }
  const yQ = query(collectionGroup(db, "yatriDetails"));
  const yQuerySnapShot = await getDocs(yQ);
  if (yQuerySnapShot.empty) {
    return hotiAllocation as BookingSummary[];
  } else {
    const yatriDetails = yQuerySnapShot.docs.map((doc) =>
      doc.data()
    ) as YatriDetails[];
    bookingSummary = hotiAllocation.map((hotiAllocation) => ({
      childTicketYatri: yatriDetails
        .filter(
          (yatri) =>
            yatri.hotiId === hotiAllocation.hotiId &&
            yatri.ticketType === "CHILD"
        )
        .map((passenger) => ({
          ...passenger,
          dateOfBirth: passenger.dateOfBirth?.toDate().toISOString(),
        })),
      extraTicketYatri: yatriDetails
        .filter(
          (yatri) =>
            yatri.hotiId === hotiAllocation.hotiId &&
            yatri.ticketType === "EXTRA"
        )
        .map((passenger) => ({
          ...passenger,
          dateOfBirth: passenger.dateOfBirth?.toDate().toISOString(),
        })),
      hotiTicketYatri: yatriDetails
        .filter(
          (yatri) =>
            yatri.hotiId === hotiAllocation.hotiId &&
            yatri.ticketType === "HOTI"
        )
        .map((passenger) => ({
          ...passenger,
          dateOfBirth: passenger.dateOfBirth?.toDate().toISOString(),
        })),
      labhartiTicketYatri: yatriDetails
        .filter(
          (yatri) =>
            yatri.hotiId === hotiAllocation.hotiId &&
            yatri.ticketType === "LABHARTI"
        )
        .map((passenger) => ({
          ...passenger,
          dateOfBirth: passenger.dateOfBirth?.toDate().toISOString(),
        })),
      ...hotiAllocation,
    }));
  }
  return bookingSummary;
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
    dateOfBirth: passenger.dateOfBirth?.toDate(),
  }));
  return passengerDetails;
};

// export const getBookingSummaryForAllHoti = async () => {
//   const db = await getFirebaseFirestoreDB();
//   var path = `EventMaster/event-1/hotiAllocation`;
//   var t0 = performance.now();
//   console.log(`Start getBookingSummaryForAllHoti at ${t0}`);
//   const constraints = [where("hotiId", "==", 171)];

//   var q = query(collection(db, path), ...constraints);
//   var querySnapShot = await getDocs(q);
//   var bookingSummary = [] as BookingSummary[];
//   if (!querySnapShot.empty) {
//     const hotiAllocations = querySnapShot.docs.map((doc) =>
//       doc.data()
//     ) as HotiAllocationDetail[];

//     for (const hotiAllocation of hotiAllocations) {
//       var summary = {} as BookingSummary;
//       summary.hotiAllocation = hotiAllocation;
//       if (hotiAllocation.nextYatriId !== undefined) {
//         path = `EventMaster/event-1/hotiAllocation/hoti-${hotiAllocation.hotiId}/yatriDetails`;
//         q = query(collection(db, path));
//         querySnapShot = await getDocs(q);
//         if (!querySnapShot.empty) {
//           const yatriDetails = querySnapShot.docs.map((doc) =>
//             doc.data()
//           ) as YatriDetails[];

//           summary.hotiTicketYatri = yatriDetails.filter(
//             (yatriDetail) => yatriDetail.ticketType === "HOTI"
//           ).length;
//           summary.extraTicketYatri = yatriDetails.filter(
//             (yatriDetail) => yatriDetail.ticketType === "EXTRA"
//           ).length;
//           summary.childTicketYatri = yatriDetails.filter(
//             (yatriDetail) => yatriDetail.ticketType === "CHILD"
//           ).length;
//           summary.labhartiTicketYatri = yatriDetails.filter(
//             (yatriDetail) => yatriDetail.ticketType === "LABHARTI"
//           ).length;
//         }
//       }
//       bookingSummary.push(summary);
//     }
//   }
//   var t1 = performance.now();
//   console.log(`Count ${bookingSummary.length}`);
//   console.log(`Count ${bookingSummary.toString()}`);
//   console.log(`End getBookingSummaryForAllHoti at ${t1}`);
//   console.log(
//     "Call to getBookingSummaryForAllHoti took " + (t1 - t0) + " milliseconds."
//   );
//   return bookingSummary;
// };

export const getAppConfig = async () => {
  const db = await getFirebaseFirestoreDB();
  const path = `EventMaster/event-1/appConfig`;
  const q = query(collection(db, path));
  const querySnapShot = await getDocs(q);
  const appConfigData = querySnapShot.docs.map((doc) => doc.data());
  if (appConfigData && appConfigData.length) {
    return appConfigData[0].maintenanceMode;
  } else {
    return false;
  }
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
              city: passengerDetail.city || "",
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

export const updateProfilePicService = async (
  yatriDetails: YatriDetails,
  fileData: any
) => {
  return new Promise(async (resolve) => {
    const storageFirebase = await storage;
    const path = `EventMaster/event-1/hotiAllocation/hoti-${yatriDetails.hotiId}/yatriDetails`;

    const storageRef = ref(storageFirebase, `/${path}/${yatriDetails.yatriId}`);
    const uploadTask = uploadBytesResumable(storageRef, fileData);
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
        console.log("pic updated");
        resolve(yatriDetails);
      }
    );
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
    trainSeat: passengerDetail.trainSeat || "",
    busSeat: passengerDetail.busSeat || "",
    rajgiriRoom: passengerDetail.rajgiriRoom || "",
    pawapuriRoom: passengerDetail.pawapuriRoom || "",
    bhagalpurRoom: passengerDetail.bhagalpurRoom || "",
    lachwadRoom: passengerDetail.lachwadRoom || "",
    banarasRoom: passengerDetail.banarasRoom || "",
    shikharjiRoom: passengerDetail.shikharjiRoom || "",
    city: passengerDetail.city || "",
  });
}

export const getImageDownloadUrl = async (refUrl: string) => {
  const imageRef = ref(await storage, refUrl);
  const image = await getDownloadURL(imageRef);
  return image;
};

export const updateCustomerData = async (
  yatriId: string,
  hotiId: string,
  gender: string,
  city: string
) => {
  const db = await getFirebaseFirestoreDB();
  const path = `EventMaster/event-1/hotiAllocation/hoti-${hotiId}/yatriDetails`;

  const yatriDocRef = doc(db, path, yatriId);
  const result = await updateDoc(yatriDocRef, { gender, city });
  console.log("result", yatriId, result);
};

// export const getAllYatriDetailsById = async (hotiId: number) => {
//   const db = await getFirebaseFirestoreDB();
//   const path = `EventMaster/event-1/hotiAllocation/hoti-${hotiId}/yatriDetails`;
//   const q = query(collection(db, path));
//   const querySnapShot = await getDocs(q);
//   if (querySnapShot.empty) {
//     return [] as YatriDetails[];
//   }
//   const passengerDetailRaw = querySnapShot.docs.map((doc) =>
//     doc.data()
//   ) as YatriDetails[];
//   const passengerDetails = passengerDetailRaw.map((passenger) => ({
//     ...passenger,
//     dateOfBirth: passenger.dateOfBirth?.toDate(),
//   }));
//   return passengerDetails;
// };

export const updateYatriSeats = async (
  yatriId: string,
  hotiId: number,
  trainSeat: string,
  busSeat: string
) => {
  if (!trainSeat || !busSeat) {
    console.log("no data", yatriId);
  }
  const db = await getFirebaseFirestoreDB();
  const path = `EventMaster/event-1/hotiAllocation/hoti-${hotiId}/yatriDetails`;
  const yatriDocRef = doc(db, path, yatriId);
  try {
    const result = await updateDoc(yatriDocRef, { trainSeat, busSeat });
    console.log("result", yatriId, result);
  } catch (error) {
    console.log("failed for", yatriId);
  }
};

export const updateYatriRoomAllocation = async (
  yatriId: string,
  hotiId: number,
  banarasRoom: string

  // trainSeat: string,
  // busSeat: string,
  // rajgiriRoom?: string,
  // pawapuriRoom?: string,
  // lachwadRoom?: string,
  // bhagalpurRoom?: string,
  // shikharjiRoom?: string
) => {
  if (
    !banarasRoom
    // !trainSeat ||
    // !busSeat ||
    // !rajgiriRoom ||
    // !pawapuriRoom ||
    // !lachwadRoom ||
    // !bhagalpurRoom ||
    // !shikharjiRoom
  ) {
    console.log("no data", yatriId);
  }
  const db = await getFirebaseFirestoreDB();
  const path = `EventMaster/event-1/hotiAllocation/hoti-${hotiId}/yatriDetails`;
  const yatriDocRef = doc(db, path, yatriId);
  try {
    const result = await updateDoc(yatriDocRef, {
      banarasRoom,
      // trainSeat,
      // busSeat,
      // rajgiriRoom,
      // pawapuriRoom,
      // lachwadRoom,
      // bhagalpurRoom,
      // shikharjiRoom,
    });
    console.log("result", yatriId, result);
  } catch (error) {
    console.log("failed for", yatriId);
  }
};
