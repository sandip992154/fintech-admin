import FilterField from "./FilterField";

const FilterBar = ({ fields, onSearch }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 items-end">
        {fields.map((field) => (
          <div
            key={field.name}
            className="w-full"
            style={{
              minWidth: field.minWidth || "auto",
            }}
          >
            <FilterField
              type={field.type}
              placeholder={field.placeholder}
              label={field.label}
              value={field.value}
              onChange={field.onChange}
              options={field.options}
            />
          </div>
        ))}

        {onSearch && (
          <div className="w-full flex items-end">
            <button
              className="w-full bg-[#7C5CFC] hover:bg-[#6938EF] text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C5CFC] focus:ring-offset-2 shadow-sm"
              onClick={onSearch}
            >
              Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
