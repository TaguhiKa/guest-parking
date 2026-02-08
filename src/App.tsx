import { Sidebar } from "./components/Sidebar/Sidebar";
import { Dashboard } from "./components/Dashboard/Dashboard";

import "./index.css";

export default function App() {
  return (
    <main className='grid h-screen p-4 gap-4 grid-cols-[56px_1fr] md:grid-cols-[220px_1fr]'>
      <Sidebar />
      <section className='overflow-y-auto min-w-0'>
        <Dashboard />
      </section>
    </main>
  );
}