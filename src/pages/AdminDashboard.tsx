import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  Globe, 
  Plus, 
  Settings,
  MoreHorizontal,
  TrendingUp,
  Activity
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const DATA = [
  { name: "Mon", users: 400 },
  { name: "Tue", users: 600 },
  { name: "Wed", users: 500 },
  { name: "Thu", users: 800 },
  { name: "Fri", users: 700 },
  { name: "Sat", users: 300 },
  { name: "Sun", users: 200 },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
           <div>
              <h1 className="text-4xl font-display font-bold tracking-tight">Institutional Overview</h1>
              <p className="text-muted-foreground font-light mt-2">Enterprise-grade management for CampusFlow.exe</p>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl flex items-center gap-2">
                 <Settings className="w-4 h-4" /> System Audit
              </Button>
              <Button className="rounded-xl flex items-center gap-2">
                 <Plus className="w-4 h-4" /> Provision Users
              </Button>
           </div>
        </div>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: "Total Students", value: "12,402", trend: "+12%", icon: GraduationCap },
             { label: "Active Faculty", value: "482", trend: "+2%", icon: Users },
             { label: "Security Score", value: "98/100", trend: "Stable", icon: ShieldCheck },
             { label: "Global Reach", value: "14 Nodes", trend: "Healthy", icon: Globe },
           ].map((stat, i) => (
              <Card key={i} className="p-6 border-none shadow-sm bg-muted/10 rounded-[2rem]">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center shadow-sm">
                       <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-bold">{stat.trend}</Badge>
                 </div>
                 <p className="text-2xl font-display font-bold tracking-tight">{stat.value}</p>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">{stat.label}</p>
              </Card>
           ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 p-8 border-none shadow-sm bg-muted/10 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" /> Engagement Waveform
                 </h2>
                 <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-xs h-7 rounded-lg">Last 7 Days</Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 rounded-lg text-muted-foreground">Last Month</Button>
                 </div>
              </div>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DATA}>
                       <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="name" hide />
                       <YAxis hide />
                       <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="users" 
                          stroke="var(--primary)" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorUsers)" 
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <Card className="p-8 border-none shadow-sm bg-primary text-primary-foreground rounded-[2.5rem] flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
              <div>
                 <TrendingUp className="w-10 h-10 mb-6 opacity-80" />
                 <h2 className="text-2xl font-display font-bold leading-tight mb-4">Strategic <br /> Institutional Insights</h2>
                 <p className="text-sm font-light opacity-80 leading-relaxed mb-6">
                    Enrollment trends are up 8% in the Science department. System throughput remains optimal.
                 </p>
              </div>
              <Button variant="secondary" className="w-full rounded-2xl h-12 font-bold text-xs uppercase tracking-widest">
                 Full Audit Report
              </Button>
           </Card>
        </div>

        {/* User Management Simulation */}
        <div>
           <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                 <Users className="w-5 h-5 text-primary" /> Active Permissions
              </h2>
              <div className="flex gap-2">
                 <Input placeholder="Filter users..." className="h-9 w-64 bg-muted/30 border-none rounded-xl" />
                 <Button variant="outline" size="sm" className="rounded-xl">Filter</Button>
              </div>
           </div>
           <Card className="border-none shadow-sm bg-background/50 rounded-[2rem] overflow-hidden">
              <Table>
                 <TableHeader className="bg-muted/10">
                    <TableRow className="border-none">
                       <TableHead className="pl-8 uppercase text-[10px] font-bold tracking-widest">Name</TableHead>
                       <TableHead className="uppercase text-[10px] font-bold tracking-widest">Role</TableHead>
                       <TableHead className="uppercase text-[10px] font-bold tracking-widest">Department</TableHead>
                       <TableHead className="uppercase text-[10px] font-bold tracking-widest">Status</TableHead>
                       <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {[
                       { name: "Dr. Elena Vance", role: "Faculty", dept: "Theoretical Physics", status: "Active" },
                       { name: "Gordon Freeman", role: "Student", dept: "Quantum Research", status: "On Leave" },
                       { name: "Barney Calhoun", role: "Admin", dept: "Operations", status: "Active" },
                    ].map((user, i) => (
                       <TableRow key={i} className="hover:bg-muted/5 border-b border-muted/30 transition-colors group">
                          <TableCell className="py-5 pl-8">
                             <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8 rounded-lg border">
                                   <AvatarFallback className="rounded-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-sm">{user.name}</span>
                             </div>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="rounded-lg text-[10px]">{user.role}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{user.dept}</TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                <span className="text-xs font-medium">{user.status}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <Button variant="ghost" size="icon" className="rounded-xl">
                                <MoreHorizontal className="w-4 h-4" />
                             </Button>
                          </TableCell>
                       </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
