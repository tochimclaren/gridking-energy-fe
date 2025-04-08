const inverterRatingsWatts = [
    150,
    300,
    500,
    800,
    1000,
    1200,
    1500,
    2000,
    2500,
    3000,
    3500,
    4000,
    5000,
    6000,
    7500,
    10000
];

export const InverterSelect = () => {
    return (
        <select name="inverterRating">
            {inverterRatingsWatts.map((watts) => (
                <option key={watts} value={watts}>
                    {watts} W
                </option>
            ))}
        </select>
    );
}

const batteryCapacitiesAh = [
    20,
    35,
    50,
    75,
    100,
    120,
    150,
    180,
    200,
    220,
    250,
    300
];

export const BatterySelect = () => {
    return (
        <select name="batteryCapacity">
            {batteryCapacitiesAh.map((ah) => (
                <option key={ah} value={ah}>
                    {ah} Ah
                </option>
            ))}
        </select>
    );
}
