"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Classification({ probabilities }: any) {
  return (
    <div className="bg-gray-800 text-white flex flex-col">
      <main className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 mb-20">Classification Report</h1>
        <table className="divide-y divide-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-1xl font-medium text-white uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-1xl font-medium text-white uppercase tracking-wider">
                Precision
              </th>
              <th className="px-6 py-3 text-left text-1xl font-medium text-white uppercase tracking-wider">
                Recall
              </th>
              <th className="px-6 py-3 text-left text-1xl font-medium text-white uppercase tracking-wider">
                F1-Score
              </th>
              <th className="px-6 py-3 text-left text-1xl font-medium text-white uppercase tracking-wider">
                Support
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-200">
            {Object.keys(probabilities).map((key) => {
              if (key !== "accuracy") {
                return (
                  <tr key={key}>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {key}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {probabilities[key]["precision"].toFixed(4)}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {probabilities[key]["recall"].toFixed(4)}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {probabilities[key]["f1-score"].toFixed(4)}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {probabilities[key]["support"]}
                    </td>
                  </tr>
                );
              }
            })}
            <tr>
              <td className="py-2 px-4 border-b border-gray-700">accuracy</td>
              <td className="py-2 px-4 border-b border-gray-700">
                {probabilities["accuracy"].toFixed(4)}
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
