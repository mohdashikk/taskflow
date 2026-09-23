"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Box, Button, CircularProgress, IconButton, MenuItem, Step, StepLabel, Stepper, TextField, Tooltip, Typography as MuiTypography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { alpha, useTheme } from "@mui/material/styles";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { createProject } from "@/features/projects/services/projectsService";
import { createDefaultStatuses } from "@/features/projects/services/projectStatusesService";
import { createMilestones, type NewMilestone } from "@/features/projects/services/milestonesService";
import WorkspaceCard from "@/features/projects/components/WorkspaceCard";
import ProjectIconPicker from "@/features/projects/components/ProjectIconPicker";
import AppDatePicker from "@/components/inputs/AppDatePicker";

const steps = ["Project details", "Team access", "Milestones", "Review"];
const Typography = MuiTypography as any;
export default function CreateProjectPage() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", startDate: "", dueDate: "", icon: "📁" });
  const [milestones, setMilestones] = useState<NewMilestone[]>([
    { title: "", due_date: "", status: "upcoming" },
  ]);
  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => setForm((old) => ({ ...old, [key]: event.target.value }));
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 48,
      borderRadius: "10px",
      bgcolor: theme.palette.mode === "dark" ? "#1A1728" : "#FFFFFF",
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": { borderColor: theme.palette.primary.main },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main, boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}` },
    },
  };
  const milestoneInputSx = {
    ...inputSx,
    "& .MuiOutlinedInput-root": {
      ...inputSx["& .MuiOutlinedInput-root"],
      height: 48,
    },
    "& .MuiOutlinedInput-input": {
      boxSizing: "border-box",
      height: "100%",
      py: "13px",
    },
  };

  const finish = async () => {
    if (!user?.id || !form.title.trim()) return;
    setSaving(true); setError("");
    try {
      const project = await createProject({
        title: form.title.trim(), description: form.description.trim(), status: "planning",
        due_date: form.dueDate || null, start_date: form.startDate || null,
        icon: form.icon,
        user_id: user.id,
      });
      await createDefaultStatuses(project.id);
      await createMilestones(project.id, user.id, milestones);
      router.push(`/projects/${project.id}/overview`);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not create project."); setSaving(false); }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1120, mx: "auto" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={750}>Create New Project</Typography>
        <Typography color="text.secondary" fontSize={14} mt={0.5}>Set up your workspace, confirm the owner, and define delivery milestones.</Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "240px minmax(0, 1fr)" }, gap: { xs: 2, md: 3 }, alignItems: "start" }}>
        <WorkspaceCard sx={{ p: { xs: 2, md: 2.5 }, alignSelf: "start" }}>
          <Stepper activeStep={step} orientation="vertical">
            {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>
        </WorkspaceCard>
        <WorkspaceCard sx={{ overflow: "hidden" }}>
          <Box sx={{ minHeight: { md: 430 }, p: { xs: 2.5, sm: 3.5, md: 4 } }}>
          {step === 0 && <Box sx={{ display: "grid", gap: 2.5, width: "100%" }}>
            <TextField label="Project name" required value={form.title} onChange={set("title")} placeholder="e.g. Resume flow" sx={inputSx} />
            <Box><Typography fontWeight={650} fontSize={14} mb={1}>Project icon</Typography><ProjectIconPicker value={form.icon} onChange={(icon) => setForm((old) => ({ ...old, icon }))} /></Box>
            <TextField label="Description" multiline minRows={3} value={form.description} onChange={set("description")} placeholder="What is this project about?" sx={inputSx} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <AppDatePicker label="Start date" value={form.startDate} onChange={(startDate) => setForm((old) => ({ ...old, startDate }))} fullWidth sx={inputSx} />
              <AppDatePicker label="Deadline" value={form.dueDate} onChange={(dueDate) => setForm((old) => ({ ...old, dueDate }))} fullWidth sx={inputSx} />
            </Box>
          </Box>}
          {step === 1 && <Box sx={{ width: "100%" }}>
            <Box sx={{display:"flex",alignItems:"center",gap:1.25}}><Box sx={{width:32,height:32,borderRadius:"10px",display:"grid",placeItems:"center",bgcolor:"action.selected",color:"primary.main"}}><GroupOutlinedIcon fontSize="small" /></Box><Typography fontWeight={700} fontSize={18}>Team access</Typography></Box>
            <Box sx={{ display:"flex", alignItems:"center", p:1.25, mt:2, border:"1px solid", borderColor:"divider", borderRadius:"14px", bgcolor:"background.default" }}>
              <Tooltip title={`${user?.user_metadata?.display_name || user?.email || "You"} · Project owner`} arrow>
                <Avatar aria-label="Project owner" sx={{width:38,height:38,bgcolor:alpha(theme.palette.primary.main,0.12),color:"primary.main",fontSize:14,fontWeight:700,cursor:"default",transition:"transform 160ms ease","&:hover":{transform:"translateY(-2px)",boxShadow:`0 4px 10px ${alpha(theme.palette.primary.main,0.2)}`}}}>{(user?.user_metadata?.display_name || user?.email || "Y").charAt(0).toUpperCase()}</Avatar>
              </Tooltip>
            </Box>
          </Box>}
          {step === 2 && <Box sx={{ width: "100%" }}>
            <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:2,mb:0.5}}><Typography fontWeight={700} fontSize={18}>Milestones</Typography><Button startIcon={<AddRoundedIcon/>} onClick={()=>setMilestones(old=>[...old,{title:"",due_date:"",status:"upcoming"}])}>Add milestone</Button></Box>
            <Box sx={{display:"grid",gap:2,mt:2.5}}>{milestones.map((milestone,index)=><Box key={index} sx={{display:"grid",gridTemplateColumns:{xs:"minmax(0, 1fr) 48px", sm:"minmax(220px, 1fr) 170px 160px 48px"},gap:1.5,alignItems:"center"}}>
              <TextField size="small" label={`Milestone ${index+1}`} value={milestone.title} onChange={e=>setMilestones(old=>old.map((m,i)=>i===index?{...m,title:e.target.value}:m))} sx={milestoneInputSx}/>
              <AppDatePicker label="Due date" value={milestone.due_date || ""} onChange={due_date=>setMilestones(old=>old.map((m,i)=>i===index?{...m,due_date}:m))} fullWidth sx={{...milestoneInputSx,gridColumn:{xs:"1 / -1",sm:"auto"},gridRow:{xs:2,sm:"auto"}}}/>
              <TextField select size="small" label="Status" value={milestone.status} onChange={e=>setMilestones(old=>old.map((m,i)=>i===index?{...m,status:e.target.value as NewMilestone["status"]}:m))} sx={{...milestoneInputSx,gridColumn:{xs:"1 / -1",sm:"auto"},gridRow:{xs:3,sm:"auto"}}}><MenuItem value="upcoming">Upcoming</MenuItem><MenuItem value="in_progress">In progress</MenuItem><MenuItem value="completed">Completed</MenuItem></TextField>
              <IconButton aria-label="Remove milestone" disabled={milestones.length===1} onClick={()=>setMilestones(old=>old.filter((_,i)=>i!==index))} sx={{width:48,height:48,border:"1px solid",borderColor:"divider",borderRadius:"10px",gridColumn:{xs:2,sm:"auto"},gridRow:{xs:1,sm:"auto"}}}><DeleteOutlineRoundedIcon/></IconButton>
            </Box>)}</Box>
          </Box>}
          {step === 3 && <Box>
            <Box sx={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:0.5,mb:3}}>
              <Typography fontWeight={700} fontSize={18} lineHeight={1.3}>Review project</Typography>
              <Typography color="text.secondary" fontSize={14} lineHeight={1.5}>Confirm the information below before creating the project.</Typography>
            </Box>
            {[['Project', form.title], ['Owner', user?.user_metadata?.display_name || user?.email || 'You'], ['Milestones', `${milestones.filter(m=>m.title.trim()).length} stages`], ['Timeline', `${form.startDate || 'Not set'} — ${form.dueDate || 'Not set'}`]].map(([a,b]) => <Box key={a} sx={{ display:"flex", justifyContent:"space-between", py:1.5, borderBottom:"1px solid", borderColor:"divider" }}><Typography color="text.secondary">{a}</Typography><Typography fontWeight={600}>{b}</Typography></Box>)}
          </Box>}
          {error && <Typography color="error" fontSize={14} mt={2}>{error}</Typography>}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1.5, px: { xs: 2.5, sm: 3.5, md: 4 }, py: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
            <Button variant="outlined" onClick={() => step === 0 ? router.back() : setStep(step - 1)}>Back</Button>
            {step < 3 ? <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} disabled={step === 0 && !form.title.trim()} onClick={() => setStep(step + 1)}>Next</Button> : <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <CheckRoundedIcon />} disabled={saving} onClick={finish}>Create project</Button>}
          </Box>
        </WorkspaceCard>
      </Box>
    </Box>
  );
}
