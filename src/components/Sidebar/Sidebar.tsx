import { Nav } from "./Nav";

export const Sidebar = () => {
  return (
    <aside className='h-full p-4 sticky top-4 rounded bg-primary'>
      <Nav />
    </aside>
  );
};