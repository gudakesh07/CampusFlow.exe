import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Bell, Search, Users, Send, Smile, MoreVertical, Sparkles, Image as ImageIcon, X, Plus, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, orderBy, query, setDoc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const EMOJIS = ["👍", "🔥", "😂", "❤️", "🙌", "🤔", "👀", "✨"];

export default function CommunicationHub() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [groups, setGroups] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch groups
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "groups"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const g = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(g);
      
      // Select first group if none selected
      if (!groupId && g.length > 0) {
        navigate(`/dashboard/student/messages/${g[0].id}`, { replace: true });
      }
    });
    return () => unsubscribe();
  }, [user, groupId, navigate]);

  // Handle joining a group from URL
  useEffect(() => {
    async function checkGroup() {
      if (groupId && user) {
        try {
          const docRef = doc(db, "groups", groupId);
          const snap = await getDoc(docRef);
          if (!snap.exists()) {
            toast.error("Group not found!");
            navigate("/dashboard/student/messages");
          } else {
            const data = snap.data();
            if (!data.members?.includes(user.uid)) {
              // Join the group
              await updateDoc(docRef, {
                members: arrayUnion(user.uid),
                memberCount: increment(1)
              });
              toast.success("Joined group successfully!");
            }
          }
        } catch (e: any) {
          toast.error("Error joining group: " + e.message);
        }
      }
    }
    checkGroup();
  }, [groupId, user, navigate]);

  // Fetch messages
  useEffect(() => {
    if (!groupId || !user) return;
    const q = query(collection(db, "groups", groupId, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      // Scroll to bottom
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, [groupId, user]);

  const activeGroup = groups.find(g => g.id === groupId) || null;

  const handleCreateGroup = async () => {
    if (!user) return;
    try {
      const newGroupId = uuidv4();
      const groupData = {
        name: "New Friends Group",
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        members: [user.uid],
        memberCount: 1
      };
      await setDoc(doc(db, "groups", newGroupId), groupData);
      navigate(`/dashboard/student/messages/${newGroupId}`);
      toast.success("New group created!");
    } catch (e: any) {
      toast.error("Failed to create group: " + e.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Group link copied to clipboard!");
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedImage) || !user || !groupId) return;
    
    try {
      const messageId = uuidv4();
      const messageData = {
        text: inputValue,
        senderId: user.uid,
        senderName: user.displayName || "Student",
        timestamp: new Date().toISOString(),
        imageUrl: selectedImage || ""
      };
      
      await setDoc(doc(db, "groups", groupId, "messages", messageId), messageData);
      
      setInputValue("");
      setSelectedImage(null);
    } catch (e: any) {
      toast.error("Failed to send message: " + e.message);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic resize for base64 storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          setSelectedImage(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout role="student">
      <div className="flex-1 flex gap-4 md:gap-8 w-full h-[calc(100vh-10rem)] min-h-[500px] mt-2 pb-4">
        {/* Channel List */}
        <div className="w-80 flex flex-col gap-6 bg-background/50 p-4 rounded-[2.5rem] border shadow-sm hidden md:flex">
           <div className="flex justify-between items-center px-4 pt-2">
              <h1 className="text-2xl font-display font-bold tracking-tight">Channels</h1>
              <Button onClick={handleCreateGroup} variant="ghost" size="icon" className="rounded-xl"><Plus className="w-4 h-4" /></Button>
           </div>
           
           <ScrollArea className="flex-1 pr-2">
              <div className="space-y-2">
                 {groups.map(group => (
                    <button 
                      key={group.id} 
                      onClick={() => navigate(`/dashboard/student/messages/${group.id}`)}
                      className={`w-full text-left p-4 rounded-3xl transition-all flex items-center gap-4 ${
                        activeGroup?.id === group.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' : 'hover:bg-muted/60'
                      }`}
                    >
                       <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${
                         activeGroup?.id === group.id ? 'bg-white/25' : 'bg-primary/10 text-primary'
                       }`}>
                          <Users className="w-6 h-6" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate tracking-tight">{group.name}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                            activeGroup?.id === group.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                          }`}>{group.memberCount} Members</p>
                       </div>
                    </button>
                 ))}
                 {groups.length === 0 && (
                   <div className="text-center p-8 text-muted-foreground text-sm font-medium">
                     No groups yet. Click the + icon to create one.
                   </div>
                 )}
              </div>
           </ScrollArea>
        </div>

        {/* Chat Area */}
        <Card className="flex-1 border-none shadow-xl rounded-[2.5rem] md:rounded-[3rem] bg-muted/10 overflow-hidden flex flex-col min-h-0">
           {/* Chat Header */}
           {activeGroup ? (
             <>
               <div className="p-4 md:p-6 border-b bg-background/50 flex justify-between items-center backdrop-blur-md shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                        <Users className="w-6 h-6" />
                     </div>
                     <div>
                        <h2 className="text-xl font-display font-bold tracking-tight line-clamp-1">{activeGroup.name}</h2>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">General Discussion • {activeGroup.memberCount} Members</p>
                     </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                     <Button onClick={handleCopyLink} variant="secondary" className="rounded-xl h-10 px-4 font-bold tracking-tight shadow-sm text-xs hidden sm:flex items-center gap-2">
                       <Share2 className="w-3.5 h-3.5" />
                       Share Group Link
                     </Button>
                     <Button onClick={handleCopyLink} variant="secondary" size="icon" className="rounded-xl h-10 w-10 shadow-sm sm:hidden"><Share2 className="w-4 h-4" /></Button>
                  </div>
               </div>

               {/* Message Area */}
               <ScrollArea className="flex-1 p-4 md:p-8">
                  <div className="space-y-6 md:space-y-8 pb-4">
                     {messages.length === 0 && (
                       <div className="text-center pt-20 text-muted-foreground font-medium flex flex-col items-center">
                         <Sparkles className="w-8 h-8 mb-4 opacity-50" />
                         <p>No messages yet. Be the first to say hi!</p>
                       </div>
                     )}
                     {messages.map((msg) => {
                        const isSelf = msg.senderId === user?.uid;
                        return (
                          <div key={msg.id} className={`flex gap-3 md:gap-4 ${isSelf ? 'flex-row-reverse' : ''}`}>
                             <Avatar className="w-10 h-10 border rounded-2xl shadow-sm shrink-0">
                                <AvatarFallback className="rounded-2xl font-bold bg-primary/5 text-primary">{msg.senderName[0]}</AvatarFallback>
                             </Avatar>
                             <div className={`space-y-1.5 w-full flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-center gap-2 flex-wrap ${isSelf ? 'flex-row-reverse' : ''}`}>
                                   <span className="text-sm font-bold tracking-tight">{isSelf ? "You" : msg.senderName}</span>
                                   <span className="text-[10px] text-muted-foreground font-semibold">{formatTime(msg.timestamp)}</span>
                                </div>
                                <div className={`max-w-2xl shadow-sm border p-4 ${
                                  isSelf 
                                    ? 'bg-primary text-primary-foreground rounded-3xl rounded-tr-none border-primary/20' 
                                    : 'bg-background text-foreground/90 rounded-3xl rounded-tl-none border-muted/30'
                                }`}>
                                   {msg.imageUrl && (
                                     <img src={msg.imageUrl} alt="attached" className="rounded-xl mb-3 max-w-[200px] sm:max-w-xs object-cover shadow-sm" />
                                   )}
                                   <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                      {msg.text}
                                   </p>
                                </div>
                             </div>
                          </div>
                        )
                     })}
                     <div ref={messagesEndRef} />
                  </div>
               </ScrollArea>

               {/* Input Area */}
               <div className="p-4 md:p-6 bg-background/50 border-t backdrop-blur-md shrink-0">
                  {selectedImage && (
                    <div className="mb-4 relative inline-block">
                      <div className="relative rounded-2xl overflow-hidden border shadow-sm">
                        <img src={selectedImage} alt="Upload preview" className="h-32 object-cover" />
                      </div>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-md"
                        onClick={() => setSelectedImage(null)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-end gap-3 md:gap-4">
                     <div className="relative flex-1 bg-background rounded-[2rem] shadow-sm border border-muted/50 p-1.5">
                        <Input 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                          }}
                          placeholder={`Message in ${activeGroup.name}...`} 
                          className="h-12 rounded-[1.5rem] pl-5 pr-[110px] bg-transparent border-none shadow-none focus-visible:ring-0 text-base"
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex gap-1">
                           <Popover>
                             <PopoverTrigger asChild>
                               <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted/50"><Smile className="w-5 h-5" /></Button>
                             </PopoverTrigger>
                             <PopoverContent className="w-auto p-2 rounded-2xl" align="end" sideOffset={10}>
                               <div className="grid grid-cols-4 gap-2">
                                 {EMOJIS.map(emoji => (
                                   <button 
                                     key={emoji} 
                                     className="w-10 h-10 hover:bg-muted rounded-xl flex items-center justify-center text-xl transition-colors"
                                     onClick={() => setInputValue(prev => prev + emoji)}
                                   >
                                     {emoji}
                                   </button>
                                 ))}
                               </div>
                             </PopoverContent>
                           </Popover>
                           
                           <input 
                             type="file" 
                             accept="image/*" 
                             className="hidden" 
                             ref={fileInputRef} 
                             onChange={handleImageUpload}
                           />
                           <Button 
                             size="icon" 
                             variant="ghost" 
                             className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted/50"
                             onClick={() => fileInputRef.current?.click()}
                           >
                             <ImageIcon className="w-4 h-4" />
                           </Button>
                        </div>
                     </div>
                     <Button onClick={handleSendMessage} className="h-[60px] w-[60px] md:h-14 md:w-14 rounded-full shadow-xl shadow-primary/25 shrink-0 bg-primary hover:bg-primary/90 transition-transform active:scale-95">
                        <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
                     </Button>
                  </div>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
               <Users className="w-16 h-16 mb-4 opacity-20" />
               <h3 className="text-xl font-display font-bold mb-2 text-foreground">No Group Selected</h3>
               <p className="max-w-sm mb-6">Create a new group or ask a friend for their group link to start chatting!</p>
               <Button onClick={handleCreateGroup} size="lg" className="rounded-2xl shadow-lg shadow-primary/20">
                 Create Your First Group
               </Button>
             </div>
           )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
