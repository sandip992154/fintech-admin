const SchemeTable = ({ data }) => {
  return (
    <table className="w-full mt-6 text-left text-sm dark:text-white border-separate border-spacing-0">
      <thead className="uppercase text-xs text-gray-400 border-b border-gray-600">
        <tr>
          <th className="py-2 border-b border-gray-700">Provider</th>
          <th className="border-b border-gray-700">Type</th>
          <th className="border-b border-gray-700">Whitelable</th>
          <th className="border-b border-gray-700">MD</th>
          <th className="border-b border-gray-700">Distributor</th>
          <th className="border-b border-gray-700">Retailer</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx} className="border-b border-slate-400">
            <td className="py-2">{item.provider}</td>
            <td>{item.type}</td>
            <td>{item.whitelabel}</td>
            <td>{item.md}</td>
            <td>{item.distributor}</td>
            <td>{item.retailer}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SchemeTable;
