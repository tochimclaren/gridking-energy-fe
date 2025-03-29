import { useEffect, useState } from 'react'
import axios from 'axios'

function Appliance() {
  const [appliances, setAppliances] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppliances, setSelectedAppliances] = useState({});
  const [totalWattage, setTotalWattage] = useState(0);

  useEffect(() => {
    const getAppliance = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:3000/api/appliance')
        const { data } = response.data
        setAppliances(data)
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
        total += appliance.wattage * appliance.quantity;
      }
    });
    setTotalWattage(total);
  }, [selectedAppliances, appliances]);

  const handleQuantityChange = (id, value) => {
    setAppliances(appliances.map(appliance =>
      appliance._id === id ? { ...appliance, quantity: value } : appliance
    ));
  };

  const handleWattageChange = (id, value) => {
    setAppliances(appliances.map(appliance =>
      appliance._id === id ? { ...appliance, wattage: value } : appliance
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!appliances || appliances.length === 0) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2">No Appliances Found</h2>
        <p className="text-gray-600 mb-4">There are no appliances available at the moment.</p>
      </div>
    );
  }

  // Content when everything is loaded successfully
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Appliances</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on medium screens and above) */}
        <div className="md:col-span-2 space-y-4">
          {appliances.map(appliance => (
            <div key={appliance._id} className="flex items-center space-x-4 p-4 border rounded-lg">
              {/* Checkbox style button */}
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

              {/* Appliance name */}
              <span className="font-medium">{appliance.name}</span>

              {/* Quantity input */}
              <div className="flex items-center">
                <label htmlFor={`quantity-${appliance._id}`} className="mr-2 text-sm">Quantity:</label>
                <input
                  id={`quantity-${appliance._id}`}
                  type="number"
                  min="0"
                  value={appliance.quantity}
                  onChange={(e) => handleQuantityChange(appliance._id, parseInt(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
              </div>

              {/* Wattage input */}
              <div className="flex items-center">
                <label htmlFor={`wattage-${appliance._id}`} className="mr-2 text-sm">Wattage:</label>
                <input
                  id={`wattage-${appliance._id}`}
                  type="number"
                  min="0"
                  value={appliance.wattage}
                  onChange={(e) => handleWattageChange(appliance._id, parseInt(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
              </div>
            </div>
          ))}
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
                    <span>{appliance.name} (×{appliance.quantity})</span>
                    <span>{appliance.wattage * appliance.quantity} watts</span>
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