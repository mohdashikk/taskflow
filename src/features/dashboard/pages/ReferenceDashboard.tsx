"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDashboardData } from "../hooks/useDashboardData";

const panel = { bgcolor:"background.paper", border:"1px solid", borderColor:"divider", borderRadius:"20px", p:{xs:2.5,lg:3.5}, boxShadow:"0 3px 6px rgba(20,30,25,.035)" };

export default function ReferenceDashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { stats, tasks, projects, upcomingDeadlines, isLoading, error } = useDashboardData();
  const [period, setPeriod] = useState<7 | 30 | 180>(180);
  if (authLoading || isLoading) return <Box sx={{py:12,textAlign:"center"}}><CircularProgress aria-label="Loading dashboard" /></Box>;
  if (!isAuthenticated) return <Alert severity="info">Sign in to view your dashboard.</Alert>;
  if (error) return <Alert severity="error">Unable to load dashboard data. Please refresh and try again.</Alert>;
  const total = tasks.length;
  const percent = total ? Math.round(stats.completedTasks / total * 100) : 0;
  const buckets = Array.from({length:6}, (_, i) => {
    const end = new Date(); end.setHours(23,59,59,999); end.setDate(end.getDate() - Math.floor((5-i)*period/6));
    const start = new Date(); start.setHours(0,0,0,0); start.setDate(start.getDate()-Math.floor((6-i)*period/6)+1);
    const within = (value:string|null) => value && new Date(value)>=start && new Date(value)<=end;
    return {label:end.toLocaleDateString("en-US",{month:"short",day:"numeric"}), created:tasks.filter(t=>within(t.created_at)).length, completed:tasks.filter(t=>within(t.completed_at)).length};
  });
  const max = Math.max(4,...buckets.flatMap(b=>[b.created,b.completed]));
  const line = (key:"created"|"completed") => buckets.map((b,i)=>`${54+i*122},${250-b[key]/max*210}`).join(" ");
  return <Box sx={{display:"grid",gridTemplateColumns:{xs:"1fr",xl:"1fr 1fr"},gap:{xs:2.5,lg:3.5}}}>
    <Box sx={{display:"grid",gap:3.5,alignContent:"start"}}>
      <Box sx={{display:"grid",gridTemplateColumns:{xs:"1fr",sm:"1fr 1fr"},gap:3.5}}>
        <Box sx={{...panel,minHeight:{sm:510},display:"flex",flexDirection:"column"}}>
          <Typography sx={{fontSize:16}}>Your workload</Typography>
          <Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between",mt:2}}><Typography sx={{fontSize:32,fontWeight:750}}>{stats.openTasks}</Typography><Box component={Link} href="/projects" aria-label="Open projects" sx={{width:48,height:48,borderRadius:"50%",bgcolor:"primary.main",color:"white",display:"grid",placeItems:"center",fontSize:27,textDecoration:"none"}}>↗</Box></Box>
          <Typography color="text.secondary" sx={{fontSize:14,mt:1}}>Open tasks across {stats.totalProjects} projects</Typography>
          <Box sx={{mt:4,display:"grid",gap:2.5}}>{[["Due today",stats.dueToday],["Completed",stats.completedTasks],["Total tasks",total]].map(([label,value])=><Box key={label} sx={{display:"flex",justifyContent:"space-between",pb:2.5,borderBottom:"1px solid",borderColor:"divider"}}><Typography color="text.secondary">{label}</Typography><Typography sx={{fontWeight:700}}>{value}</Typography></Box>)}</Box>
          <Typography sx={{mt:"auto",pt:3,color:"primary.main",fontSize:13}}>A clear view of what comes next.</Typography>
        </Box>
        <Box sx={{...panel,minHeight:{sm:510},textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <Box sx={{position:"relative",width:{xs:180,lg:210},height:{xs:180,lg:210},mb:5}}><CircularProgress variant="determinate" value={100} size="100%" thickness={6} sx={{color:"action.selected",position:"absolute",inset:0}}/><CircularProgress variant="determinate" value={percent} size="100%" thickness={6} sx={{position:"absolute",inset:0,color:"primary.main"}}/><Box sx={{position:"absolute",inset:0,display:"grid",placeItems:"center",fontSize:26,fontWeight:700,color:"primary.main"}}>{percent}%</Box></Box>
          <Typography sx={{fontSize:17,fontWeight:650}}>Overall completion</Typography>
          <Typography sx={{fontSize:21,fontWeight:750,mt:3}}>Every task brings you closer.</Typography>
          <Typography color="text.secondary" sx={{fontSize:14,lineHeight:1.8,mt:1.5}}>{total ? `${stats.completedTasks} of ${total} tasks completed across your workspace.` : "Create your first project and add tasks to see your progress here."}</Typography>
        </Box>
      </Box>
      <Box sx={panel}><Typography sx={{fontSize:20,fontWeight:750,mb:3}}>Your projects</Typography>{projects.length ? projects.slice(0,5).map(p=><Box component={Link} href={`/projects/${p.id}/overview`} key={p.id} sx={{display:"flex",justifyContent:"space-between",gap:2,py:2,borderTop:"1px solid",borderColor:"divider",color:"inherit",textDecoration:"none","&:hover":{color:"primary.main"}}}><Typography sx={{fontWeight:600}}>{p.name}</Typography><Typography color="text.secondary" sx={{fontSize:13,textTransform:"capitalize"}}>{p.status} ↗</Typography></Box>):<Typography color="text.secondary">No projects yet.</Typography>}</Box>
    </Box>
    <Box sx={{display:"grid",gap:3.5,alignContent:"start"}}>
      <Box sx={{...panel,border:0,minHeight:186,color:"white",background:"linear-gradient(110deg,#00A768,#007648 58%,#00A768)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:3,flexWrap:{xs:"wrap",sm:"nowrap"}}}><Box><Typography sx={{fontSize:{xs:23,lg:26},fontWeight:750,lineHeight:1.3,maxWidth:370}}>Manage your projects in one place</Typography><Typography sx={{mt:1.5,fontSize:15,lineHeight:1.7,maxWidth:350}}>Plan your next step. Track your progress. Bring your ideas to life.</Typography></Box><Button component={Link} href="/projects/new" sx={{bgcolor:"white",color:"#173A2B",borderRadius:"30px",px:3,height:54,whiteSpace:"nowrap","&:hover":{bgcolor:"#E6F5EE"}}}>New project</Button></Box>
      <Box sx={panel}><Box sx={{display:"flex",justifyContent:"space-between",gap:2,flexWrap:"wrap",mb:2}}><Typography sx={{fontSize:20,fontWeight:750}}>Task statistics</Typography><Box sx={{display:"flex",gap:.5}}>{([7,30,180] as const).map(p=><Button key={p} size="small" onClick={()=>setPeriod(p)} sx={{minWidth:40,height:30,borderRadius:"16px",bgcolor:period===p?"action.selected":"transparent",color:period===p?"primary.main":"text.secondary"}}>{p===7?"Week":p===30?"Month":"6 months"}</Button>)}</Box></Box>
        <Box sx={{display:"flex",gap:3,mb:3,fontSize:12,color:"text.secondary"}}><span style={{color:"#00A768"}}>● Created</span><span style={{color:"#FF6257"}}>● Completed</span></Box>
        <Box component="svg" viewBox="0 0 700 295" role="img" aria-label="Tasks created and completed over the selected period" sx={{width:"100%",height:"auto",minHeight:220,overflow:"visible"}}>{[0,1,2,3,4].map(i=><g key={i}><line x1="54" x2="664" y1={250-i*52.5} y2={250-i*52.5} stroke="currentColor" opacity=".1" strokeDasharray="5 6"/><text x="35" y={255-i*52.5} fontSize="12" fill="currentColor" textAnchor="end">{Math.round(max*i/4)}</text></g>)}<polyline points={line("created")} fill="none" stroke="#00A768" strokeWidth="4" strokeLinejoin="round"/><polyline points={line("completed")} fill="none" stroke="#FF6257" strokeWidth="4" strokeLinejoin="round"/>{buckets.map((b,i)=><text key={i} x={54+i*122} y="280" textAnchor="middle" fontSize="11" fill="currentColor">{b.label}</text>)}</Box>
        {!total && <Typography color="text.secondary" sx={{fontSize:13,mt:1}}>No task activity yet. Your data will appear here as you work.</Typography>}
      </Box>
      <Box sx={panel}><Typography sx={{fontSize:20,fontWeight:750,mb:2}}>Upcoming deadlines</Typography>{upcomingDeadlines.length?upcomingDeadlines.slice(0,4).map(t=><Box component={Link} href={`/projects/${t.projectId ?? tasks.find(task=>task.id===t.id)?.project_id}/tasks`} key={t.id} sx={{display:"flex",justifyContent:"space-between",gap:2,py:2,borderTop:"1px solid",borderColor:"divider",textDecoration:"none",color:"inherit"}}><Typography sx={{fontSize:14,fontWeight:600}}>{t.title}</Typography><Typography color="text.secondary" sx={{fontSize:13,whiteSpace:"nowrap"}}>{new Date(t.dueDate).toLocaleDateString()}</Typography></Box>):<Typography color="text.secondary">No upcoming deadlines.</Typography>}</Box>
    </Box>
  </Box>;
}
