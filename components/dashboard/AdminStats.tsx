type Props = {
  usersCount: number;
  mentorsCount: number;
  menteesCount: number;
  /** Mentees who had a request in the last 30 days */
  activeMenteesCount: number;
  requestsCount: number;
  className?: string;
};

export function AdminStats({
  usersCount,
  mentorsCount,
  menteesCount,
  activeMenteesCount,
  requestsCount,
  className = "",
}: Props) {
  const stats = [
    { label: "Total users", value: usersCount },
    { label: "Total mentors", value: mentorsCount },
    { label: "Total registered mentees", value: menteesCount },
    { label: "Active mentees (30d)", value: activeMenteesCount },
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
