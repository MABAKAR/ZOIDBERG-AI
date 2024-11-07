"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Classification from "../components/classification";
import ProbabilityChart from "../components/probabilityChart";
import Header from "../components/header";

export default function Ia() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const resultParam = searchParams.get("result");

    if (resultParam) {
      setResult(JSON.parse(resultParam));
    }
  }, [searchParams, setResult]);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="text-white flex flex-col mt-10 pl-20 pr-20">
        <div className="flex h-[400px] justify-center items-center">
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
            {result && result.image_url && (
              <img
                className="w-[400px] h-[400px] "
                src={`http://localhost:3001${result.image_url}`}
              />
            )}
          </div>

          <div className="mt-8 w-full max-w-md ml-20 pl-10">
            <h2 className="text-2xl font-bold mb-4">Results: </h2>
            <div className="mb-4">
              <strong>Prediction:</strong>
              <p className="capitalise shadow-2xl bg-white text-black mt-3">
                {result && result.model === "lr"
                  ? result.prediction === 1
                    ? "Pneumonia"
                    : "Normal"
                  : null}

                {result && result.model !== "lr" && result.prediction}
              </p>
            </div>
          </div>
        </div>

        <div className="flex mt-10 justify-center items-center">
          {result && result.classification_report && (
            <Classification probabilities={result.classification_report} />
          )}
          <div className="items-center justify-center ml-20 pl-10 ">
            {result && result.probabilities && (
              <ProbabilityChart
                probabilities={result.probabilities}
                algo={result.model}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
