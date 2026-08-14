"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Toolbar from "@mui/material/Toolbar";
import type { TaskRow } from "../services/tasksService";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import { useTasks } from "../hooks/useTasks";
import { useProjectStatuses } from "@/features/projects/hooks/useProjectStatuses";
import { createTask, deleteTask, updateTask, updateTaskStatus } from "../services/tasksService";
import { createProjectStatus, deleteProjectStatus } from "@/features/projects/services/projectStatusesService";
import BoardColumn from "./BoardColumn";
import AddColumnButton from "./AddColumnButton";
import TaskCard from "./TaskCard";
import TaskListView from "./TaskListView";

interface KanbanBoardProps {
  projectId: string;
  userId: string;
}

export default function KanbanBoard({ projectId, userId }: KanbanBoardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(projectId, userId);
  const { data: statuses = [], isLoading: statusesLoading } = useProjectStatuses(projectId);
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [dragOverStatusId, setDragOverStatusId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number>(0);
  const [isPanning, setIsPanning] = useState(false);
  const panState = useRef({ startX: 0, scrollLeft: 0 });
  const boardScrollRef = useRef<HTMLDivElement>(null);

  const createMutation = useMutation({
    mutationFn: (values: { title: string; status_id: string; priority: string; due_date: string | null }) =>
      createTask({
        project_id: projectId,
        user_id: userId,
        title: values.title,
        status_id: values.status_id,
        priority: values.priority,
        due_date: values.due_date,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId, userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId, userId] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: { title?: string; priority?: string; due_date?: string | null; status_id?: string } }) =>
      updateTask(taskId, projectId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId, userId] });
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, statusId }: { taskId: string; statusId: string }) =>
      updateTaskStatus(taskId, projectId, statusId),
    onMutate: ({ taskId, statusId }) => {
      queryClient.cancelQueries({ queryKey: ["tasks", projectId, userId] });
      const previousTasks = queryClient.getQueryData<TaskRow[]>(["tasks", projectId, userId]) ?? [];
      queryClient.setQueryData<TaskRow[]>(["tasks", projectId, userId], (old = []) => {
        return old.map((task) => (task.id === taskId ? { ...task, status_id: statusId } : task));
      });
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", projectId, userId], context.previousTasks);
      }
    },
  });

  const addStatusMutation = useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      createProjectStatus(projectId, name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectStatuses", projectId] });
    },
  });

  const deleteStatusMutation = useMutation({
    mutationFn: (statusId: string) => deleteProjectStatus(statusId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectStatuses", projectId] });
    },
  });

  const handleEdit = (task: TaskRow) => {
    console.log("Edit task", task);
  };

  const handleDelete = (taskId: string) => {
    deleteMutation.mutate(taskId);
  };

  const handleUpdateTask = (taskId: string, updates: { title?: string; priority?: string; due_date?: string | null; status_id?: string }) => {
    updateTaskMutation.mutate({ taskId, updates });
  };

  const handleAddColumn = (name: string, color: string) => {
    addStatusMutation.mutate({ name, color });
  };

  const handleDeleteColumn = (statusId: string) => {
    deleteStatusMutation.mutate(statusId);
  };

  const handleCreate = (values: { title: string; status_id: string; priority: string; due_date: string | null }) => {
    createMutation.mutate({
      title: values.title,
      status_id: values.status_id,
      priority: values.priority,
      due_date: values.due_date,
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const isLoading = tasksLoading || statusesLoading;

  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;

  const columns = statuses.map((status) => {
    const columnTasks = tasks
      .filter((t) => t.status_id === status.id)
      .sort((a, b) => a.position - b.position);

    return {
      statusId: status.id,
      statusName: status.name,
      color: status.color,
      tasks: columnTasks,
    };
  });

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveTaskId(id);
    setIsPanning(false);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      setDragOverStatusId(null);
      setDragOverIndex(0);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    let targetStatusId: string;
    const overStatus = statuses.find((s) => s.id === overId);
    if (overStatus) {
      targetStatusId = overId;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        targetStatusId = overTask.status_id;
      } else {
        return;
      }
    }

    const targetTasks = tasks.filter((t) => t.status_id === targetStatusId && t.id !== activeId);

    let index = targetTasks.length;
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && overTask.status_id === targetStatusId) {
      const overIndex = targetTasks.findIndex((t) => t.id === overId);
      if (overIndex !== -1) {
        index = overIndex;
      }
    }

    setDragOverStatusId(targetStatusId);
    setDragOverIndex(Math.max(0, index));
  }, [tasks, statuses]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active } = event;

    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      setActiveTaskId(null);
      setDragOverStatusId(null);
      setDragOverIndex(0);
      return;
    }

    const targetStatusId = dragOverStatusId;

    if (!targetStatusId) {
      setActiveTaskId(null);
      setDragOverStatusId(null);
      setDragOverIndex(0);
      return;
    }

    const sourceStatusId = task.status_id;
    const isSameColumn = sourceStatusId === targetStatusId;

    const otherTasks = tasks.filter((t) => t.id !== taskId);
    const destTasks = otherTasks.filter((t) => t.status_id === targetStatusId);
    const insertIndex = Math.max(0, Math.min(dragOverIndex, destTasks.length));

    let newTasks: TaskRow[];

    if (isSameColumn) {
      const sourceTasks = otherTasks.filter((t) => t.status_id === sourceStatusId);
      const otherColumnTasks = otherTasks.filter((t) => t.status_id !== sourceStatusId);

      const reorderedSourceTasks = [
        ...sourceTasks.slice(0, insertIndex),
        { ...task, status_id: targetStatusId, position: insertIndex },
        ...sourceTasks.slice(insertIndex),
      ];

      const updatedSourceTasks = reorderedSourceTasks.map((t, idx) => ({ ...t, position: idx }));

      const statusOrder = statuses.map((s) => s.id);
      const groupedTasks = new Map<string, TaskRow[]>();

      for (const t of [...otherColumnTasks, ...updatedSourceTasks]) {
        if (!groupedTasks.has(t.status_id)) {
          groupedTasks.set(t.status_id, []);
        }
        groupedTasks.get(t.status_id)!.push(t);
      }

      newTasks = [];
      for (const statusId of statusOrder) {
        const columnTasks = groupedTasks.get(statusId);
        if (columnTasks) {
          newTasks.push(...columnTasks.sort((a, b) => a.position - b.position));
        }
      }
    } else {
      const sourceTasks = otherTasks.filter((t) => t.status_id === sourceStatusId);
      const otherColumnTasks = otherTasks.filter((t) => t.status_id !== sourceStatusId && t.status_id !== targetStatusId);

      const renumberedSourceTasks = sourceTasks.map((t, idx) => ({ ...t, position: idx }));

      const reorderedDestTasks = [
        ...destTasks.slice(0, insertIndex),
        { ...task, status_id: targetStatusId, position: insertIndex },
        ...destTasks.slice(insertIndex),
      ];

      const updatedDestTasks = reorderedDestTasks.map((t, idx) => ({ ...t, position: idx }));

      const statusOrder = statuses.map((s) => s.id);
      const groupedTasks = new Map<string, TaskRow[]>();

      for (const t of [...otherColumnTasks, ...updatedDestTasks, ...renumberedSourceTasks]) {
        if (!groupedTasks.has(t.status_id)) {
          groupedTasks.set(t.status_id, []);
        }
        groupedTasks.get(t.status_id)!.push(t);
      }

      newTasks = [];
      for (const statusId of statusOrder) {
        const columnTasks = groupedTasks.get(statusId);
        if (columnTasks) {
          newTasks.push(...columnTasks.sort((a, b) => a.position - b.position));
        }
      }
    }

    queryClient.setQueryData<TaskRow[]>(["tasks", projectId, userId], newTasks);

    updateTaskStatusMutation.mutate({ taskId: task.id, statusId: targetStatusId });

    setActiveTaskId(null);
    setDragOverStatusId(null);
    setDragOverIndex(0);
  }, [tasks, updateTaskStatusMutation, dragOverStatusId, dragOverIndex, projectId, userId, queryClient, statuses]);

  const handleDragCancel = useCallback(() => {
    setActiveTaskId(null);
    setDragOverStatusId(null);
    setDragOverIndex(0);
  }, []);

  const handleBoardMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (activeTaskId) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, input, textarea, select, [role="menuitem"], .MuiMenu-paper, .MuiDialog-root, [data-sortable="true"]')) {
      return;
    }
    const container = boardScrollRef.current;
    if (!container) return;
    panState.current = { startX: event.clientX, scrollLeft: container.scrollLeft };
    setIsPanning(true);
  }, [activeTaskId]);

  const handleBoardMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    const container = boardScrollRef.current;
    if (!container) return;
    const x = event.clientX;
    const walk = (x - panState.current.startX) * 1.5;
    container.scrollLeft = panState.current.scrollLeft - walk;
  }, [isPanning]);

  const handleBoardMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleBoardMouseLeave = useCallback(() => {
    setIsPanning(false);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8, flex: 1 }}>
        <CircularProgress size={28} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Toolbar
        sx={{
          gap: 1.5,
          pl: 0,
          pr: 0,
          minHeight: "auto !important",
          py: 1,
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode) setViewMode(newMode);
          }}
          size="small"
          sx={{
            bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            borderRadius: "12px",
            "& .Mui-selected": {
              bgcolor: "primary.main !important",
              color: "primary.contrastText !important",
            },
          }}
        >
          <ToggleButton value="board" aria-label="board view">
            <ViewModuleOutlinedIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListOutlinedIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>

      {viewMode === "board" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={(args) => {
            const pointerResult = pointerWithin(args);
            if (pointerResult.length > 0) {
              return pointerResult;
            }
            return closestCorners(args);
          }}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Box
            ref={boardScrollRef}
            className="thin-scrollbar hide-scrollbar"
            onMouseDown={handleBoardMouseDown}
            onMouseMove={handleBoardMouseMove}
            onMouseUp={handleBoardMouseUp}
            onMouseLeave={handleBoardMouseLeave}
            sx={{
              display: "flex",
              gap: 4,
              overflowX: "auto",
              overflowY: "visible",
              pb: 2,
              pt: 1,
              flex: 1,
              alignItems: "flex-start",
              minHeight: 0,
              cursor: isPanning ? "grabbing" : "grab",
              userSelect: isPanning ? "none" : "auto",
            }}
          >
            {columns.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                  textAlign: "center",
                  flex: 1,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor: isDark ? "#1C1929" : "action.hover",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="text.secondary"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </Box>
                <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: 15, mb: 0.5 }}>
                  No workflow statuses configured
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 13, maxWidth: 320, lineHeight: 1.5 }}>
                  Add a status in project settings to get started.
                </Typography>
              </Box>
            ) : (
              <>
                {columns.map((column) => (
                  <BoardColumn
                    key={column.statusId}
                    statusId={column.statusId}
                    statusName={column.statusName}
                    tasks={column.tasks}
                    onCreate={handleCreate}
                    createPending={createMutation.isPending}
                    onEditTask={handleEdit}
                    onDeleteTask={handleDelete}
                    onDeleteColumn={handleDeleteColumn}
                    onUpdateTask={handleUpdateTask}
                    wipLimit={0}
                    activeTaskId={activeTaskId ?? undefined}
                    isDragOver={column.statusId === dragOverStatusId}
                    dragOverIndex={column.statusId === dragOverStatusId ? dragOverIndex : -1}
                  />
                ))}
                <AddColumnButton projectId={projectId} onAdd={handleAddColumn} adding={addStatusMutation.isPending} />
              </>
            )}
          </Box>

          <DragOverlay>
            {activeTask ? (
              <Box
                sx={{
                  opacity: 0.95,
                  transform: "rotate(2deg)",
                  boxShadow: theme.palette.mode === "dark" ? "0 20px 40px rgba(0, 0, 0, 0.4)" : "0 20px 40px rgba(0, 0, 0, 0.15)",
                  borderRadius: "16px",
                  maxWidth: 320,
                }}
              >
                <TaskCard task={activeTask} />
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <Box sx={{ flex: 1, overflow: "auto", py: 2 }}>
          <TaskListView
            tasks={tasks}
            statuses={statuses}
            onCreate={handleCreate}
            createPending={createMutation.isPending}
            onEditTask={handleEdit}
            onDeleteTask={handleDelete}
            onUpdateTask={handleUpdateTask}
          />
        </Box>
      )}
    </Box>
  );
}
