type Row = {
  datetime: string;
  rate: string;
};

export default function ResultTable({ rows }: { rows: Row[] }) {
  return (
    <div className="max-h-96 overflow-auto border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            <th className="border p-2">Datetime</th>
            <th className="border p-2">TOU Rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="border p-1 font-mono">{r.datetime}</td>
              <td className="border p-1 text-center">{r.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}