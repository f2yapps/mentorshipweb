type Props = {
  usersCount: number;
  mentorsCount: number;
  menteesCount: number;
  /** Mentees who had a request in the last 30 days */
  activeMenteesCount: number;
  requestsCount: number;
  /** Mentees registered in the last 30 days */
  newMenteesCount: number;
  /** Mentors registered in the last 30 days */
  newMentorsCount: number;
  className?: string;
};

export function AdminStats({
  usersCount,
  mentorsCount,
  menteesCount,
  activeMenteesCount,
  requestsCount,
  newMenteesCount,
  newMentorsCount,
  className = "",
}: Props) {
  const stats = [
    { label: "Total users", value: usersCount, sub: null },
    { label: "Total mentors", value: mentorsCount, sub: `+${newMentorsCount} this month` },
    { label: "Total registered mentees", value: menteesCount, sub: `+${newMenteesCount} this month` },
    { label: "Active mentees (30d)", value: activeMenteesCount, sub: "logged in this month" },
    { label: "Total requests", value: requestsCount, sub: null },
  ];

  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {stats.map(({ label, value, sub }) => (
        <div key={label} className="card p-4">
          <p className="text-sm font-medium text-earth-600">{label}</p>
          <p className="mt-1 text-3xl font-bold text-earth-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-earth-400">{sub}</p>}
        </div>
      ))}
    </div>
  );
}
