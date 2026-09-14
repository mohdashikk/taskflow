"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, Chip, CircularProgress, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchMilestones } from "@/features/projects/services/milestonesService";
import WorkspaceCard from "@/features/projects/components/WorkspaceCard";

export default function PlanPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["milestones", id, user?.id],
    queryFn: () => fetchMilestones(id, user!.id),
    enabled: Boolean(id && user?.id),
  });

  return <Box>
    <Box sx={{ mb: 2.5 }}><Typography variant="h6" sx={{ fontWeight: 750 }}>Project milestones</Typography><Typography color="text.secondary" sx={{ fontSize: 13 }}>Only milestones stored in Supabase are shown here.</Typography></Box>
    {isLoading && <Box sx={{display:"grid",placeItems:"center",py:8}}><CircularProgress size={28}/></Box>}
    {error && <Alert severity="error">{error instanceof Error ? error.message : "Could not load milestones."}</Alert>}
    {!isLoading && !error && data.length === 0 && <WorkspaceCard sx={{p:6,textAlign:"center"}}><FlagOutlinedIcon sx={{fontSize:38,color:"text.disabled",mb:1}}/><Typography sx={{fontWeight:700}}>No milestones in the database</Typography><Typography color="text.secondary" sx={{fontSize:14,mt:.5}}>Add rows to project_milestones for this project to display them here.</Typography></WorkspaceCard>}
    {!isLoading && !error && data.length > 0 && <WorkspaceCard sx={{ p:{xs:2,sm:3} }}>{data.map((milestone,i) => <Box key={milestone.id} sx={{ display:"grid", gridTemplateColumns:{xs:"40px 1fr",sm:"48px 1fr 110px 110px"}, gap:1.5, alignItems:"center", py:2, borderBottom:i < data.length-1 ? "1px solid" : 0, borderColor:"divider" }}>
      <Box sx={{ width:34,height:34,borderRadius:2,bgcolor:milestone.status==="completed"?"success.main":"action.hover",color:milestone.status==="completed"?"white":"primary.main",display:"grid",placeItems:"center",fontWeight:700 }}>{milestone.status==="completed"?<CheckRoundedIcon fontSize="small"/>:String(i+1).padStart(2,"0")}</Box>
      <Box><Typography sx={{fontWeight:650,fontSize:14}}>{milestone.title}</Typography>{milestone.description && <Typography color="text.secondary" sx={{fontSize:12}}>{milestone.description}</Typography>}</Box>
      <Typography color="text.secondary" sx={{fontSize:12,display:{xs:"none",sm:"block"}}}>{milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : "No date"}</Typography>
      <Chip size="small" label={milestone.status.replace("_", " ")} color={milestone.status==="completed"?"success":milestone.status==="in_progress"?"primary":"default"} sx={{display:{xs:"none",sm:"flex"},textTransform:"capitalize"}}/>
    </Box>)}</WorkspaceCard>}
  </Box>;
}
