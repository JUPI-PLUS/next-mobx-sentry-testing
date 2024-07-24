// libs
import React from "react";

// models
import { SampleDetailsConditionsProps } from "./models";

const SampleDetailsConditions = ({ conditions }: SampleDetailsConditionsProps) => {
    if (!Boolean(conditions.length)) return null;

    return (
        <div className="flex flex-wrap gap-1 pt-6">
            {conditions.map(({ id, name, value }) => (
                <div key={id} className="flex gap-2 bg-dark-200 text-md py-1 px-3 rounded-md">
                    <p className="text-dark-700" data-testid="condition-name">
                        {name}
                    </p>
                    <p className="font-medium" data-testid="condition-value">
                        {value}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default SampleDetailsConditions;
