import React from 'react';

export function CloneOptions({ options, onChange, disabled }) {
  const handleToggle = (option) => {
    if (disabled) return;
    onChange({
      ...options,
      [option]: !options[option]
    });
  };
  
  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Cloning Options</h3>
        <div className="space-y-2">
          <Option
            id="includeStyles"
            label="Include CSS styles"
            checked={options.includeStyles}
            onChange={() => handleToggle('includeStyles')}
            disabled={disabled}
          />
          <Option
            id="includeScripts"
            label="Include JavaScript (may cause issues)"
            checked={options.includeScripts}
            onChange={() => handleToggle('includeScripts')}
            disabled={disabled}
          />
          <Option
            id="includeImages"
            label="Include images"
            checked={options.includeImages}
            onChange={() => handleToggle('includeImages')}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

function Option({ id, label, checked, onChange, disabled }) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className={`ml-2 block text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}
      >
        {label}
      </label>
    </div>
  );
}