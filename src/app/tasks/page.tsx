"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { useProjectStatusMap } from "@/features/projects/hooks/useProjectStatuses";
import { useAllTasks, useCreateTask } from "@/features/tasks/hooks/useTasks";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { alpha, useTheme } from "@mui/material/styles";
import TaskCard from "@/features/tasks/components/TaskCard";
import TaskForm from "@/features/tasks/components/TaskForm";

export default function TasksPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects(user?.id);
  const { data: tasks = [], isLoading: tasksLoading, isError: tasksError, error: tasksErrorObj } = useAllTasks(user?.id);
  const createTask = useCreateTask(selectedProjectId, user?.id);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const { statuses } = useProjectStatusMap(selectedProjectId || undefined);

  const isLoading = projectsLoading || tasksLoading;

  const handleCreateTask = (values: {
    title: string;
    status_id?: string | null;
    description?: string | null;
    priority: string;
    start_date?: string | null;
    due_date?: string | null;
  }) => {
    createTask.mutate(values, {
      onSuccess: () => {
        setIsFormOpen(false);
        setSelectedProjectId("");
      },
    });
  };

  const handleOpenCreate = () => {
    setSelectedProjectId("");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProjectId("");
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  const groupedTasks = projects.reduce<Record<string, { projectName: string; tasks: typeof tasks }>>((acc, project) => {
    acc[project.id] = { projectName: project.name, tasks: [] };
    return acc;
  }, {});

  for (const task of tasks) {
    const projectId = task.project_id;
    if (!groupedTasks[projectId]) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        groupedTasks[projectId] = { projectName: project.name, tasks: [] };
      }
    }
    if (groupedTasks[projectId]) {
      groupedTasks[projectId].tasks.push(task);
    }
  }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status_id === "done").length;

  return (
    <Box sx={{ maxWidth: 1600, mx: "auto" }}>
      {/* Breadcrumb */}
      <Breadcrumbs
        separator={<NavigateNextRoundedIcon fontSize="small" sx={{ color: "text.disabled" }} />}
        sx={{ mb: 2, "& .MuiBreadcrumbs-li": { fontSize: 13, fontWeight: 600 } }}
      >
        <Link underline="hover" color="text.secondary" href="/" sx={{ cursor: "pointer" }}>
          Workspace
        </Link>
        <Typography color="text.primary" sx={{ fontSize: 13, fontWeight: 700 }}>
          Tasks
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            Tasks
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {totalTasks} tasks across {Object.keys(groupedTasks).length} projects
            {totalTasks > 0 && ` • ${doneTasks} completed`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon fontSize="small" />}
          onClick={handleOpenCreate}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            height: 44,
            px: 2.5,
            flexShrink: 0,
            boxShadow: "none",
            "&:hover": { boxShadow: "none", bgcolor: "primary.dark" },
          }}
        >
          Add Task
        </Button>
      </Box>

      {/* Body */}
      {tasksError ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            py: 8,
            textAlign: "center",
          }}
        >
          <ErrorOutlineOutlinedIcon sx={{ fontSize: 40, color: "error.main" }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Couldn&apos;t load tasks
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            {tasksErrorObj instanceof Error ? tasksErrorObj.message : "Something went wrong. Please try again."}
          </Typography>
        </Box>
      ) : totalTasks === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            py: 8,
            textAlign: "center",
          }}
        >
          <TaskAltOutlinedIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            No tasks yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            Create your first task to start tracking your work.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon fontSize="small" />}
            onClick={handleOpenCreate}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, boxShadow: "none" }}
          >
            Create Task
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Object.values(groupedTasks)
            .filter((group) => group.tasks.length > 0)
            .map((group) => (
              <Box key={group.projectName}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <FolderOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {group.projectName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                      bgcolor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.06) : "#F2F4F7",
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                    }}
                  >
                    {group.tasks.length}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {group.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </Box>
              </Box>
            ))}
        </Box>
      )}

      {/* Add Task modal */}
      <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 20 }}>
          Add Task
        </DialogTitle>
        <DialogContent>
          {selectedProjectId ? (
            <TaskForm
              statuses={statuses}
              onSubmit={handleCreateTask}
              onCancel={handleCloseForm}
              isPending={createTask.isPending}
              error={
                createTask.isError && createTask.error instanceof Error
                  ? createTask.error.message
                  : null
              }
            />
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="task-project-label">Project</InputLabel>
                <Select
                  labelId="task-project-label"
                  value={selectedProjectId}
                  label="Project"
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "flex-end" }}>
          {selectedProjectId ? (
            <Button
              variant="outlined"
              onClick={() => setSelectedProjectId("")}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Back
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={handleCloseForm}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
          )}
          {!selectedProjectId && (
            <Button
              variant="contained"
              onClick={() => setSelectedProjectId(selectedProjectId)}
              disabled={!selectedProjectId}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": { boxShadow: "none", bgcolor: "primary.dark" },
              }}
            >
              Continue
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
