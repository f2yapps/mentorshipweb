type Props = {
  usersCount: number;
  mentorsCount: number;
  menteesCount: number;
  requestsCount: number;
  className?: string;
};

export function AdminStats({
  usersCount,
  mentorsCount,
  menteesCount,
  requestsCount,
  className = "",
}: Props) {
  const stats = [
    { label: "Users", value: usersCount },
    { label: "Mentors", value: mentorsCount },
    { label: "Mentees", value: menteesCount },
    { label: "Mentorship requests", value: requestsCount },
  ];

  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {stats.map(({ label, value }) => (
        <div key={label} className="card p-4">
          <p className="text-sm font-medium text-earth-600">{label}</p>
          <p className="mt-1 text-2xl font-bold text-earth-900">{value}</p>
        </div>
      ))}
    </div>
  );
}
