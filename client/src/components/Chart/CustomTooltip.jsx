import { formatCurrencyVND } from "@/ultils/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            <span className="font-bold">
              {entry.value > 10000
                ? formatCurrencyVND(entry.value)
                : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};
export default CustomTooltip;
