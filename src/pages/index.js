

const HomePage = () => {
  return (
    <div className="max-w-4xl p-4">
      <h1>Welcome to the Study Jams Progress Tracker</h1>
      <p>Track your progress and stay motivated!</p>

      <h2 className=" text-xl mt-4">Navigation</h2>
      <ol className=" list-decimal pl-5">
        <li><a target="_blank" className=" text-blue-500 underline" href="/leaderboard">Leaderboard</a></li>
        <li><a target="_blank" className=" text-blue-500 underline" href="/my-profile">My Profile</a></li>
        <li><a target="_blank" className=" text-blue-500 underline" href="/login">Login</a></li>
        <li><a target="_blank" className=" text-blue-500 underline" href="/admin/chapters">View All Chapters [Admin]</a></li>
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
