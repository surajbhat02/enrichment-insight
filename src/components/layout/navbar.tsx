import { BrainCircuit } from "lucide-react"; // Replaced Insights with BrainCircuit

export function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <BrainCircuit className="h-6 w-6 mr-2" /> {/* Replaced Insights with BrainCircuit */}
        <h1 className="text-xl font-semibold">Enrichment Insights</h1>
        {/* Add other navbar items here if needed */}
      </div>
    </nav>
  );
}
