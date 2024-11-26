"use client";
import { Memory } from "@/app/types";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { CloudArrowUp as CloudArrowUpIcon } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import AddMemoryModal from "../Modals/addMemoryModal";
import {
  deleteMemory,
  fetchAllMemories,
  updateMemory,
  uploadMemory,
} from "@/app/apiService/memory-apis";
import MemoryCard from "../MemoryCard/memoryCard";
import MemoryDetailModal from "../Modals/memoryDetailModal";
import SearchBar from "../Search/SearchBar";

function MemoryVaultUI() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const handleViewMemory = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  // Open modal to add memories
  const handleOpen = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const fetchedMemories = await fetchAllMemories();
      setMemories(fetchedMemories);
    } catch (error) {
      alert(`Failed to fetch memories: ${error}`);
    }
  };

  const handleUpload = async (
    location: string,
    tags: string,
    image: File | null
  ) => {
    if (!image) {
      alert("Please select an image to upload");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("File", image);
      formDataToSend.append("Location", location);
      formDataToSend.append("Tags", tags);
      formDataToSend.append("UserID", "1");
      formDataToSend.append("UserName", "destiny");

      const currentDate = new Date().toISOString();
      formDataToSend.append("Created_at", currentDate);
      formDataToSend.append("Updated_at", currentDate);

      await uploadMemory(formDataToSend);

      // Reset and close modal
      setOpenModal(false);
      loadMemories();
    } catch (error) {
      alert(`Failed to upload memory. Please try again: ${error}`);
    }
  };

  const handleDelete = async (memoryId: string) => {
    try {
      await deleteMemory(memoryId);
      loadMemories();
    } catch (error) {
      alert(`Failed to delete memory: ${error}`);
    }
  };

  const handleUpdateMemory = async (
    memoryId: string,
    updatedMemory: Partial<Memory>
  ) => {
    try {
      await updateMemory(memoryId, updatedMemory);
      setMemories((prevMemories) =>
        prevMemories.map((memory) =>
          memory.id === updatedMemory.id
            ? { ...memory, ...updatedMemory }
            : memory
        )
      );
      loadMemories();
      setOpenModal(false);
      setSelectedMemory(null);
    } catch (error) {
      console.error("Failed to update memory:", error);
      alert("Failed to update memory. Please try again.");
    }
  };

  return (
    <>
      <Grid2
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        m={4}
      >
        <Box>
          <Typography variant="h4">Memory Vault</Typography>
          <Typography variant="subtitle2">
            Your AI-powered memory archive
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<CloudArrowUpIcon size={24} />}
          onClick={handleOpen}
        >
          Add Memory
        </Button>
        <AddMemoryModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleUpload}
        />
      </Grid2>
      <Grid2
        container
        size={6}
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <SearchBar />
      </Grid2>

      <Grid2 container spacing={2} justifyContent="center" mx={4}>
        {memories.map((memory) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            onDelete={handleDelete}
            onView={handleViewMemory}
          />
        ))}
      </Grid2>
      {memories.map((memory) => (
        <MemoryDetailModal
          key={memory.id}
          open={!!selectedMemory}
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onUpdate={handleUpdateMemory}
        />
      ))}
    </>
  );
}

export default MemoryVaultUI;
