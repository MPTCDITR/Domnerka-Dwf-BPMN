import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { title: "Total Process", value: 45 },
  { title: "Active Process", value: 23 },
  { title: "Total Form", value: 12 },
  { title: "Total Running Process", value: 23 },
];

const StatCard = ({ title, value }: any) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="space-y-2">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-sm text-green-500">BPMN Process Overview</p>
    </div>
  </Card>
);

const Dashboard = () => {
  return (
    <>
      <div className="flex-1">
        {/* Main Content */}
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-8xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <a href="/process/bpmn-editor">
            <Button>Go to BPMN Editor</Button>
          </a>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
