

const HomePage = () => {
  return (
    <div className="max-w-4xl p-4">
      <h1>Welcome to the Study Jams Progress Tracker</h1>
      <p>Track your progress and stay motivated!</p>

      <h2>Navigation</h2>
      <ol className=" list-decimal pl-5">
        <li><a className=" text-blue-500 underline" href="/leaderboard">Leaderboard</a></li>
      </ol>
    </div>
  );
};

export default HomePage;
