import { useEffect, useState } from 'react'
import axios from 'axios'
import ErrorMessage from '../../components/alerts/ErrorMessage';
import Empty from '../../components/alerts/Empty';
import Loader from '../../components/alerts/Loader';

function Appliance() {
  const [appliances, setAppliances] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppliances, setSelectedAppliances] = useState({});
  const [totalWattage, setTotalWattage] = useState(0);
  const [selectedBatteryCapacity, setSelectedBatteryCapacity] = useState('');
  const [backupTime, setBackupTime] = useState(null);
  const [recommendedInverter, setRecommendedInverter] = useState(null);
  
  // Define available battery capacities in Ah with their labels
  const batteryCapacities = [
    { capacityAh: 7, label: "7" },
    { capacityAh: 20, label: "20" },
    { capacityAh: 50, label: "50" },
    { capacityAh: 100, label: "100" },
    { capacityAh: 150, label: "150" },
    { capacityAh: 200, label: "200" },
    { capacityAh: 250, label: "250" },
    { capacityAh: 280, label: "280" },
    { capacityAh: 300, label: "300" },
  ];
  
  // Define available inverter ratings in VA
  const inverterRatings = [600, 800, 1100, 1400, 1800, 2200, 3000, 5000];

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const getAppliance = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${BASE_URL}/appliance`)
        const { data } = response.data
        
        // Set default values for quantity and wattage when loading data
        const applancesWithDefaults = data.map(appliance => ({
          ...appliance,
          quantity: appliance.quantity || 1,
          wattage: appliance.wattage || 0
        }));
        
        setAppliances(applancesWithDefaults)
        setIsLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setIsLoading(false);
        }
      }
    }

    getAppliance()
  }, [])

  // Calculate total wattage whenever selections or appliance data changes
  useEffect(() => {
    let total = 0;
    appliances.forEach(appliance => {
      if (selectedAppliances[appliance._id]) {
        // Ensure values are numbers with defaults
        const quantity = Number(appliance.quantity) || 1;
        const wattage = Number(appliance.wattage) || 0;
        total += wattage * quantity;
      }
    });
    setTotalWattage(total);
    
    // Calculate recommended inverter based on total wattage
    if (total > 0) {
      // Add 25% buffer to the wattage for power factor and future expansion
      const requiredVA = Math.ceil(total * 1.25);
      
      // Find the smallest inverter rating that can handle the load
      const recommended = inverterRatings.find(rating => rating >= requiredVA) || 
                        inverterRatings[inverterRatings.length - 1];
      
      setRecommendedInverter(recommended);
    } else {
      setRecommendedInverter(null);
    }
    
    // Recalculate backup time when wattage changes
    calculateBackupTime(selectedBatteryCapacity, total);
  }, [selectedAppliances, appliances]);

  // Function to calculate backup time
  const calculateBackupTime = (batteryCapacityValue, currentWattage) => {
    if (currentWattage > 0 && batteryCapacityValue) {
      // Find the battery object
      const batteryObj = batteryCapacities.find(b => b.capacityAh.toString() === batteryCapacityValue);
      
      if (batteryObj) {
        // Convert Ah to Wh (using 12V battery)
        const batteryCapacityWh = batteryObj.capacityAh * 12;
        
        // Calculate backup time in hours (using 80% DoD - Depth of Discharge)
        const backupTimeHours = (batteryCapacityWh * 0.8) / currentWattage;
        
        // Convert to hours and minutes
        const hours = Math.floor(backupTimeHours);
        const minutes = Math.floor((backupTimeHours - hours) * 60);
        
        setBackupTime({ hours, minutes });
      } else {
        setBackupTime(null);
      }
    } else {
      setBackupTime(null);
    }
  };

  // Handle battery capacity change
  const handleBatteryCapacityChange = (e) => {
    const value = e.target.value;
    setSelectedBatteryCapacity(value);
    calculateBackupTime(value, totalWattage);
  };

  const handleQuantityChange = (id, value) => {
    // Ensure value is a number and at least 1
    const numValue = Math.max(1, Number(value) || 1);
    
    setAppliances(appliances.map(appliance =>
      appliance._id === id ? { ...appliance, quantity: numValue } : appliance
    ));
  };

  const handleWattageChange = (id, value) => {
    // Ensure value is a number and at least 0
    const numValue = Math.max(0, Number(value) || 0);
    
    setAppliances(appliances.map(appliance =>
      appliance._id === id ? { ...appliance, wattage: numValue } : appliance
    ));
  };

  const toggleSelection = (id) => {
    setSelectedAppliances(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle keyboard events
  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter') {
      // Trigger the calculation on Enter key
      handler(e);
    }
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Empty state
  if (!appliances || appliances.length === 0) {
    return <Empty />;
  }

  // Content when everything is loaded successfully
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Appliances</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on medium screens and above) */}
        <div className="md:col-span-2 space-y-4" id="appliance-list">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wattage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appliances.map(appliance => (
                  <tr key={appliance._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleSelection(appliance._id)}
                        className={`w-6 h-6 flex items-center justify-center border-2 rounded 
                          ${selectedAppliances[appliance._id]
                            ? 'bg-blue-500 border-blue-600'
                            : 'bg-white border-gray-300'}`}
                        aria-label={`Select ${appliance.name}`}
                      >
                        {selectedAppliances[appliance._id] &&
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        }
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{appliance.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${appliance._id}`} className="sr-only">Quantity:</label>
                        <input
                          id={`quantity-${appliance._id}`}
                          type="number"
                          min="1"
                          value={appliance.quantity}
                          onChange={(e) => handleQuantityChange(appliance._id, parseInt(e.target.value))}
                          onKeyDown={(e) => handleKeyDown(e, () => handleQuantityChange(appliance._id, parseInt(e.target.value)))}
                          className="w-16 p-1 border rounded"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <label htmlFor={`wattage-${appliance._id}`} className="sr-only">Wattage:</label>
                        <input
                          id={`wattage-${appliance._id}`}
                          type="number"
                          min="0"
                          value={appliance.wattage}
                          onChange={(e) => handleWattageChange(appliance._id, parseInt(e.target.value))}
                          onKeyDown={(e) => handleKeyDown(e, () => handleWattageChange(appliance._id, parseInt(e.target.value)))}
                          className="w-16 p-1 border rounded"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1/3 width on medium screens and above) */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-bold mb-4">Summary</h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Selected Appliances</p>
              <ul className="mt-2 space-y-2">
                {appliances.filter(a => selectedAppliances[a._id]).map(appliance => (
                  <li key={`summary-${appliance._id}`} className="flex justify-between">
                    <span>{appliance.name} (×{appliance.quantity || 1})</span>
                    <span>{(appliance.wattage || 0) * (appliance.quantity || 1)} watts</span>
                  </li>
                ))}
              </ul>

              {Object.values(selectedAppliances).filter(Boolean).length === 0 && (
                <p className="text-sm italic text-gray-500 mt-2">No appliances selected</p>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>Total Wattage:</span>
                <span>{totalWattage} watts</span>
              </div>

              {totalWattage > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Estimated daily consumption: {(totalWattage * 24 / 1000).toFixed(2)} kWh</p>
                </div>
              )}
            </div>

            {/* Inverter Recommendation Section */}
            {totalWattage > 0 && recommendedInverter && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Recommended Inverter</h4>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-blue-800">
                    For a total load of {totalWattage} watts, we recommend a <strong>{recommendedInverter} VA</strong> inverter.
                  </p>
                </div>
              </div>
            )}

            {/* Battery Selection Section */}
            {totalWattage > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Battery Backup Calculation</h4>
                
                <div className="mb-3">
                  <label htmlFor="battery-capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Battery Capacity (Ah)
                  </label>
                  <select
                    id="battery-capacity"
                    value={selectedBatteryCapacity}
                    onChange={handleBatteryCapacityChange}
                    onKeyDown={(e) => handleKeyDown(e, handleBatteryCapacityChange)}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select capacity...</option>
                    {batteryCapacities.map(battery => (
                      <option key={`${battery.capacityAh}-${battery.label}`} value={battery.capacityAh}>
                        {battery.capacityAh} Ah ({battery.label} Wh)
                      </option>
                    ))}
                  </select>
                </div>

                {backupTime && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-green-800">
                      With a {selectedBatteryCapacity} Ah battery,
                      your estimated backup time is: <strong>
                        {backupTime.hours} hour{backupTime.hours !== 1 ? 's' : ''} and {backupTime.minutes} minute{backupTime.minutes !== 1 ? 's' : ''}
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appliance