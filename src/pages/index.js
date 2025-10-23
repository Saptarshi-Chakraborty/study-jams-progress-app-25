"use client"

const NAVIGATIONS = [
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "My Profile", href: "/my-profile" },
  { name: "Login", href: "/login" },
  { name: "View All Chapters [Admin]", href: "/admin/chapters" },
  { name: "View All Users [Admin]", href: "/admin/users" },
  { name: "Upload Report [Organisers]", href: "/daily_reports/upload" },
  // { name: "View All Reports [Organisers]", href: "/daily_reports/reports" },
]


const HomePage = () => {
  return (
    <div className="max-w-4xl p-4">
      <h1>Welcome to the Study Jams Progress Tracker</h1>
      <p>Track your progress and stay motivated!</p>

      <h2 className=" text-xl mt-4">Navigation</h2>
      <ol className=" list-decimal pl-5">
        {NAVIGATIONS.map((nav) => (
          <li key={nav.name}><a target="_blank" className=" text-blue-500 underline" href={nav.href}>{nav.name}</a></li>
        ))}
        {/*         
        <li><a target="_blank" className=" text-blue-500 underline" href="/leaderboard">Leaderboard</a></li> */}

      </ol>

      {/* Example Pages */}
      <h2 className=" text-xl mt-4">Example Pages</h2>
      <ol className=" list-decimal pl-5">
        <li><a target="_blank" className=" text-blue-500 underline" href="/examples/leaderboard-v1.html">Leaderboard (V1)</a></li>
        <li><a target="_blank" className=" text-blue-500 underline" href="/examples/profile-v1.html">My Profile (V1)</a></li>
      </ol>

    </div>
  );
};

export default HomePage;
