import LoadingAnimation from "@/asset/lottie/success.json";
import Lottie from "lottie-react";

export function SuccessAnimation() {
  return (
    <div className="max-w-[10rem] !p-0">
      <Lottie animationData={LoadingAnimation} loop={true}/>
    </div>
  )
}