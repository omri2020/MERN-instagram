import UserTag from "./UserTag";

const SearchBar = ({ search, setSearch, selected }) => (
  <div className="flex w-full items-center gap-2 border-b px-3 py-2">
    <span className="text-sm font-semibold">To:</span>
    {selected.map((user) => (
      <UserTag key={user._id} user={user} />
    ))}
    <input
      type="text"
      className="grow text-sm outline-none"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
);

export default SearchBar;
