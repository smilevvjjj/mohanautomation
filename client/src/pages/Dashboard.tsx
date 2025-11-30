import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  ArrowUpRight,
  Calendar,
  Instagram
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useApiClient } from "@/lib/api";
import { format } from "date-fns";

const data = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 550 },
  { name: "Thu", value: 450 },
  { name: "Fri", value: 650 },
  { name: "Sat", value: 600 },
  { name: "Sun", value: 800 },
];

const stats = [
  {
    title: "Total Followers",
    value: "12,453",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "Avg. Engagement",
    value: "4.8%",
    change: "+2.1%",
    trend: "up",
    icon: Heart,
    color: "text-secondary",
    bg: "bg-secondary/10"
  },
  {
    title: "Total Interactions",
    value: "8,234",
    change: "+5.4%",
    trend: "up",
    icon: MessageCircle,
    color: "text-accent",
    bg: "bg-accent/10"
  },
];

export default function Dashboard() {
  const api = useApiClient();
  
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activity"],
    queryFn: () => api.get("/activity?limit=10"),
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25" data-testid="button-filter-date">
            <Calendar className="mr-2 h-4 w-4" />
            Last 7 Days
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid={`text-stat-${i}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="text-green-500 flex items-center font-medium mr-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </span>
                  from last week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Engagement Growth</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(348 77% 57%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(348 77% 57%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(348 77% 57%)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center text-muted-foreground">Loading...</div>
                ) : activities.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Instagram className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No activity yet</p>
                  </div>
                ) : (
                  activities.map((activity: any, i: number) => (
                    <div key={i} className="flex items-center" data-testid={`activity-item-${i}`}>
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center mr-3">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.details || activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.createdAt), "PPp")}
                        </p>
                      </div>
                      <div className="ml-auto font-medium text-sm text-primary">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
