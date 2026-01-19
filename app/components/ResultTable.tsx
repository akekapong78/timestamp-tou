type Row = {
  datetime: string;
  rate: string;
};

export default function ResultTable({ rows }: { rows: Row[] }) {
  return (
    <div className="max-h-[500px] overflow-auto rounded-xl border border-purple-100">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-purple-50">
          <tr className="text-purple-800">
            <th className="border-b border-purple-100 px-3 py-2 text-left">
              Datetime
            </th>
            <th className="border-b border-purple-100 px-3 py-2 text-center">
              TOU
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="
              odd:bg-white
              even:bg-purple-50/40
              hover:bg-purple-100
                transition-colors
              "
            >
              <td className="px-3 py-1.5 font-mono text-gray-600">
                {r.datetime}
              </td>
              <td
                className={`px-3 py-1.5 text-center font-semibold
                  ${
                    r.rate === "P"
                      ? "text-red-600"
                      : r.rate === "H"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
              >
                {r.rate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}