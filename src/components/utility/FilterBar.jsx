import FilterField from "./FilterField";

const FilterBar = ({ fields, onSearch }) => {
  return (
    <div className="py-3 rounded-md">
      <div className="flex flex-wrap items-end gap-4">
        {fields.map((field) => (
          <div key={field.name} className="flex-1 min-w-[150px]">
            <FilterField
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={field.onChange}
              options={field.options}
            />
          </div>
        ))}

        <button className="bg-[#7A5AF8] text-white btn-md" onClick={onSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
