import { useEffect, useState, ChangeEvent, KeyboardEvent } from 'react';
import axios from 'axios';
import ErrorMessage from '../../components/alerts/ErrorMessage';
import Empty from '../../components/alerts/Empty';
import Loader from '../../components/alerts/Loader';

interface Appliance {
  _id: string;
  name: string;
  quantity?: number;
  wattage?: number;
  isSensitive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface BatteryCapacity {
  capacityAh: number;
  label: string;
}

interface BackupTime {
  hours: number;
  minutes: number;
}

function Appliance() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppliances, setSelectedAppliances] = useState<Record<string, boolean>>({});
  const [totalWattage, setTotalWattage] = useState(0);
  const [selectedBatteryCapacity, setSelectedBatteryCapacity] = useState<string>('');
  const [batteryQuantity, setBatteryQuantity] = useState<number>(1); // New state for battery quantity
  const [backupTime, setBackupTime] = useState<BackupTime | null>(null);
  const [recommendedInverter, setRecommendedInverter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Define available battery capacities in Ah with their labels
  const batteryCapacities: BatteryCapacity[] = [
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
        const response = await axios.get(`${BASE_URL}/appliance`);
        const { data } = response.data;
        
        // Set default values for quantity and wattage when loading data
        const appliancesWithDefaults = data.map((appliance: Appliance) => ({
          ...appliance,
          quantity: appliance.quantity || 1,
          wattage: appliance.wattage || 0
        }));
        
        setAppliances(appliancesWithDefaults);
        setIsLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        setIsLoading(false);
      }
    };

    getAppliance();
  }, []);

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
    calculateBackupTime(selectedBatteryCapacity, total, batteryQuantity);
  }, [selectedAppliances, appliances, selectedBatteryCapacity, batteryQuantity]);

  // Function to calculate backup time
  const calculateBackupTime = (batteryCapacityValue: string, currentWattage: number, quantity: number = 1) => {
    if (currentWattage > 0 && batteryCapacityValue) {
      // Find the battery object
      const batteryObj = batteryCapacities.find(b => b.capacityAh.toString() === batteryCapacityValue);
      
      if (batteryObj) {
        // Convert Ah to Wh (using 12V battery)
        const batteryCapacityWh = batteryObj.capacityAh * 12;
        
        // Calculate backup time in hours (using 80% DoD - Depth of Discharge)
        // Multiply by quantity to account for multiple batteries
        const backupTimeHours = (batteryCapacityWh * 0.8 * quantity) / currentWattage;
        
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
  const handleBatteryCapacityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedBatteryCapacity(value);
    calculateBackupTime(value, totalWattage, batteryQuantity);
  };

  // Handle battery quantity change
  const handleBatteryQuantityChange = (value: number) => {
    // Ensure value is a number and at least 1
    const numValue = Math.max(1, Number(value) || 1);
    setBatteryQuantity(numValue);
    calculateBackupTime(selectedBatteryCapacity, totalWattage, numValue);
  };

  const handleQuantityChange = (id: string, value: number, e?: React.MouseEvent) => {
    // Stop propagation to prevent card selection when clicking on inputs
    if (e) {
      e.stopPropagation();
    }
    
    // Ensure value is a number and at least 1
    const numValue = Math.max(1, Number(value) || 1);
    
    setAppliances(appliances.map(appliance =>
      appliance._id === id ? { ...appliance, quantity: numValue } : appliance
    ));
  };

  const handleWattageChange = (id: string, value: number, e?: React.MouseEvent) => {
    // Stop propagation to prevent card selection when clicking on inputs
    if (e) {
      e.stopPropagation();
    }
    
    // Ensure value is a number and at least 0
    const numValue = Math.max(0, Number(value) || 0);
    
    setAppliances(appliances.map(appliance =>
      appliance._id === id ? { ...appliance, wattage: numValue } : appliance
    ));
  };

  const toggleSelection = (id: string) => {
    setSelectedAppliances(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle keyboard events
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>, 
    handler: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void
  ) => {
    if (e.key === 'Enter') {
      // Create a synthetic event for the handler
      const syntheticEvent = {
        target: e.target,
        currentTarget: e.currentTarget
      } as unknown as ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>;
      handler(syntheticEvent);
    }
  };

  // Handle input change without selection propagation
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle search query change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter appliances based on search query
  const filteredAppliances = appliances.filter(appliance => 
    appliance.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Calculate total battery capacity
  const getTotalBatteryCapacity = () => {
    const capacityAh = selectedBatteryCapacity ? parseInt(selectedBatteryCapacity) : 0;
    return capacityAh * batteryQuantity;
  };

  // Content when everything is loaded successfully
  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Appliances Power Calculator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6" id="appliance-list">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-700">Select Your Appliances</h3>
            
            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search appliances..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Show message when no results found */}
          {filteredAppliances.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No appliances found matching "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 text-blue-500 hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          )}
          
          {/* Appliance Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppliances.map(appliance => (
              <div 
                key={appliance._id} 
                onClick={() => toggleSelection(appliance._id)}
                className={`rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md overflow-hidden cursor-pointer
                  ${selectedAppliances[appliance._id] ? 'ring-2 ring-blue-500' : 'ring-0'} 
                  ${appliance.isSensitive 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-orange-50 border-orange-200'}`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-800 flex-grow truncate pr-2">{appliance.name}</h4>
                    <div
                      className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors
                        ${selectedAppliances[appliance._id]
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border-2 border-gray-300'}`}
                      aria-label={`Select ${appliance.name}`}
                    >
                      {selectedAppliances[appliance._id] && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={`quantity-${appliance._id}`} className="text-sm text-gray-600">Quantity:</label>
                    <input
                      id={`quantity-${appliance._id}`}
                      type="number"
                      min="1"
                      value={appliance.quantity || 1}
                      onChange={(e) => handleQuantityChange(appliance._id, parseInt(e.target.value))}
                      onKeyDown={(e) => handleKeyDown(e, (e) => handleQuantityChange(appliance._id, parseInt((e.target as HTMLInputElement).value)))}
                      onClick={handleInputClick}
                      className="w-16 p-1 border rounded text-right"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor={`wattage-${appliance._id}`} className="text-sm text-gray-600">Wattage:</label>
                    <input
                      id={`wattage-${appliance._id}`}
                      type="number"
                      min="0"
                      value={appliance.wattage || 0}
                      onChange={(e) => handleWattageChange(appliance._id, parseInt(e.target.value))}
                      onKeyDown={(e) => handleKeyDown(e, (e) => handleWattageChange(appliance._id, parseInt((e.target as HTMLInputElement).value)))}
                      onClick={handleInputClick}
                      className="w-16 p-1 border rounded text-right"
                    />
                  </div>
                  
                  {selectedAppliances[appliance._id] && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        Total: {(appliance.wattage || 0) * (appliance.quantity || 1)} watts
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-2 flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appliance.isSensitive 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-orange-200 text-orange-800'
                    }`}>
                      {appliance.isSensitive ? 'Sensitive Device' : 'Standard Device'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="bg-white rounded-lg shadow-md border sticky top-6 max-h-screen overflow-auto">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Power Summary</h3>

            <div className="space-y-6">
              {/* Selected Appliances Count */}
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Selected Items:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {Object.values(selectedAppliances).filter(Boolean).length}
                </span>
              </div>
              
              {/* Selected Appliances Summary */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Selected Appliances
                </h4>
                
                <div className="bg-gray-50 rounded-lg border border-gray-200">
                  {Object.values(selectedAppliances).filter(Boolean).length > 0 ? (
                    <ul className="divide-y divide-gray-200 max-h-48 overflow-y-auto">
                      {appliances.filter(a => selectedAppliances[a._id]).map(appliance => (
                        <li key={`summary-${appliance._id}`} className="flex justify-between items-center p-3 text-sm hover:bg-gray-100">
                          <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              appliance.isSensitive ? 'bg-green-500' : 'bg-orange-500'
                            }`}></span>
                            <span>{appliance.name}</span>
                            <span className="text-gray-500 ml-1">×{appliance.quantity || 1}</span>
                          </div>
                          <span className="font-medium">{(appliance.wattage || 0) * (appliance.quantity || 1)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500 italic">
                      No appliances selected
                    </div>
                  )}
                </div>
              </div>

              {/* Total Wattage */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white shadow">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Total Power:</span>
                  <span className="text-xl font-bold">{totalWattage} watts</span>
                </div>

                {totalWattage > 0 && (
                  <div className="mt-2 text-sm text-blue-100 border-t border-blue-400 pt-2">
                    <p>Estimated daily consumption: <span className="font-medium">{(totalWattage * 24 / 1000).toFixed(2)} kWh</span></p>
                  </div>
                )}
              </div>

              {/* Inverter Recommendation Section */}
              {totalWattage > 0 && recommendedInverter && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h4 className="font-medium text-indigo-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Recommended Inverter
                  </h4>
                  <p className="text-indigo-700">
                    For a total load of <span className="font-medium">{totalWattage} watts</span>, we recommend a <span className="font-bold text-indigo-900">{recommendedInverter} VA</span> inverter.
                  </p>
                </div>
              )}

              {/* Battery Selection Section */}
              {totalWattage > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Battery Backup Calculator
                  </h4>
                  
                  <div className="mb-4">
                    <label htmlFor="battery-capacity" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Battery Capacity (Ah)
                    </label>
                    
                    <div className="flex space-x-2">
                      <select
                        id="battery-capacity"
                        value={selectedBatteryCapacity}
                        onChange={handleBatteryCapacityChange}
                        onKeyDown={(e) => handleKeyDown(e, (event) => handleBatteryCapacityChange(event as ChangeEvent<HTMLSelectElement>))}
                        className="flex-grow p-2 border rounded focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="">Select capacity...</option>
                        {batteryCapacities.map(battery => (
                          <option key={`${battery.capacityAh}-${battery.label}`} value={battery.capacityAh.toString()}>
                            {battery.capacityAh} Ah ({battery.label})
                          </option>
                        ))}
                      </select>
                      
                      {/* Battery Quantity Input */}
                      <div className="relative w-24 flex">
                        <span className="absolute left-2 top-2 text-gray-500">×</span>
                        <input
                          type="number"
                          min="1"
                          value={batteryQuantity}
                          onChange={(e) => handleBatteryQuantityChange(parseInt(e.target.value))}
                          className="w-full pl-6 pr-2 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                          aria-label="Battery quantity"
                        />
                      </div>
                    </div>
                    
                    {/* Display total battery capacity */}
                    {selectedBatteryCapacity && (
                      <div className="mt-2 text-sm text-gray-600">
                        Total battery capacity: <span className="font-medium">{getTotalBatteryCapacity()} Ah</span>
                      </div>
                    )}
                  </div>

                  {backupTime && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <div className="flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-green-800">Estimated Backup Time</span>
                      </div>
                      <p className="text-green-800 pl-6">
                        <span className="font-bold text-lg">
                          {backupTime.hours}h {backupTime.minutes}m
                        </span>
                        <span className="text-sm block mt-1 text-green-700">
                          with {batteryQuantity > 1 ? `${batteryQuantity} × ` : ''}{selectedBatteryCapacity} Ah {batteryQuantity > 1 ? 'batteries' : 'battery'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appliance;