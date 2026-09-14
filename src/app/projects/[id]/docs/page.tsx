"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, Button, CircularProgress, Divider, TextField, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchProjectDocuments } from "@/features/projects/services/documentsService";
import WorkspaceCard from "@/features/projects/components/WorkspaceCard";

export default function DocsPage() {
  const { id } = useParams<{ id: string }>(); const { user } = useAuth(); const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data = [], isLoading, error } = useQuery({ queryKey:["project-documents",id,user?.id], queryFn:()=>fetchProjectDocuments(id,user!.id), enabled:Boolean(id&&user?.id) });
  const active = data.find(document => document.id === selectedId) ?? data[0];

  return <Box><Box sx={{mb:2.5}}><Typography variant="h6" sx={{fontWeight:750}}>Project documentation</Typography><Typography color="text.secondary" sx={{fontSize:13}}>Only documents stored in Supabase are shown here.</Typography></Box>
    {isLoading && <Box sx={{display:"grid",placeItems:"center",py:8}}><CircularProgress size={28}/></Box>}
    {error && <Alert severity="error">{error instanceof Error ? error.message : "Could not load documents."}</Alert>}
    {!isLoading && !error && data.length===0 && <WorkspaceCard sx={{p:6,textAlign:"center"}}><DescriptionOutlinedIcon sx={{fontSize:38,color:"text.disabled",mb:1}}/><Typography sx={{fontWeight:700}}>No documents in the database</Typography><Typography color="text.secondary" sx={{fontSize:14,mt:.5}}>Add rows to project_documents for this project to display them here.</Typography></WorkspaceCard>}
    {!isLoading && !error && active && <WorkspaceCard sx={{display:"grid",gridTemplateColumns:{xs:"1fr",md:"230px 1fr"},minHeight:520,overflow:"hidden"}}>
      <Box sx={{p:2,borderRight:{md:"1px solid"},borderBottom:{xs:"1px solid",md:0},borderColor:"divider"}}>{data.map(document=><Button key={document.id} fullWidth onClick={()=>setSelectedId(document.id)} startIcon={<DescriptionOutlinedIcon/>} sx={{justifyContent:"flex-start",mb:.5,bgcolor:active.id===document.id?"action.selected":"transparent",color:active.id===document.id?"primary.main":"text.secondary"}}>{document.title}</Button>)}</Box>
      <Box><Box sx={{p:2}}><Typography color="text.secondary" sx={{fontSize:12}}>Last updated {new Date(active.updated_at).toLocaleString()}</Typography></Box><Divider/><Box sx={{p:{xs:2,sm:4}}}><Typography variant="h5" sx={{fontWeight:750,mb:2}}>{active.title}</Typography><TextField value={active.content} multiline fullWidth minRows={14} variant="standard" slotProps={{input:{disableUnderline:true,readOnly:true}}} sx={{"& textarea":{fontSize:14,lineHeight:1.9}}}/></Box></Box>
    </WorkspaceCard>}
  </Box>;
}
