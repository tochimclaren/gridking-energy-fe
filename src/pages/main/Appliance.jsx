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
  }, [selectedAppliances, appliances]);

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appliance