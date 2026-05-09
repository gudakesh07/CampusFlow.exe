import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Users, Send, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

const INITIAL_GROUPS = [
  { id: 1, name: "PHYS-301 Fall 2026", members: 42, active: true },
  { id: 2, name: "CS-402 Discussion", members: 28, active: true },
  { id: 3, name: "Quantum Physics Lab Group A", members: 15, active: false },
];

export default function FacultyGroupsPage() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendAnnouncement = (groupName: string) => {
    toast.success(`Announcement module opened for ${groupName}`);
  };

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-8 p-4 sm:p-0">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-[2.5rem] p-8 border border-primary/10 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative z-10 w-full">
            <h1 className="text-4xl font-display font-extrabold tracking-tight">Student Groups</h1>
            <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed font-medium">Communicate with entire cohorts or specific lab groups.</p>
            <div className="mt-6 max-w-md w-full">
              <div className="relative">
                 <Search className="w-4 h-4 absolute left-4 top-3.5 text-muted-foreground" />
                 <Input 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search groups..." 
                   className="pl-10 rounded-xl h-11 bg-background shadow-sm border-none focus-visible:ring-primary/20" 
                 />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 border-none shadow-sm bg-muted/10 hover:bg-muted/20 transition-all rounded-[2.5rem] flex flex-col gap-4 group cursor-pointer h-full">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  {group.active && <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 mr-2" />}
                </div>
                
                <div>
                  <h2 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{group.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    {group.members} Enrolled Students
                  </p>
                </div>

                <div className="mt-auto pt-4 flex gap-2">
                  <Button onClick={() => handleSendAnnouncement(group.name)} className="flex-1 rounded-xl bg-background hover:bg-primary/5 text-foreground hover:text-primary border shadow-sm">
                    <Send className="w-4 h-4 mr-2 text-primary group-hover:text-primary" /> Send Announcement
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {filteredGroups.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
               No student groups found matching your search.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
