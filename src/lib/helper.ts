import { LJNMColors } from "../styles";

export const convertToAge = (dateString: Date) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const highlightDivContainer = (
  refObject: React.RefObject<HTMLDivElement>
) => {
  if (refObject.current) {
    refObject.current.style.transition = "background-color 200ms linear";
    refObject.current.scrollIntoView({ behavior: "smooth", block: "center" });
    refObject.current.style.background = LJNMColors.secondary;
    setTimeout(() => {
      if (refObject.current) {
        refObject.current.style.background = "";
      }
    }, 1000);
  }
};
