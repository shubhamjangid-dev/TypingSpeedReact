import React from "react";
import { LoaderCircle } from "lucide-react";
function Loader() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col">
      <LoaderCircle
        size={120}
        strokeWidth={0.5}
        className="animate-spin "
      />
      <p className="text-x">loading...</p>
    </div>
  );
}

export default Loader;
