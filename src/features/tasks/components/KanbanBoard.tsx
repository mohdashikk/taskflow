"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useTasks } from "../hooks/useTasks";
import { useProjectStatuses } from "@/features/projects/hooks/useProjectStatuses";
import { createTask, deleteTask, updateTaskStatus, updateTask } from "../services/tasksService";
import { createProjectStatus, deleteProjectStatus } from "@/features/projects/services/projectStatusesService";
import BoardColumn from "./BoardColumn";
import AddColumnButton from "./AddColumnButton";
import TaskCard from "./TaskCard";
import type { TaskRow } from "../services/tasksService";

interface KanbanBoardProps {
  projectId: string;
  userId: string;
}

interface Column {
  statusId: string;
  statusName: string;
  color: string;
  tasks: TaskRow[];
  wipLimit: number;
}

export default function KanbanBoard({ projectId, userId }: KanbanBoardProps) {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(projectId, userId);
  const { data: statuses = [], isLoading: statusesLoading } = useProjectStatuses(projectId);
  const queryClient = useQueryClient();

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

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
    onMutate: async ({ taskId, statusId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId, userId] });
      const previousTasks = queryClient.getQueryData<TaskRow[]>(["tasks", projectId, userId]);

      queryClient.setQueryData<TaskRow[]>(["tasks", projectId, userId], (old = []) => {
        return old.map((task) => (task.id === taskId ? { ...task, status_id: statusId } : task));
      });

      setActiveTaskId(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const isLoading = tasksLoading || statusesLoading;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={28} sx={{ color: "#006F99" }} />
      </Box>
    );
  }

  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;

  const columns: Column[] = statuses.map((status) => ({
    statusId: status.id,
    statusName: status.name,
    color: status.color,
    tasks: tasks.filter((t) => t.status_id === status.id),
    wipLimit: 0,
  }));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // no-op: required by DndContext v6
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTaskId(null);
      return;
    }

    const taskId = active.id as string;
    const overId = over.id as string;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
      setActiveTaskId(null);
      return;
    }

    const targetColumn = columns.find((c) => c.statusId === overId);
    if (targetColumn) {
      if (task.status_id !== targetColumn.statusId) {
        updateTaskStatusMutation.mutate({
          taskId: task.id,
          statusId: targetColumn.statusId,
        });
      } else {
        setActiveTaskId(null);
      }
      return;
    }

    const targetTask = tasks.find((t) => t.id === overId);
    if (targetTask && task.status_id !== targetTask.status_id) {
      updateTaskStatusMutation.mutate({
        taskId: task.id,
        statusId: targetTask.status_id,
      });
    } else {
      setActiveTaskId(null);
    }
  };

  const handleCreate = (values: { title: string; status_id: string; priority: string; due_date: string | null }) => {
    createMutation.mutate({
      title: values.title,
      status_id: values.status_id,
      priority: values.priority,
      due_date: values.due_date,
    });
  };

  return (
    <>
      {/* Board Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#111827",
              fontSize: 22,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Project Tasks
          </Typography>
          <Typography
            sx={{
              color: "#6B7280",
              fontSize: 14,
              mt: 0.5,
              display: "block",
              lineHeight: 1.5,
            }}
          >
            {tasks.length} work items across {columns.length} columns
          </Typography>
        </Box>
      </Box>

      {/* Board Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            pb: 2,
            flex: 1,
            alignItems: "flex-start",
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#D1D5DB",
              borderRadius: 3,
              "&:hover": { bgcolor: "#9CA3AF" },
            },
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
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: "#F2F4F7",
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
                  stroke="#6B7280"
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
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#111827",
                  fontSize: 15,
                  mb: 0.5,
                }}
              >
                No workflow statuses configured
              </Typography>
              <Typography
                sx={{
                  color: "#6B7280",
                  fontSize: 13,
                  maxWidth: 320,
                  lineHeight: 1.5,
                }}
              >
                Add a status in project settings to get started.
              </Typography>
            </Box>
          ) : (
            <>
              {columns.map((column) => (
                <BoardColumn
                  key={column.statusId || column.statusName}
                  statusId={column.statusId}
                  statusName={column.statusName}
                  tasks={column.tasks}
                  onCreate={handleCreate}
                  createPending={createMutation.isPending}
                  onEditTask={handleEdit}
                  onDeleteTask={handleDelete}
                  onDeleteColumn={handleDeleteColumn}
                  onUpdateTask={handleUpdateTask}
                  wipLimit={column.wipLimit}
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
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                borderRadius: "14px",
                maxWidth: 320,
              }}
            >
              <TaskCard task={activeTask} />
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
