interface StatCardProps {
  label: string;
  value: number | string;
  labelClassName?: string;
  valueClassName?: string;
}

export function StatCard({ label, value, labelClassName = "text-gray-500", valueClassName = "text-gray-900" }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5">
      <p className={`${labelClassName} mb-1 text-sm font-medium`}>{label}</p>
      <p className={`${valueClassName} font-bold text-3xl`}>{value}</p>
    </div>
  );
}
