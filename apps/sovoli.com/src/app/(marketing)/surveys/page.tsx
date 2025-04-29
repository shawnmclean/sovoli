import React from "react";
import { Card, CardBody } from "@sovoli/ui/components/card";

import { SurveyForm } from "./components/SurveyForm";

export default function App() {
  return (
    <div className="min-h-screen bg-content2 py-8">
      <div className="mx-auto max-w-3xl">
        <Card className="shadow-lg">
          <CardBody className="p-6">
            <h1 className="mb-6 text-center text-2xl font-bold">
              School Compatibility Survey
            </h1>
            <SurveyForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
