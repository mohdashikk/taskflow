"use client";

import { useParams, useRouter } from "next/navigation";
import { Avatar, Box, Button, Chip, CircularProgress, LinearProgress, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProject } from "@/features/projects/hooks/useProject";
import { useProjectStatuses } from "@/features/projects/hooks/useProjectStatuses";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import WorkspaceCard from "@/features/projects/components/WorkspaceCard";

const priorityColors: Record<string, string> = { high: "#EF4444", medium: "#F59E0B", low: "#22C55E" };
const formatDate = (date?: string | null) => date ? new Date(date).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "Not set";

export default function OverviewPage() {
  const { id } = useParams<{ id: string }>(); const router = useRouter(); const { user } = useAuth();
  const { data: project } = useProject(id, user?.id); const { data: tasks = [], isLoading } = useTasks(id, user?.id); const { data: statuses = [] } = useProjectStatuses(id);
  const doneStatusIds = new Set(statuses.filter(s => /done|complete/i.test(s.name)).map(s => s.id));
  const progressStatusIds = new Set(statuses.filter(s => /progress|doing/i.test(s.name)).map(s => s.id));
  const done = tasks.filter(t => Boolean(t.completed_at) || doneStatusIds.has(t.status_id)).length;
  const inProgress = tasks.filter(t => !t.completed_at && progressStatusIds.has(t.status_id)).length;
  const todo = Math.max(tasks.length - done - inProgress, 0); const progress = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date(new Date().toDateString()) && !t.completed_at && !doneStatusIds.has(t.status_id)).length;
  const daysLeft = project?.due_date ? Math.ceil((new Date(project.due_date).getTime() - Date.now()) / 86400000) : null;
  const recentTasks = [...tasks].sort((a,b)=>b.updated_at.localeCompare(a.updated_at)).slice(0,5);
  const metrics = [
    { label:"Total tasks", value:tasks.length, helper:"Across this project", color:"#00A15D", icon:<PlaylistAddCheckRoundedIcon/> },
    { label:"In progress", value:inProgress, helper:"Actively being worked", color:"#00A15D", icon:<PendingActionsRoundedIcon/> },
    { label:"Completed", value:done, helper:`${progress}% completion rate`, color:"#09BD3C", icon:<CheckCircleRoundedIcon/> },
    { label:"Overdue", value:overdue, helper:overdue ? "Needs attention" : "Everything on track", color:overdue ? "#EF4444" : "#22C55E", icon:<FlagRoundedIcon/> },
  ];

  if (isLoading) return <Box sx={{display:"grid",placeItems:"center",minHeight:360}}><CircularProgress size={30}/></Box>;

  return <Box sx={{display:"grid",gap:"30px"}}>
    <Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:3,flexWrap:{xs:"wrap",sm:"nowrap"},p:{xs:"24px",md:"30px"},minHeight:150,borderRadius:"20px",color:"white",background:"linear-gradient(110deg,#00A15D,#007B48 62%,#00A15D)",position:"relative",overflow:"hidden"}}>
      <Box sx={{position:"relative",zIndex:1}}><Typography sx={{fontSize:{xs:22,md:26},fontWeight:700,maxWidth:560}}>Keep {project?.title ?? "your project"} moving forward</Typography><Typography sx={{fontSize:14,mt:1.25,opacity:.9,maxWidth:560}}>Track the work, focus on the next priority, and deliver each milestone with your team.</Typography></Box>
      <Button variant="contained" onClick={()=>router.push(`/projects/${id}/tasks`)} sx={{position:"relative",zIndex:1,bgcolor:"white",color:"#173A2B",borderRadius:"30px",px:3.5,height:52,whiteSpace:"nowrap","&:hover":{bgcolor:"#E8F5EF"}}}>Open tasks</Button>
      <Box sx={{position:"absolute",width:220,height:220,border:"1px solid rgba(255,255,255,.13)",borderRadius:"50%",right:120,top:-70}} />
    </Box>
    <Box sx={{display:"grid",gridTemplateColumns:{xs:"1fr",sm:"repeat(2,1fr)",xl:"repeat(4,1fr)"},gap:"30px"}}>
      {metrics.map(metric=><WorkspaceCard key={metric.label} sx={{p:"30px",minHeight:160,position:"relative",overflow:"hidden","&::after":{content:'""',position:"absolute",width:90,height:90,borderRadius:"50%",right:-34,top:-38,bgcolor:metric.color,opacity:.055}}}>
        <Box sx={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:2}}><Box><Typography color="text.secondary" sx={{fontSize:12.5,fontWeight:600}}>{metric.label}</Typography><Typography sx={{fontSize:28,fontWeight:780,letterSpacing:"-.03em",mt:.4}}>{metric.value}</Typography></Box><Box sx={{width:40,height:40,borderRadius:1,display:"grid",placeItems:"center",color:metric.color,bgcolor:`${metric.color}14`}}>{metric.icon}</Box></Box>
        <Typography color="text.secondary" sx={{fontSize:11.5,mt:1}}>{metric.helper}</Typography>
      </WorkspaceCard>)}
    </Box>

    <Box sx={{display:"grid",gridTemplateColumns:{xs:"1fr",lg:"1.35fr .65fr"},gap:"30px"}}>
      <WorkspaceCard sx={{p:{xs:"22px",sm:"30px"},minHeight:380,display:"flex",flexDirection:"column"}}>
        <Box sx={{display:"flex",alignItems:{xs:"flex-start",sm:"center"},justifyContent:"space-between",gap:2,mb:{xs:3,sm:4}}}>
          <Box><Typography sx={{fontWeight:600,fontSize:18,lineHeight:1.35}}>Project health</Typography><Typography color="text.secondary" sx={{fontSize:12.5,mt:.5}}>Progress calculated from your database tasks</Typography></Box>
          <Chip size="small" label={progress===100?"Complete":overdue?"At risk":"On track"} color={progress===100?"success":overdue?"error":"primary"} sx={{flexShrink:0,minWidth:78}}/>
        </Box>
        <Box sx={{display:"grid",gridTemplateColumns:{xs:"1fr",sm:"210px minmax(0,1fr)"},columnGap:{sm:5,md:6},rowGap:4,alignItems:"center",flex:1}}>
          <Box sx={{width:{xs:168,sm:190},height:{xs:168,sm:190},borderRadius:"50%",display:"grid",placeItems:"center",justifySelf:"center",background:`conic-gradient(#00A15D ${progress*3.6}deg, rgba(0,161,93,.10) 0)`,position:"relative","&::after":{content:'""',position:"absolute",inset:{xs:16,sm:18},borderRadius:"50%",bgcolor:"background.paper"}}}>
            <Box sx={{position:"relative",zIndex:1,textAlign:"center"}}><Typography sx={{fontWeight:700,fontSize:{xs:28,sm:30},lineHeight:1.1,color:"primary.main"}}>{progress}%</Typography><Typography color="text.secondary" sx={{fontSize:11,mt:.5}}>complete</Typography></Box>
          </Box>
          <Box sx={{display:"grid",gap:3,width:"100%"}}>
            {[["Completed",done,"#00A15D"],["In progress",inProgress,"#45C367"],["To do",todo,"#A8A6B8"]].map(([label,value,color])=><Box key={String(label)} sx={{minWidth:0}}><Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:2,mb:1}}><Box sx={{display:"flex",alignItems:"center",gap:1.25,minWidth:0}}><Box sx={{width:9,height:9,borderRadius:"50%",bgcolor:String(color),flexShrink:0}}/><Typography noWrap sx={{fontSize:13,fontWeight:600}}>{label}</Typography></Box><Typography color="text.secondary" sx={{fontSize:12,whiteSpace:"nowrap"}}>{value} {Number(value)===1?"task":"tasks"}</Typography></Box><LinearProgress variant="determinate" value={tasks.length ? Number(value)/tasks.length*100 : 0} sx={{height:7,borderRadius:8,bgcolor:"action.hover","& .MuiLinearProgress-bar":{bgcolor:String(color),borderRadius:8}}}/></Box>)}
          </Box>
        </Box>
      </WorkspaceCard>

      <WorkspaceCard sx={{p:"30px",minHeight:380}}><Typography sx={{fontWeight:600,fontSize:18,mb:3}}>Project details</Typography>
        <Box sx={{display:"grid",gap:2.25}}>{[["Start date",formatDate(project?.start_date),<CalendarMonthRoundedIcon key="start"/>],["Deadline",formatDate(project?.due_date),<FlagRoundedIcon key="due"/>]].map(([label,value,icon])=><Box key={String(label)} sx={{display:"flex",gap:1.5,alignItems:"center"}}><Box sx={{width:36,height:36,borderRadius:1,display:"grid",placeItems:"center",bgcolor:"action.hover",color:"primary.main","& svg":{fontSize:18}}}>{icon}</Box><Box><Typography color="text.secondary" sx={{fontSize:11.5}}>{label}</Typography><Typography sx={{fontSize:13.5,fontWeight:650,mt:.2}}>{value}</Typography></Box></Box>)}</Box>
        <Box sx={{mt:2.5,p:2,borderRadius:1,bgcolor:"action.hover"}}><Typography color="text.secondary" sx={{fontSize:11.5}}>Time remaining</Typography><Typography sx={{fontSize:15,fontWeight:700,mt:.4}}>{daysLeft===null?"No deadline":daysLeft<0?`${Math.abs(daysLeft)} days overdue`:daysLeft===0?"Due today":`${daysLeft} days left`}</Typography></Box>
        <Box sx={{display:"flex",alignItems:"center",gap:1.25,mt:2.5,pt:2.5,borderTop:"1px solid",borderColor:"divider"}}><Avatar sx={{width:34,height:34,bgcolor:"primary.main",fontSize:13}}>{(user?.user_metadata?.display_name||user?.email||"Y").charAt(0).toUpperCase()}</Avatar><Box><Typography sx={{fontSize:13,fontWeight:650}}>{user?.user_metadata?.display_name||"You"}</Typography><Typography color="text.secondary" sx={{fontSize:11.5}}>Project owner</Typography></Box></Box>
      </WorkspaceCard>
    </Box>

    <WorkspaceCard sx={{overflow:"hidden"}}><Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",p:"30px",borderBottom:"1px solid",borderColor:"divider"}}><Box><Typography sx={{fontWeight:600,fontSize:18}}>Recent tasks</Typography><Typography color="text.secondary" sx={{fontSize:12.5,mt:.5}}>Latest updates from this project</Typography></Box><Button size="small" endIcon={<ArrowForwardRoundedIcon/>} onClick={()=>router.push(`/projects/${id}/tasks`)}>View all</Button></Box>
      {recentTasks.length===0?<Box sx={{textAlign:"center",py:6}}><RadioButtonUncheckedRoundedIcon sx={{color:"text.disabled",fontSize:34}}/><Typography sx={{fontWeight:600,mt:1}}>No tasks yet</Typography><Typography color="text.secondary" sx={{fontSize:13,mt:.4}}>Create your first task to start tracking progress.</Typography></Box>:recentTasks.map((task,index)=><Box key={task.id} sx={{display:"grid",gridTemplateColumns:{xs:"1fr auto",sm:"1fr 120px 120px"},gap:2,alignItems:"center",px:"30px",py:2,borderBottom:index<recentTasks.length-1?"1px solid":0,borderColor:"divider","&:hover":{bgcolor:"action.hover"}}}><Box sx={{display:"flex",alignItems:"center",gap:1.5,minWidth:0}}><CheckCircleRoundedIcon sx={{fontSize:19,color:task.completed_at||doneStatusIds.has(task.status_id)?"success.main":"text.disabled"}}/><Box sx={{minWidth:0}}><Typography noWrap sx={{fontSize:13.5,fontWeight:600}}>{task.title}</Typography><Typography color="text.secondary" sx={{fontSize:11.5}}>{statuses.find(s=>s.id===task.status_id)?.name||"No status"}</Typography></Box></Box><Chip size="small" label={task.priority} sx={{justifySelf:"start",textTransform:"capitalize",color:priorityColors[task.priority?.toLowerCase()]||"text.secondary",bgcolor:`${priorityColors[task.priority?.toLowerCase()]||"#A8A6B8"}14`,display:{xs:"none",sm:"flex"}}}/><Typography color="text.secondary" sx={{fontSize:12,textAlign:"right"}}>{formatDate(task.due_date)}</Typography></Box>)}
    </WorkspaceCard>
  </Box>;
}
