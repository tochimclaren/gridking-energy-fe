// Define the data types that attributes can have
type DataType = 'string' | 'number' | 'boolean' | 'date';

// Define the structure of each attribute object
interface AttributeOption {
    value: string;
    label: string;
    dataType: DataType;
}

// Predefined attribute names for quick selection with their typical data types
export const commonAttributeNames: AttributeOption[] = [
    { value: '', label: 'Select attribute name...', dataType: 'string' },
    { value: 'power_rating', label: 'Power Rating', dataType: 'number' },
    { value: 'efficiency', label: 'Efficiency', dataType: 'number' },
    { value: 'capacity_ah', label: 'Capacity (Ah)', dataType: 'number' },
    { value: 'output_voltage', label: 'Input Voltage', dataType: 'number' },
    { value: 'input_voltage', label: 'Output Voltage', dataType: 'number' },
    { value: 'battery_type', label: 'Battery Type', dataType: 'string' },
    { value: 'cycle_life', label: 'Cycle Life', dataType: 'number' },
    { value: 'warranty_years', label: 'Warranty (Years)', dataType: 'number' },
    { value: 'cell_type', label: 'Cell Type', dataType: 'string' },
    { value: 'dimensions', label: 'Dimensions', dataType: 'string' },
    { value: 'weight', label: 'Weight', dataType: 'number' },
    { value: 'brand', label: 'Brand', dataType: 'string' },
    { value: 'model', label: 'Model', dataType: 'string' },
    { value: 'color', label: 'Color', dataType: 'string' },
    { value: 'material', label: 'Material', dataType: 'string' },
    { value: 'temperature_range', label: 'Temperature Range', dataType: 'string' },
    { value: 'certifications', label: 'Certifications', dataType: 'string' },
    { value: 'installation_type', label: 'Installation Type', dataType: 'string' },
    { value: 'operating_temperature', label: 'Operating Temperature', dataType: 'string' },
    { value: 'storage_temperature', label: 'Storage Temperature', dataType: 'string' },
    { value: 'lifetime', label: 'Lifetime', dataType: 'number' },
];
