import Image from "next/image";
import MaxWidthWrapper from "./components/MaxWidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-48 flex flex-col items-center justify-center text-center">
      <div className="mx-auto mb-4 max-w-fit items-center justify-center space-x-2 overflow-hidden">

      </div>
      </MaxWidthWrapper>
  );
}
